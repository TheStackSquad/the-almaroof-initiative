// src/components/common/paymentStatus.js
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export const PaymentStatus = ({
  status,
  reference,
  lastUpdated,
  onRefresh,
  showRefreshButton = false,
  className = "",
  size = "default",
}) => {
  // State hooks should be declared at the top of the component
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);

  // Update local status when prop changes
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  // Status configuration with enhanced UI
  const statusConfig = useMemo(
    () => ({
      pending: {
        color:
          "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800",
        label: "Pending Payment",
        icon: Clock,
        description: "Payment is being processed",
        actionable: true,
      },
      processing: {
        color:
          "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800",
        label: "Processing",
        icon: RefreshCw,
        description: "Payment is being verified",
        actionable: true,
      },
      paid: {
        color:
          "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800",
        label: "Payment Successful",
        icon: CheckCircle,
        description: "Payment completed successfully",
        actionable: false,
      },
      failed: {
        color:
          "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800",
        label: "Payment Failed",
        icon: XCircle,
        description: "Payment could not be processed",
        actionable: true,
      },
      expired: {
        color:
          "text-gray-700 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-900/20 dark:border-gray-800",
        label: "Payment Expired",
        icon: AlertTriangle,
        description: "Payment session has expired",
        actionable: true,
      },
    }),
    []
  );

  const config = statusConfig[localStatus] || statusConfig.pending;
  const Icon = config.icon;

  // Size variants
  const sizeConfig = {
    small: {
      container: "px-2 py-1 text-xs",
      icon: "h-3 w-3",
      text: "text-xs",
    },
    default: {
      container: "px-3 py-1.5 text-sm",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    large: {
      container: "px-4 py-2 text-base",
      icon: "h-5 w-5",
      text: "text-base",
    },
  };

  const sizeClasses = sizeConfig[size] || sizeConfig.default;

  // Use useCallback to memoize the handleRefresh function
  const handleRefresh = useCallback(async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      const result = await onRefresh(reference);
      if (result?.status) {
        setLocalStatus(result.status);
      }
    } catch (error) {
      console.error("Failed to refresh payment status:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing, reference]); // These are the dependencies for handleRefresh

  // Auto-refresh for actionable statuses
  // Now includes handleRefresh in its dependency array
  useEffect(() => {
    if (!config.actionable || !onRefresh) return;

    const interval = setInterval(() => {
      if (!isRefreshing) {
        handleRefresh();
      }
    }, 30000); // Refresh every 30 seconds for pending/processing

    return () => clearInterval(interval);
  }, [config.actionable, onRefresh, isRefreshing, handleRefresh]); // Corrected dependency array

  // Time since last update
  const timeAgo = useMemo(() => {
    if (!lastUpdated) return null;

    const diff = Date.now() - new Date(lastUpdated).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  }, [lastUpdated]);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`
          inline-flex items-center gap-2 rounded-full border font-medium transition-all duration-200
          ${config.color} ${sizeClasses.container}
        `}
      >
        <Icon
          className={`${sizeClasses.icon} ${
            localStatus === "processing" || isRefreshing ? "animate-spin" : ""
          }`}
        />
        <span className={sizeClasses.text}>{config.label}</span>
      </div>

      {/* Refresh button for actionable statuses */}
      {showRefreshButton && config.actionable && onRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Refresh payment status"
          aria-label="Refresh payment status"
        >
          <RefreshCw
            className={`h-4 w-4 text-gray-500 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      )}

      {/* Time indicator */}
      {timeAgo && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {timeAgo}
        </span>
      )}
    </div>
  );
};

export const usePaymentStatus = (initialReference) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshStatus = useCallback(
    async (reference = initialReference) => {
      if (!reference) return null;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/payment/status/${reference}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        setStatus(data.status);
        setLastUpdated(new Date().toISOString());

        return { status: data.status, ...data };
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [initialReference]
  );

  useEffect(() => {
    if (initialReference) {
      refreshStatus(initialReference);
    }
  }, [initialReference, refreshStatus]);

  return {
    status,
    loading,
    error,
    lastUpdated,
    refreshStatus,
  };
};
