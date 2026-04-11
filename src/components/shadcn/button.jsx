import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-brand-500 to-cyan-500 text-white hover:shadow-glow hover:-translate-y-0.5",
        secondary:
          "bg-dark-200/80 border border-brand-500/20 text-gray-300 hover:border-brand-500/40 hover:text-white hover:bg-dark-200",
        ghost:
          "text-gray-400 hover:text-white hover:bg-white/5",
        danger:
          "bg-gradient-to-r from-danger-500 to-red-600 text-white hover:-translate-y-0.5",
        success:
          "bg-gradient-to-r from-success-500 to-emerald-400 text-black hover:shadow-success-glow hover:-translate-y-0.5",
        outline:
          "border border-brand-500/30 bg-transparent text-gray-300 hover:bg-brand-500/10 hover:border-brand-500/50 hover:text-white",
        link:
          "text-brand-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
