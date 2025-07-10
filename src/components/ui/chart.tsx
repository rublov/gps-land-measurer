import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Removed circular imports from "@/components/ui/chart"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart-components"; // Assuming these are in a separate file or defined here

import { cn } from "@/lib/utils";

type ChartProps = React.ComponentProps<typeof ChartContainer>;

type ChartPrimitiveProps =
  | React.ComponentProps<typeof LineChart>
  | React.ComponentProps<typeof BarChart>
  | React.ComponentProps<typeof AreaChart>
  | React.ComponentProps<typeof PieChart>;

type ChartPrimitiveElement =
  | React.ElementRef<typeof LineChart>
  | React.ElementRef<typeof BarChart>
  | React.ElementRef<typeof AreaChart>
  | React.ElementRef<typeof PieChart>;

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <Chart>");
  }

  return context;
}

type ChartContextProps = {
  config: ChartConfig;
};

const Chart = React.forwardRef<
  HTMLDivElement,
  ChartProps & { config: ChartConfig }
>(({ config, className, children, ...props }, ref) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <ChartContainer
        ref={ref}
        className={cn("min-h-[200px] w-full", className)}
        {...props}
      >
        {children}
      </ChartContainer>
    </ChartContext.Provider>
  );
});
Chart.displayName = "Chart";

const ChartTooltipLabel = ({
  payload,
  ...props
}: React.ComponentProps<typeof ChartTooltipContent>) => {
  if (!payload || payload.length === 0) {
    return null;
  }

  const entry = payload[0];
  const { name, value } = entry as { name: string; value: any }; // Cast to ensure string methods exist

  if (typeof name === "string" && name.includes(".")) {
    return (
      <div className="grid min-w-[130px] gap-1 px-2 py-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{name.split(".")[0]}</span>
          <span className="text-foreground">{name.split(".")[1]}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Value</span>
          <span className="text-foreground">{value}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-w-[130px] gap-1 px-2 py-1">
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground">{name}</span>
        <span className="text-foreground">{value}</span>
      </div>
    </div>
  );
};

const ChartCrosshair = React.forwardRef<
  SVGRectElement,
  {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke: string;
    strokeWidth: number;
    strokeDasharray: string;
  }
>(({ x, y, width, height, stroke, strokeWidth, strokeDasharray }, ref) => {
  return (
    <rect
      ref={ref}
      x={x}
      y={y}
      width={width}
      height={height}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      className="pointer-events-none"
    />
  );
});
ChartCrosshair.displayName = "ChartCrosshair";

export {
  Chart,
  ChartTooltipLabel,
  ChartCrosshair,
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  AreaChart,
  Area,
};

// Placeholder for chart-components.tsx if they are not in separate files
// In a real shadcn/ui setup, these would be in their own files or defined directly.
// For now, defining them here to resolve compilation.
export type ChartConfig = Record<string, {
  label?: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}>;

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig;
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    {children}
  </div>
));
ChartContainer.displayName = "ChartContainer";

export const ChartTooltip = Tooltip;
export const ChartTooltipContent = TooltipContent;
export const ChartLegend = Legend;
export const ChartLegendContent = Legend;