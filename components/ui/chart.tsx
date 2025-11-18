import * as React from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { cn } from "../../lib/utils.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card.tsx'

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

type BaseChartProps = {
  title?: string;
  description?: string;
  className?: string;
  height?: number;
}

// Line Chart
type LineChartData = {
  name: string;
  [key: string]: string | number;
};

type LineChartProps = BaseChartProps & {
  data: LineChartData[];
  lines: { dataKey: string; name: string; color?: string }[];
};

export function ChartLine({ title, description, data, lines, className, height = 300 }: LineChartProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
            {lines.map((line, index) => (
              <Line 
                key={line.dataKey} 
                type="monotone" 
                dataKey={line.dataKey} 
                name={line.name}
                stroke={line.color || COLORS[index % COLORS.length]} 
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Bar Chart
type BarChartData = {
  name: string;
  [key: string]: string | number;
};

type BarChartProps = BaseChartProps & {
  data: BarChartData[];
  bars: { dataKey: string; name: string; color?: string }[];
};

export function ChartBar({ title, description, data, bars, className, height = 300 }: BarChartProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
            {bars.map((bar, index) => (
              <Bar 
                key={bar.dataKey} 
                dataKey={bar.dataKey} 
                name={bar.name}
                fill={bar.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Area Chart
type AreaChartData = {
  name: string;
  [key: string]: string | number;
};

type AreaChartProps = BaseChartProps & {
  data: AreaChartData[];
  areas: { dataKey: string; name: string; color?: string }[];
};

export function ChartArea({ title, description, data, areas, className, height = 300 }: AreaChartProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
            <Legend />
            {areas.map((area, index) => (
              <Area 
                key={area.dataKey} 
                type="monotone" 
                dataKey={area.dataKey} 
                name={area.name}
                stroke={area.color || COLORS[index % COLORS.length]} 
                fill={area.color || COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Pie Chart
type PieChartData = {
  name: string;
  value: number;
};

type PieChartProps = BaseChartProps & {
  data: PieChartData[];
};

export function ChartPie({ title, description, data, className, height = 300 }: PieChartProps) {
  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
