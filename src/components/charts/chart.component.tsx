"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { charData } from "./chart-data";

const chartConfig = {
  value: {
    label: "2023 Unresolved Queries",
    color: "#00999E",
  },
  // mobile: {
  //   label: "Mobile",
  //   color: "#60a5fa",
  // },
} satisfies ChartConfig;

export default function Chart() {
  return (
    <ChartContainer config={chartConfig} className="max-h-[500px] w-full">
      <BarChart accessibilityLayer data={charData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis></YAxis>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="value" fill="#00999E" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
