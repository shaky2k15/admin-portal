'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { BarDataPoint, MetricCard as MetricCardType } from '@/features/analytics/hooks/useAnalytics';

/* ─────────────────────────── Bar Chart ─────────────────────────── */

interface BarChartProps {
  data: BarDataPoint[];
}

export function BarChart({ data }: BarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxValue = Math.max(...data.map((d) => d.maxValue));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-1">Monthly Traffic</h3>
      <p className="text-sm text-muted-foreground mb-6">Page views over the past 6 months</p>

      <div className="space-y-4">
        {data.map((item, index) => {
          const widthPercent = (item.value / maxValue) * 100;

          return (
            <div key={item.label} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground tabular-nums">{item.value.toLocaleString()}</span>
              </div>
              <div className="h-8 w-full rounded-lg bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out group-hover:from-blue-400 group-hover:to-purple-400"
                  style={{
                    width: mounted ? `${widthPercent}%` : '0%',
                    transitionDelay: `${index * 150}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── Donut Chart ─────────────────────────── */

interface DonutChartProps {
  percentage: number;
  label?: string;
}

export function DonutChart({ percentage, label = 'Completion Rate' }: DonutChartProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percentage), 200);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="glass rounded-xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-base font-semibold text-foreground mb-1 self-start">{label}</h3>
      <p className="text-sm text-muted-foreground mb-8 self-start">Project milestone progress</p>

      {/* Ring chart */}
      <div className="relative h-48 w-48 mb-6">
        <div
          className="h-full w-full rounded-full transition-all duration-1500 ease-out"
          style={{
            background: `conic-gradient(
              hsl(217 91% 60%) 0deg,
              hsl(280 80% 65%) ${animatedPercent * 3.6}deg,
              hsl(var(--muted) / 0.3) ${animatedPercent * 3.6}deg,
              hsl(var(--muted) / 0.3) 360deg
            )`,
          }}
        >
          {/* Inner circle */}
          <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center flex-col">
            <span className="text-4xl font-bold gradient-text tabular-nums">{animatedPercent}%</span>
            <span className="text-xs text-muted-foreground mt-1">Complete</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted/50" />
          <span className="text-muted-foreground">Remaining</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Metric Cards ─────────────────────────── */

interface MetricCardsProps {
  metrics: MetricCardType[];
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {metrics.map((metric, index) => {
        const isPositive = metric.change >= 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        // Build a simple SVG sparkline from the data
        const sparklinePoints = metric.sparkline;
        const min = Math.min(...sparklinePoints);
        const max = Math.max(...sparklinePoints);
        const range = max - min || 1;
        const svgWidth = 80;
        const svgHeight = 32;
        const pathData = sparklinePoints
          .map((val, i) => {
            const x = (i / (sparklinePoints.length - 1)) * svgWidth;
            const y = svgHeight - ((val - min) / range) * (svgHeight - 4) - 2;
            return `${i === 0 ? 'M' : 'L'}${x},${y}`;
          })
          .join(' ');

        return (
          <div
            key={metric.id}
            className="glass rounded-xl p-5 animate-fade-in transition-smooth hover:-translate-y-0.5 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                <TrendIcon className="h-3 w-3" />
                <span>{isPositive ? '+' : ''}{metric.change}%</span>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <svg
                width={svgWidth}
                height={svgHeight}
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="flex-shrink-0"
              >
                <defs>
                  <linearGradient id={`sparkline-${metric.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={isPositive ? '#3b82f6' : '#ef4444'} />
                    <stop offset="100%" stopColor={isPositive ? '#8b5cf6' : '#f97316'} />
                  </linearGradient>
                </defs>
                <path
                  d={pathData}
                  fill="none"
                  stroke={`url(#sparkline-${metric.id})`}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
