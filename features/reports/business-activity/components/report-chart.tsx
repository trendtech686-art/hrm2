/**
 * Report Chart Component
 * 
 * Biểu đồ kết hợp (combo chart) với cột và đường
 * Giống như trong hình: Doanh thu (cột) + Lợi nhuận gộp (đường)
 */

import * as React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  LineChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { ChartType, ChartDataPoint, ComboChartConfig } from '../types.ts';

// Chart colors - using shadcn CSS variables
const CHART_COLORS = {
  primary: 'hsl(var(--chart-1))', // Chart color 1
  secondary: 'hsl(var(--chart-2))', // Chart color 2
  tertiary: 'hsl(var(--chart-3))', // Chart color 3
  quaternary: 'hsl(var(--chart-4))', // Chart color 4
  quinary: 'hsl(var(--chart-5))', // Chart color 5
};

interface ReportChartProps {
  data: ChartDataPoint[];
  config?: ComboChartConfig;
  title?: string;
  chartType?: ChartType;
  onChartTypeChange?: (type: ChartType) => void;
  height?: number;
  showLegend?: boolean;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  
  // Display options
  displayOptions?: {
    key: string;
    label: string;
    color: string;
    type: 'bar' | 'line' | 'area';
  }[];
  selectedOptions?: string[];
  onOptionsChange?: (options: string[]) => void;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toLocaleString('vi-VN');
};

const formatTooltipValue = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Default config: Doanh thu (bar) + Lợi nhuận gộp (line)
const DEFAULT_CONFIG: ComboChartConfig = {
  bars: [
    { dataKey: 'revenue', name: 'Doanh thu', color: CHART_COLORS.primary },
  ],
  lines: [
    { dataKey: 'grossProfit', name: 'Lợi nhuận gộp', color: CHART_COLORS.secondary, strokeWidth: 2 },
  ],
};

const DEFAULT_DISPLAY_OPTIONS = [
  { key: 'revenue', label: 'Doanh thu', color: CHART_COLORS.primary, type: 'bar' as const },
  { key: 'grossProfit', label: 'Lợi nhuận gộp', color: CHART_COLORS.secondary, type: 'line' as const },
];

export function ReportChart({
  data,
  config = DEFAULT_CONFIG,
  title,
  chartType = 'combo',
  onChartTypeChange,
  height = 350,
  showLegend = true,
  isCollapsible = true,
  defaultCollapsed = false,
  displayOptions = DEFAULT_DISPLAY_OPTIONS,
  selectedOptions,
  onOptionsChange,
}: ReportChartProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [localSelectedOptions, setLocalSelectedOptions] = React.useState<string[]>(
    selectedOptions || displayOptions.map(o => o.key)
  );
  
  const activeOptions = selectedOptions || localSelectedOptions;
  
  const handleOptionsChange = (options: string[]) => {
    if (onOptionsChange) {
      onOptionsChange(options);
    } else {
      setLocalSelectedOptions(options);
    }
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border rounded-lg shadow-lg p-3">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{formatTooltipValue(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Filter config based on selected options
  const filteredBars = config.bars.filter(b => activeOptions.includes(b.dataKey));
  const filteredLines = config.lines.filter(l => activeOptions.includes(l.dataKey));
  
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {filteredBars.map(bar => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              radius={[4, 4, 0, 0]}
              stackId={bar.stackId}
            />
          ))}
        </BarChart>
      );
    }
    
    if (chartType === 'line') {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {[...filteredBars, ...filteredLines].map(item => (
            <Line
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.name}
              stroke={item.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      );
    }
    
    if (chartType === 'area') {
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          {[...filteredBars, ...filteredLines].map(item => (
            <Area
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.name}
              stroke={item.color}
              fill={item.color}
              fillOpacity={0.3}
            />
          ))}
        </AreaChart>
      );
    }
    
    // Default: Combo chart
    return (
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="label" 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          yAxisId="left"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        {filteredBars.map(bar => (
          <Bar
            key={bar.dataKey}
            yAxisId="left"
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
            stackId={bar.stackId}
          />
        ))}
        {filteredLines.map(line => (
          <Line
            key={line.dataKey}
            yAxisId="right"
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={line.strokeWidth || 2}
            dot={{ r: 4, fill: line.color }}
            activeDot={{ r: 6 }}
          />
        ))}
      </ComposedChart>
    );
  };
  
  return (
    <Card>
      {(title || isCollapsible || onChartTypeChange || displayOptions.length > 0) && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {title && <CardTitle className="text-base">{title}</CardTitle>}
              {isCollapsible && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Display options selector */}
              {displayOptions.length > 0 && (
                <Select
                  value={activeOptions.length > 0 ? `${activeOptions.length} selected` : 'all'}
                  onValueChange={() => {}}
                >
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Tùy chọn hiển thị">
                      Tùy chọn hiển thị ({activeOptions.length})
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {displayOptions.map(option => (
                      <div 
                        key={option.key}
                        className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent"
                        onClick={() => {
                          const newOptions = activeOptions.includes(option.key)
                            ? activeOptions.filter(o => o !== option.key)
                            : [...activeOptions, option.key];
                          handleOptionsChange(newOptions);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={activeOptions.includes(option.key)}
                          readOnly
                          className="h-4 w-4"
                        />
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: option.color }}
                        />
                        <span className="text-sm">{option.label}</span>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {/* Chart type selector */}
              {onChartTypeChange && (
                <Select value={chartType} onValueChange={(v) => onChartTypeChange(v as ChartType)}>
                  <SelectTrigger className="w-[220px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combo">Biểu đồ kết hợp (đường và cột)</SelectItem>
                    <SelectItem value="bar">Biểu đồ cột</SelectItem>
                    <SelectItem value="line">Biểu đồ đường</SelectItem>
                    <SelectItem value="area">Biểu đồ vùng</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      {!isCollapsed && (
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
          </ResponsiveContainer>
        </CardContent>
      )}
    </Card>
  );
}

export default ReportChart;
