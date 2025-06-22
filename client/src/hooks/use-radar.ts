import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface RadarData {
  resultCode: string;
  resultMsg: string;
  numOfRows: number;
  pageNo: number;
  totalCount: number;
  dataType: string;
  dateTime: string;
  gridKm: number;
  xdim: number;
  ydim: number;
  x0: number;
  y0: number;
  unit: string;
  value: string;
}

export function useRadarData(dateTime?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['radar', dateTime],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateTime) {
        params.append('dateTime', dateTime);
      }
      
      const response = await fetch(`/api/weather/radar?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch radar data');
      }
      
      return response.json() as Promise<RadarData>;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 3
  });

  return {
    radarData: data,
    isLoading,
    error
  };
}

export function useRadarTimeline() {
  const [selectedTime, setSelectedTime] = useState<string>();
  const [timeRange, setTimeRange] = useState<string[]>([]);

  useEffect(() => {
    // Generate time range for the last 6 hours in 30-minute intervals
    const times: string[] = [];
    const now = new Date();
    
    for (let i = 12; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 30 * 60 * 1000));
      const timeString = time.toISOString().replace(/[-:T]/g, '').slice(0, 12);
      times.push(timeString);
    }
    
    setTimeRange(times);
    setSelectedTime(times[times.length - 1]); // Latest time
  }, []);

  return {
    selectedTime,
    setSelectedTime,
    timeRange
  };
}