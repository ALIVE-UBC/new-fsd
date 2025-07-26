import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";

import ExampleChart from '@/assets/ex.png';
import HeatMap from '@/assets/minimap2_font bigger@2x.jpg';
import { FinalHypothesisPiechart } from "./final-hypothesis-piechart";
import { MostCommonlyFoundEvidence } from "./most-popular-evidence-piechart";


export function MainFeed() {
  const [avgCompletionTime, setAvgCompletionTime] = useState<string | null>(null);
  const [mostVisitedArea, setMostVisitedArea] = useState<string | null>(null);
  const [mostPopularFinalClaim, setMostPopularFinalClaim] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvgCompletionTime = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://alive.educ.ubc.ca/fsd2/api/avgCompletionTime');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvgCompletionTime(data.avg_completion_time || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch average completion time');
      setAvgCompletionTime(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMostVisitedArea = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('https://alive.educ.ubc.ca/fsd2/api/mostVisitedArea');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setMostVisitedArea(data.zone_name);
    console.log('Most Visited Area:', data.zone_name);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch most visited area');
    console.error('Error fetching most visited area:', err);
  } finally {
    setLoading(false);
  }
};

const fetchMostPopularFinalClaim = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('https://alive.educ.ubc.ca/fsd2/api/mostPopularFinalClaim');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setMostPopularFinalClaim(
  data.final_claim
    ? data.final_claim.charAt(0).toUpperCase() + data.final_claim.slice(1).toLowerCase()
    : null
  );
    console.log('Most Popular Final Claim:', data.final_claim);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch most popular final claim');
    console.error('Error fetching most popular final claim:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAvgCompletionTime();
    fetchMostVisitedArea();
    fetchMostPopularFinalClaim();
  }, []);

  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Stats Row */}
      <div className="flex flex-wrap gap-6">
        {[
          {
            title: "Average Completion Time",
            value: loading
              ? "Loading..."
              : error
              ? "Error"
              : `${avgCompletionTime} seconds`
              ? `${avgCompletionTime} seconds`
              : "N/A",
          },
          { title: "Most Visited Area",  value: loading
              ? "Loading..."
              : error
              ? "Error"
              : `${mostVisitedArea}`
              ? `${mostVisitedArea}`
              : "N/A",},
          { title: "Most Common Final Claim", value: loading
              ? "Loading..."
              : error
              ? "Error"
              : `${mostPopularFinalClaim}`
              ? `${mostPopularFinalClaim}`
              : "N/A", },
        ].map(({ title, value }) => (
          <Card key={title} className="flex-1 min-w-[14rem] text-black">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
         <FinalHypothesisPiechart />
      </div>
      <div>
        <MostCommonlyFoundEvidence />
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
        {idx === 1 ? (
          <img
            src={HeatMap}
            alt="Data visualization placeholder"
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            src={HeatMap}
            alt="Data visualization placeholder"
            className="h-full w-full object-contain"
          />
        )}
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
}

export const MainFeedPage: React.ReactNode = <MainFeed />;