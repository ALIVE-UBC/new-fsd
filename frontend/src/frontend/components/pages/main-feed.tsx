import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";

import ExampleChart from '../../../assets/ex.png';
import HeatMap from '../../../assets/minimap2_font bigger@2x.jpg';
import { FinalHypothesisPiechart } from "./final-hypothesis-piechart";
import { MostCommonlyFoundEvidence } from "./most-popular-evidence-piechart";
import { TotalVisitedZones } from "./total-visited-zones";
import { FirstFinalClaim } from "./first-final-claim";


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
      {/* 
  
*/}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   
        <TotalVisitedZones />
        <MostCommonlyFoundEvidence />
        <FinalHypothesisPiechart />
        <FirstFinalClaim />
</div>
    </main>
  );
}

export const MainFeedPage: React.ReactNode = <MainFeed />;