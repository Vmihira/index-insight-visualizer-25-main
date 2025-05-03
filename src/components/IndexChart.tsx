
import { useData } from "@/contexts/DataContext";
import { formatValue, isPositiveChange } from "@/utils/csvParser";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowDown, ArrowUp, Calendar, ChartLine } from "lucide-react";

interface ChartDataPoint {
  name: string;
  value: number;
}

const IndexChart = () => {
  const { getSelectedIndexData } = useData();
  const indexData = getSelectedIndexData();

  if (!indexData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500">
        <ChartLine size={64} strokeWidth={1} className="mb-4 text-gray-400" />
        <h2 className="text-xl font-medium mb-2">No Index Selected</h2>
        <p className="text-center max-w-md">
          Select an index from the sidebar to view detailed information and charts.
        </p>
      </div>
    );
  }

  // Create mock chart data since we only have one data point per index
  // In a real application, you'd have historical data
  const chartData: ChartDataPoint[] = [
    { name: "Open", value: parseFloat(indexData.open_index_value) || 0 },
    { name: "Low", value: parseFloat(indexData.low_index_value) || 0 },
    { name: "Close", value: parseFloat(indexData.closing_index_value) || 0 },
    { name: "High", value: parseFloat(indexData.high_index_value) || 0 },
  ];

  // Filter out any NaN values
  const filteredChartData = chartData.filter(
    (point) => !isNaN(point.value) && point.value !== 0
  );

  const pointsChangeValue = parseFloat(indexData.points_change);
  const changePercentValue = parseFloat(indexData.change_percent);
  const isPositive = isPositiveChange(indexData.points_change);

  return (
    <div className="h-full flex flex-col p-4 md:p-6 animate-fade-in">
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {indexData.index_name}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar size={14} className="mr-1" />
                {indexData.index_date}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold">
                {formatValue(indexData.closing_index_value)}
              </div>
              <div className="flex items-center justify-end mt-1">
                {isPositive !== null && (
                  <Badge 
                    className={`mr-2 ${isPositive ? "bg-positive" : "bg-negative"}`}
                  >
                    {isPositive ? (
                      <ArrowUp size={14} className="mr-1" />
                    ) : (
                      <ArrowDown size={14} className="mr-1" />
                    )}
                    {!isNaN(pointsChangeValue) ? formatValue(indexData.points_change) : "N/A"}
                  </Badge>
                )}
                {!isNaN(changePercentValue) && (
                  <span
                    className={`text-sm ${
                      isPositive === null
                        ? "text-gray-500"
                        : isPositive
                        ? "text-positive"
                        : "text-negative"
                    }`}
                  >
                    ({indexData.change_percent}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          <div className="h-64 md:h-80">
            {filteredChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#0066cc"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="#0066cc"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }} 
                  />
                  <YAxis
                    domain={["dataMin - 100", "dataMax + 100"]}
                    tickFormatter={(tick) => tick.toLocaleString()}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: '1px solid #e5e7eb'
                    }}
                    formatter={(value: number) =>
                      value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0066cc"
                    strokeWidth={2}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No chart data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-scale">
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium mb-1">Volume</h3>
            <p className="text-lg font-semibold">{formatValue(indexData.volume)}</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium mb-1">Turnover (₹ Cr)</h3>
            <p className="text-lg font-semibold">{formatValue(indexData.turnover_rs_cr)}</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium mb-1">P/E Ratio</h3>
            <p className="text-lg font-semibold">{formatValue(indexData.pe_ratio)}</p>
          </CardContent>
        </Card>
        <Card className="hover-scale">
          <CardContent className="p-4">
            <h3 className="text-sm text-gray-500 font-medium mb-1">Dividend Yield</h3>
            <p className="text-lg font-semibold">{formatValue(indexData.div_yield)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexChart;
