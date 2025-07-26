"use client"
import { useState, useEffect } from 'react';
import { Pie, PieChart, Sector } from "recharts"
import type { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type {
  ChartConfig,
} from "../ui/chart.tsx"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart.tsx"

export const description = "A donut chart with an active sector"



export function MostCommonlyFoundEvidence() {
  const [chartData, setChartData] = useState<
    Array<{ browser: string; visitors: number; fill?: string }>
  >([]);
  const [loading, setLoading] = useState(false);


 useEffect(() => {
  const fetchMostCommonlyFoundEvidence = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://alive.educ.ubc.ca/fsd2/api/mostCommonlyFoundEvidence');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Map API data to recharts format
      const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
        "var(--chart-6)",
        "var(--chart-7)",
        "var(--chart-8)",
        "var(--chart-9)",
        "var(--chart-10)",
        "var(--chart-11)",
        "var(--chart-12)",
        "var(--chart-13)",
        "var(--chart-14)",
      ];
      const formatted = data.map((item: any, idx: number) => ({
        evidence: item.item_name
          ? item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1).toLowerCase()
          : "Other",
        total: item.item_count,
        fill: colors[idx % colors.length],
      }));
      setChartData(formatted);
    } catch (err) {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };
  fetchMostCommonlyFoundEvidence();
}, []);

  const chartConfig = {
    visitors: {
      label: "Final Claim",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Commonly Found Evidence</CardTitle>
        <CardDescription>Total measure of each evidence found for entire gameplay</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="evidence"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
        {loading && <div className="text-center text-xs mt-2">Loading...</div>}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
        </div>
        <div className="text-muted-foreground leading-none">
        </div>
      </CardFooter>
    </Card>
  )
}