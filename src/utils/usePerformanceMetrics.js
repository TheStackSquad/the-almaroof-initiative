"use client";

import { useState, useEffect } from "react";
// Import the singleton instance, do NOT import createClient
import { supabase } from "@/utils/supabase/supaClient";

export const usePerformanceMetrics = () => {
  // State to hold all performance metrics data
  const [performanceMetrics, setPerformanceMetrics] = useState([]);

  // States to hold data for specific metrics for real-time charts
  const [lcpData, setLcpData] = useState([]);
  const [fidData, setFidData] = useState([]);
  const [clsData, setClsData] = useState([]);
  const [inpData, setInpData] = useState([]);
  const [ttfbData, setTtfbData] = useState([]);

  // States for UI feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This async function fetches initial data and sets up the real-time subscription
    const fetchDataAndSubscribe = async () => {
      try {
        // 1. Fetch initial historical data from the 'performance_metrics' table
        
        const twentyFourHoursAgo = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toISOString();
        const { data, error: fetchError } = await supabase
          .from("performance_metrics")
          .select("*")
          .gte("created_at", twentyFourHoursAgo) // ← ONLY THIS LINE ADDED
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching initial data:", fetchError);
          setError(fetchError.message);
          return;
        }

        if (data) {
          setPerformanceMetrics(data);
          // Filter the fetched data into metric-specific arrays
          setLcpData(data.filter((d) => d.metric_name === "LCP"));
          setFidData(data.filter((d) => d.metric_name === "FID"));
          setClsData(data.filter((d) => d.metric_name === "CLS"));
          setInpData(data.filter((d) => d.metric_name === "INP"));
          setTtfbData(data.filter((d) => d.metric_name === "TTFB"));
        }
      } catch (e) {
        console.error(
          "An unexpected error occurred during initial data fetch:",
          e
        );
        setError(e.message);
      } finally {
        setIsLoading(false);
      }

      // 2. Set up a real-time subscription for new data inserts
      const channel = supabase // Use the imported singleton
        .channel("performance_metrics_changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "performance_metrics" },
          (payload) => {
            console.log("Real-time INSERT received:", payload.new);
            const newMetric = payload.new;

            // On a new insert, update the main data array
            setPerformanceMetrics((prevData) => [...prevData, newMetric]);

            // Update the metric-specific data arrays
            switch (newMetric.metric_name) {
              case "LCP":
                setLcpData((prevData) => [...prevData, newMetric]);
                break;
              case "FID":
                setFidData((prevData) => [...prevData, newMetric]);
                break;
              case "CLS":
                setClsData((prevData) => [...prevData, newMetric]);
                break;
              case "INP":
                setInpData((prevData) => [...prevData, newMetric]);
                break;
              case "TTFB":
                setTtfbData((prevData) => [...prevData, newMetric]);
                break;
              default:
                break;
            }
          }
        )
        .subscribe();

      // Clean up the subscription on component unmount
      return () => {
        supabase.removeChannel(channel); // Use the imported singleton
      };
    };

    fetchDataAndSubscribe();
  }, []); // <-- EMPTY dependency array. This effect runs only once on mount.

  // Return all states for the component to use
  return {
    performanceMetrics,
    lcpData,
    fidData,
    clsData,
    inpData,
    ttfbData,
    isLoading,
    error,
  };
};
