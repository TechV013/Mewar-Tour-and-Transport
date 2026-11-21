import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { createServer } from "node:http";
import { readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { validateEnvironment } from "../src/lib/env/rules.mjs";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const port = Number(process.env.MTT_TEST_PORT ?? 3100);
const baseUrl = `http://127.0.0.1:${port}`;
const adminToken = "test-admin-token-1234567890";
const webhookSecret = "test-webhook-secret-123456";
const siteUrl = "https://mtt-test.example";
const dataFile = path.join(os.tmpdir(), `mtt-regression-${process.pid}.json`);

/** @type {{ raw: string, signature: string | undefined }[]} */
const webhookRequests = [];
/** @type {import("node:child_process").ChildProcess | undefined} */
let server;
/** @type {import("node:http").Server | undefined} */
let webhookServer;
let serverLogs = "";

async function waitFor(predicate, timeoutMs = 20000) {
  const start = Date.now();
  while (!(await predicate())) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out. Server logs:\n${serverLogs}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

async function postEnquiry(ip, payload, requestId) {
  return fetch(`${baseUrl}/api/enquiries`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
      "x-request-id": requestId,
    },
    body: JSON.stringify(payload),
    redirect: "manual",
  });
}

before(async () => {
  webhookServer = createServer((request, response) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      webhookRequests.push({
        raw,
        signature: request.headers["x-mtt-signature"],
      });
      response.writeHead(200, { "content-type": "application/json" });
      response.end('{"ok":true}');
    });
  });
  await new Promise((resolve) => webhookServer.listen(0, "127.0.0.1", resolve));
  const webhookPort = webhookServer.address().port;

  const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_ENV: "production",
      ADMIN_TOKEN: adminToken,
      ADMIN_COOKIE_SECURE: "false",
      ENQUIRY_DATA_FILE: dataFile,
      ENQUIRY_WEBHOOK_URL: `http://127.0.0.1:${webhookPort}/hook`,
      ENQUIRY_WEBHOOK_SECRET: webhookSecret,
      NEXT_PUBLIC_SITE_URL: siteUrl,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });

  await waitFor(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/health`, {
        signal: AbortSignal.timeout(1000),
      });
      return response.status === 200;
    } catch {
      return false;
    }
  });
});

after(async () => {
  if (server && !server.killed) server.kill("SIGTERM");
  if (webhookServer) {
    await new Promise((resolve) => webhookServer.close(resolve));
  }
  await rm(dataFile, { force: true });
});

test("env validation catches invalid values and keeps empty optionals unset", () => {
  const valid = validateEnvironment({
    NODE_ENV: "production",
    ADMIN_TOKEN: adminToken,
    DATABASE_URL: "postgresql://user:pass@host:5432/mtt",
    NEXT_PUBLIC_SITE_URL: siteUrl,
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.config.admin, true);
  assert.equal(valid.config.database, true);
  assert.equal(valid.config.fileFallback, false);

  const invalid = validateEnvironment({
    NODE_ENV: "production",
    ADMIN_TOKEN: "short",
    DATABASE_URL: "mysql://host/db",
    ENQUIRY_WEBHOOK_URL: "ftp://host/hook",
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.some((error) => error.startsWith("ADMIN_TOKEN:")));
  assert.ok(invalid.errors.some((error) => error.startsWith("DATABASE_URL:")));
  assert.ok(
    invalid.errors.some((error) => error.startsWith("ENQUIRY_WEBHOOK_URL:")),
  );

  const empty = validateEnvironment({
    DATABASE_URL: "",
    ADMIN_TOKEN: "",
    NEXT_PUBLIC_BUSINESS_EMAIL: "",
  });
  assert.equal(empty.config.fileFallback, true);
  assert.equal(empty.config.admin, false);
});

test("env check CLI fails on invalid configuration", () => {
  const result = spawnSync(process.execPath, ["scripts/check-env.mjs"], {
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: "mysql://bad" },
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stdout, /DATABASE_URL:/);
});

test("health endpoint is healthy and never exposes secrets", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(body.store, "ok");
  assert.equal(body.config.webhookSigned, true);
  const serialised = JSON.stringify(body);
  assert.ok(!serialised.includes(adminToken));
  assert.ok(!serialised.includes(webhookSecret));
});

test("enquiry API stores the record and delivers a signed webhook", async () => {
  const response = await postEnquiry(
    "203.0.113.10",
    {
      service: "contact",
      name: "Regression Smoke",
      phone: "9876543210",
      details: {
        name: "Regression Smoke",
        phone: "9876543210",
        email: "regression@example.com",
        message: "Automated regression enquiry",
      },
    },
    "regression-request-001",
  );
  assert.equal(response.status, 201);
  assert.equal(response.headers.get("x-request-id"), "regression-request-001");
  const result = await response.json();
  assert.match(result.reference, /^MTT-[A-Z0-9]{6}$/);

  await waitFor(() => webhookRequests.length > 0);
  const hook = webhookRequests[0];
  const expected = `sha256=${createHmac("sha256", webhookSecret)
    .update(hook.raw)
    .digest("hex")}`;
  assert.equal(hook.signature, expected);
  assert.equal(JSON.parse(hook.raw).data.reference, result.reference);

  const records = JSON.parse(await readFile(dataFile, "utf8"));
  const record = records.find((item) => item.reference === result.reference);
  assert.ok(record);
  assert.equal(record.name, "Regression Smoke");
  assert.equal(record.email, "regression@example.com");
  assert.equal(record.status, "NEW");
});

test("invalid payloads are rejected and repeated requests are rate limited", async () => {
  const ip = "203.0.113.11";
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await postEnquiry(ip, {}, `invalid-request-${attempt}`);
    assert.equal(response.status, 400);
    assert.equal(
      response.headers.get("x-request-id"),
      `invalid-request-${attempt}`,
    );
  }
  const limited = await postEnquiry(ip, {}, "invalid-request-5");
  assert.equal(limited.status, 429);
});

test("admin access is protected and token login establishes a session", async () => {
  const anonymous = await fetch(`${baseUrl}/admin`, { redirect: "manual" });
  assert.equal(anonymous.status, 307);
  assert.match(anonymous.headers.get("location") ?? "", /\/admin\/login/);

  const loginPage = await fetch(`${baseUrl}/admin/login`, {
    redirect: "manual",
  });
  const html = await loginPage.text();
  const actionId = html.match(/name="(\$ACTION_ID_[a-f0-9]+)"/)?.[1];
  assert.ok(actionId, "login form exposes its server action id");

  const form = new FormData();
  form.set(actionId, "");
  form.set("token", adminToken);
  const login = await fetch(`${baseUrl}/admin/login`, {
    method: "POST",
    body: form,
    redirect: "manual",
  });
  assert.ok([302, 303, 307].includes(login.status));
  const cookie = login.headers.get("set-cookie")?.split(";")[0] ?? "";
  assert.match(cookie, /^mtt_admin=/);

  const dashboard = await fetch(`${baseUrl}/admin`, {
    headers: { cookie },
  });
  assert.equal(dashboard.status, 200);
  assert.match(await dashboard.text(), /Enquiries/);
});

test("metadata routes use the configured origin and pages localize correctly", async () => {
  const robots = await (await fetch(`${baseUrl}/robots.txt`)).text();
  assert.match(robots, new RegExp(`Sitemap: ${siteUrl}/sitemap\\.xml`));
  assert.match(robots, /Disallow: \/admin\//);

  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  assert.ok(sitemap.includes(`${siteUrl}/en`));
  assert.ok(sitemap.includes(`${siteUrl}/hi`));

  for (const locale of ["en", "hi"]) {
    const html = await (await fetch(`${baseUrl}/${locale}`)).text();
    assert.match(html, new RegExp(`<html[^>]+lang="${locale}"`));
    assert.match(html, /<h1/);
    assert.ok(!html.includes("pages.taxi.includes"));
  }
});
