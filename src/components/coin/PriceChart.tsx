import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimeRange } from '../../types';
import { getCoinChartData } from '../../services/coins';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ChartSkeleton } from '../common/LoadingSkeleton';
import { BarChart2, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChartProps {
  coinId: string;
  coinName: string;
  isPositive?: boolean;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  coinId,
  coinName,
  isPositive = true,
}) => {
  const [range, setRange] = useState<TimeRange>('7D');
  const [chartData, setChartData] = useState<{ timestamp: number; price: number; volume: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ranges: TimeRange[] = ['24H', '7D', '30D', '90D', '1Y', 'Max'];

  const loadChart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCoinChartData(coinId, range);
      if (res?.data?.prices && res.data.prices.length > 0) {
        const formatted = res.data.prices.map((p, idx) => ({
          timestamp: p[0],
          price: p[1],
          volume: res.data.total_volumes?.[idx]?.[1] || 0,
        }));
        setChartData(formatted);
      } else {
        throw new Error('Chart data unavailable');
      }
    } catch (err: any) {
      console.error('Failed to load chart data:', err);
      setError('Unable to load chart data from CoinGecko. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChart();
  }, [coinId, range]);

  const prices = chartData.map((d) => d.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // Calculate start to end price percentage change for selected time range
  const startPrice = prices.length ? prices[0] : 0;
  const endPrice = prices.length ? prices[prices.length - 1] : 0;
  const rangeChangePct = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
  const isRangePositive = rangeChangePct >= 0;

  const chartColor = isRangePositive ? '#10b981' : '#f43f5e';

  return (
    <section aria-labelledby="interactive-chart-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="interactive-chart-heading" className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
              <BarChart2 size={18} className="text-blue-500" /> {coinName} Interactive Price Chart
            </h2>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
              isRangePositive
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}>
              {isRangePositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {rangeChangePct >= 0 ? '+' : ''}{rangeChangePct.toFixed(2)}% ({range})
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Period High: <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(maxPrice)}</span> {' | '} Period Low:{' '}
            <span className="font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(minPrice)}</span>
          </p>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto overflow-x-auto scrollbar-none">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-label={`Show ${r} chart data`}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                range === r
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      {loading ? (
        <ChartSkeleton />
      ) : error ? (
        <div className="h-80 w-full flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-6 text-center bg-slate-50 dark:bg-slate-900/20">
          <AlertTriangle size={36} className="text-amber-500 mb-2" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{error}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">CoinGecko market chart service might be undergoing temporary rate limits.</p>
          <button
            onClick={loadChart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} /> Retry Loading Chart
          </button>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} opacity={0.5} />

              <XAxis
                dataKey="timestamp"
                tickFormatter={(ts) => {
                  const d = new Date(ts);
                  if (range === '24H' || range === '1D') {
                    return `${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`;
                  }
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val < 1 ? val.toFixed(4) : val.toFixed(2)}`}
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white border border-slate-700 p-3 rounded-xl shadow-2xl font-mono text-xs">
                        <div className="text-slate-400 mb-1">{formatDate(data.timestamp)}</div>
                        <div className="text-white font-bold text-sm">
                          Price: {formatCurrency(data.price)}
                        </div>
                        {data.volume > 0 && (
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            Volume: {formatCurrency(data.volume, 0, true)}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartGradient)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};
