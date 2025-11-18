import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Calendar } from '../../../components/ui/calendar.tsx';
import { ChartBar } from '../../../components/ui/chart.tsx';

export function PreviewDashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-1 sm:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">$15,231.89</p>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Move Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">350</p>
          <p className="text-xs text-muted-foreground">CALORIES/DAY</p>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 sm:col-span-2">
         <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
            <Calendar
                selected={date}
                onSelect={setDate}
                className="p-0"
            />
        </CardContent>
      </Card>

      <Card className="col-span-1 sm:col-span-2">
        <CardHeader>
          <CardTitle>Exercise Minutes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartBar 
            data={[
              { name: 'Mon', value: 45 },
              { name: 'Tue', value: 30 },
              { name: 'Wed', value: 60 },
              { name: 'Thu', value: 20 },
              { name: 'Fri', value: 50 },
              { name: 'Sat', value: 40 },
              { name: 'Sun', value: 35 }
            ]}
            bars={[{ dataKey: 'value', name: 'Minutes' }]}
            height={200}
          />
        </CardContent>
      </Card>

    </div>
  );
}
