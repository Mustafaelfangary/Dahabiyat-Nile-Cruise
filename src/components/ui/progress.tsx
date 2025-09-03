"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Try to import Radix UI Progress, fallback to custom implementation
interface ProgressPrimitive {
  Root: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;
  Indicator: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties } & React.RefAttributes<HTMLDivElement>>;
}

let ProgressPrimitive: ProgressPrimitive;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ProgressPrimitive = require("@radix-ui/react-progress");
} catch {
  // Fallback implementation if Radix UI is not available
  const ProgressRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={className} {...props} />
    )
  );
  ProgressRoot.displayName = "ProgressRoot";
  
  const ProgressIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }>(
    ({ className, style, ...props }, ref) => (
      <div ref={ref} className={className} style={style} {...props} />
    )
  );
  ProgressIndicator.displayName = "ProgressIndicator";
  
  ProgressPrimitive = {
    Root: ProgressRoot,
    Indicator: ProgressIndicator
  };
}

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-amber-600 transition-all duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
)
Progress.displayName = "Progress"

export { Progress }
