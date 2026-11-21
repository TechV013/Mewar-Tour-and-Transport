import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

/** `items` are next-intl message keys, resolved in the active locale. */
export async function CheckList({
  items,
  columns = 1,
}: {
  items: readonly string[];
  columns?: 1 | 2;
}) {
  const t = await getTranslations();

  return (
    <ul
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-navy/75">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[#8a662b]">
            <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span>{t(item)}</span>
        </li>
      ))}
    </ul>
  );
}
