import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-500/10 text-brand-400",
        success:
          "border-success-500/20 bg-success-500/10 text-success-500",
        warning:
          "border-warning-500/20 bg-warning-500/10 text-warning-500",
        danger:
          "border-danger-500/20 bg-danger-500/10 text-danger-500",
        outline:
          "border-brand-500/20 text-gray-400",
        secondary:
          "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
