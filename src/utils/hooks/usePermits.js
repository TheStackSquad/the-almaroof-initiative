// src/hooks/usePermits.js
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/supaClient";

export const usePermits = (userId) => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermits = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("permits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPermits(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchPermits();
  }, [userId, fetchPermits]);

  return { permits, loading, error, refetch: fetchPermits };
};
