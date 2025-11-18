import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "glass-button bg-primary/80 text-primary-foreground shadow hover:bg-primary/90",
        destructive: "glass-button bg-destructive/80 text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "glass-button border border-input shadow-sm hover:text-accent-foreground",
        secondary: "glass-button bg-secondary/80 text-secondary-foreground shadow-sm hover:bg-secondary/90",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        royal: "glass-button btn-royal text-royal-foreground shadow-md hover:shadow-lg",
        gold: "glass-button btn-gold text-gold-foreground shadow-md hover:shadow-lg",
        crimson: "glass-button btn-crimson text-crimson-foreground shadow-md hover:shadow-lg",
        hero: "glass-button btn-royal text-royal-foreground shadow-lg hover:shadow-xl transform hover:scale-105",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6 sm:px-8",
        xl: "h-10 sm:h-12 rounded-lg px-6 sm:px-10 text-sm sm:text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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

export { Button, buttonVariants };