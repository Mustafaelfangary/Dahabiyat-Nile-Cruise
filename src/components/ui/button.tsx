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
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
          {
            "bg-gradient-to-r from-ocean-blue to-blue-600 text-white hover:from-blue-600 hover:to-ocean-blue shadow-lg border border-blue-600/30": variant === "primary",
            "bg-white/95 text-black hover:bg-blue-50 border border-blue-300 backdrop-blur-sm": variant === "secondary",
            "border border-ocean-blue bg-transparent text-black hover:bg-ocean-blue hover:text-white backdrop-blur-sm": variant === "outline",
            "bg-transparent hover:bg-blue-50 hover:text-black": variant === "ghost",
            "bg-red-600 text-black hover:bg-red-700": variant === "destructive",
            "h-8 px-2 text-xs min-h-[32px]": size === "xs",
            "h-10 px-3 min-h-[40px]": size === "sm",
            "h-12 px-4 py-2 min-h-[44px]": size === "md",
            "h-14 px-6 min-h-[48px]": size === "lg",
            "h-10 w-10 p-0 min-h-[40px] min-w-[40px]": size === "icon"
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
