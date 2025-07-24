"use client"
import React, { useState, useEffect } from 'react';
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
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



export function FinalHypothesisPiechart() {
  const [chartData, setChartData] = useState<
    Array<{ browser: string; visitors: number; fill?: string }>
  >([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchFinalHypothesisCount = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/finalHypothesisCount');
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
        ];
        const formatted = data.map((item: any, idx: number) => ({
          hypothesis: item.final_claim ? item.final_claim.charAt(0).toUpperCase() + item.final_claim.slice(1).toLowerCase() : "Other",
          total: item.claim_count,
          fill: colors[idx % colors.length],
        }));
        setChartData(formatted);
      } catch (err) {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFinalHypothesisCount();
  }, []);

  const chartConfig = {
    visitors: {
      label: "Final Claim",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Final Hypothesis Distribution</CardTitle>
        <CardDescription>Measure of each hypothesis chosen end of game</CardDescription>
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
              nameKey="hypothesis"
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