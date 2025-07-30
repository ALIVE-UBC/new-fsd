"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import { useState, useEffect } from "react"

export const description = "A mixed bar chart"


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function TotalVisitedZones() {
  const [chartData, setChartData] = useState<Array<{ zone: string; visitors: number; fill?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchMostVisitedAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5001/api/totalVisitedZones');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
        zone: item.zone_name
          ? item.zone_name.charAt(0).toUpperCase() + item.zone_name.slice(1).toLowerCase()
          : "Other",
        visitors: item.visit_count,
        fill: colors[idx % colors.length],
      }));
      setChartData(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch most visited areas');
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };
  fetchMostVisitedAreas();
}, []);

// This is our custom component for rendering wrapped labels
const CustomXAxisTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
  const label = payload.value;

  // Split the label string by spaces to get an array of words
  const words = label.split(' ');

  // If there's only one word, render it normally
  if (words.length === 1) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {label}
        </text>
      </g>
    );
  }

  // If there are multiple words, render them on separate lines
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {/* Render each word on a new <tspan> element */}
        {words.map((word, i) => (
          <tspan x={0} dy={i === 0 ? 0 : "1.2em"} key={i}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Visits Per Zone</CardTitle>
        <CardDescription>Measure of total visits in each zone area of game map</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            // layout="vertical"
            margin={{
              bottom: 20

            }}
          >
            <XAxis
              dataKey="zone"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-90}       // Rotates the labels to be vertical
              textAnchor="end"  // Aligns the end of the text to the tick
              tick={CustomXAxisTick}
            />
            <YAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
