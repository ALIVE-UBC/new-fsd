"use client"
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

export const description = "A multiple bar chart";

const chartConfig = {
  initial: {
    label: "Initial Claims",
    color: "var(--chart-1)",
  },
  final: {
    label: "Final Claims",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function FirstFinalClaim() {
  const [chartData, setChartData] = useState<
    { hypothesis: string; initial: number; final: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFirstFinalClaim = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/firstFinalClaim");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Map API data to recharts format
        const formatted = data.map((item: any) => ({
          hypothesis: item.hypothesis
            ? item.hypothesis.charAt(0).toUpperCase() + item.hypothesis.slice(1).toLowerCase()
            : "Other",
          initial: item.initial_claims_count,
          final: item.final_claims_count,
        }));
        setChartData(formatted);
      } catch {
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstFinalClaim();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Initial vs Final Hypothesis Claims</CardTitle>
        <CardDescription>Total measure of the number of initial and final claims for each </CardDescription>
      </CardHeader>
      <CardContent>
     <ChartContainer config={chartConfig}>
  <BarChart
    accessibilityLayer
    data={chartData}
    layout="vertical"
    margin={{ left: 30 }}
  >
    <CartesianGrid vertical={false} />
    <YAxis
      type="category"
      dataKey="hypothesis"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
    />
    <XAxis
      type="number"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
    />
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent indicator="dashed" />}
    />
    <Bar dataKey="initial" fill="var(--chart-1)" radius={4} />
    <Bar dataKey="final" fill="var(--chart-2)" radius={4} />
  </BarChart>
</ChartContainer>
{loading && <div className="text-center text-xs mt-2">Loading...</div>}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
        </div>
        <div className="text-muted-foreground leading-none">
          Note: hypothesis with 0 claims are not shown in the chart.
        </div>
      </CardFooter>
    </Card>
  );
}