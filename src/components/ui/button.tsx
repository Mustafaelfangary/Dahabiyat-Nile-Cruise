import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-amber-500 to-orange-600 text-black hover:from-amber-600 hover:to-orange-700 shadow-lg border border-amber-600/30": variant === "primary",
            "bg-white/95 text-black hover:bg-amber-50 border border-amber-300 backdrop-blur-sm": variant === "secondary",
            "border border-amber-500 bg-transparent text-black hover:bg-amber-500 hover:text-black backdrop-blur-sm": variant === "outline",
            "bg-transparent hover:bg-papyrus hover:text-hieroglyph-brown": variant === "ghost",
            "bg-red-600 text-black hover:bg-red-700": variant === "destructive",
            "h-6 px-2 text-xs": size === "xs",
            "h-8 px-3": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-12 px-6": size === "lg",
            "h-9 w-9 p-0": size === "icon"
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
