// src/utils/usePerformanceMetrics.js
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/**
 * A custom hook to fetch and manage real-time web performance metrics from Supabase.
 * It fetches historical data on mount and subscribes to new data inserts.
 *
 * @returns {object} An object containing all performance data and loading state.
 */
export const usePerformanceMetrics = () => {
  // Supabase client initialization. Using NEXT_PUBLIC env variables for client-side code.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        const { data, error } = await supabase
          .from("performance_metrics")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching initial data:", error);
          setError(error.message);
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
      const channel = supabase
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
        supabase.removeChannel(channel);
      };
    };

    fetchDataAndSubscribe();
  }, []); // Empty dependency array to run only once on mount

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
