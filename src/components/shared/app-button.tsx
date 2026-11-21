import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const appButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        primary: "bg-navy text-white shadow-sm hover:bg-navy-soft",
        gold: "bg-gold text-navy shadow-sm hover:bg-gold-soft",
        outline:
          "border border-navy/25 bg-white text-navy hover:border-gold hover:bg-ivory",
        light:
          "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20",
        ghost: "text-navy hover:bg-ivory",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type BaseProps = VariantProps<typeof appButtonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
};

type ButtonProps = BaseProps & {
  href?: never;
  external?: never;
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  name?: string;
  value?: string;
};

export function AppButton(props: LinkProps | ButtonProps) {
  const { className, variant, size, children } = props;
  const classes = cn(appButtonVariants({ variant, size }), className);

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;

  return (
    <button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      name={buttonProps.name}
      value={buttonProps.value}
      className={classes}
    >
      {children}
    </button>
  );
}
