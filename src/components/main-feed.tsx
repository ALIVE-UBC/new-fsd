import React, { type ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AliveMap from '@/assets/alive-map.png';
import ExampleChart from '@/assets/ex.png';


// Export as a ReactNode so it can be passed directly as a child
export const MainFeed: ReactNode = (
  <main className="flex-1 p-6 space-y-6">
    {/* Stats Row */}
    <div className="flex flex-wrap gap-6">
      {[
        { title: "Most Completion Time", value: "45 mins", change: "+12.5%", description: "Trending up", positive: true },
        { title: "Most Visited Area", value: "Alive Lab", change: "-20%", description: "some description", positive: false },
        { title: "Some Data", value: "1234", change: "+12.5%", description: "Strong user retention", positive: true },
      ].map(({ title, value, change, description, positive }) => (
        <Card key={title} className="flex-1 min-w-[14rem] text-black">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm">{title}</CardTitle>
            <span className={positive ? "text-green-400" : "text-red-400"}>{change}</span>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Charts: first two side by side */}
    <div className="flex flex-col md:flex-row gap-6">
      {[1, 2].map((idx) => (
        <Card key={idx} className="flex-1 text-black">
          <CardHeader className="flex items-center justify-between mb-4">
            <CardTitle>Total Visitors</CardTitle>
            <div className="space-x-2">
              {['Last 3 months', 'Last 30 days', 'Last 7 days'].map((label) => (
                <Button key={label} variant="ghost" size="sm">
                  {label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <img
              src={AliveMap}
              alt="Data visualization placeholder"
              className="h-full w-full object-contain"
            />
          </CardContent>
          <CardFooter />
        </Card>
      ))}
    </div>

    {/* Third chart full width below */}
    <Card className="text-black">
      <CardHeader className="flex items-center justify-between mb-4">
        <CardTitle>Overall Trends</CardTitle>
        <div className="space-x-2">
          {['Last Year', 'Last 6 months', 'Last Month'].map((label) => (
            <Button key={label} variant="ghost" size="sm">
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center text-gray-500">
       <img
              src={ExampleChart}
              alt="Data visualization placeholder"
              className="h-full w-full object-contain"
            />
      </CardContent>
      <CardFooter />
    </Card>
  </main>
);
