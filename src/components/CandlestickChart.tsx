// components/CandlestickChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as LightweightCharts from 'lightweight-charts';
import type { OHLCV, Pattern } from '@/app/types/types';

interface Props {
    data: OHLCV[];
    patterns: Pattern[];
    theme: 'light' | 'dark';
  }
  
  interface ChartData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }
  
  interface ChartColors {
    background: string;
    text: string;
    grid: string;
    upColor: string;
    downColor: string;
    markerStartColor: string;
    markerEndColor: string;
  }
  
  const themes: Record<'light' | 'dark', ChartColors> = {
    light: {
      background: '#ffffff',
      text: 'rgba(33, 56, 77, 1)',
      grid: 'rgba(197, 203, 206, 0.5)',
      upColor: '#26a69a',
      downColor: '#ef5350',
      markerStartColor: '#4CAF50',
      markerEndColor: '#F44336',
    },
    dark: {
      background: '#131722',
      text: 'rgba(255, 255, 255, 0.9)',
      grid: 'rgba(197, 203, 206, 0.1)',
      upColor: '#26a69a',
      downColor: '#ef5350',
      markerStartColor: '#4CAF50',
      markerEndColor: '#F44336',
    },
  };
  
  export const CandlestickChart: React.FC<Props> = ({ data, patterns, theme }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<LightweightCharts.IChartApi | null>(null);
  
    useEffect(() => {
      if (chartContainerRef.current) {
        const colors = themes[theme];
  
        // if (chartRef.current) {
        //   chartRef.current.remove();
        // }
  
        chartRef.current = LightweightCharts.createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { type: 'solid', color: colors.background },
            textColor: colors.text,
          },
          grid: {
            vertLines: { color: colors.grid },
            horzLines: { color: colors.grid },
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
        });
  
        const candlestickSeries = chartRef.current.addCandlestickSeries({
          upColor: colors.upColor,
          downColor: colors.downColor,
          borderVisible: false,
          wickUpColor: colors.upColor,
          wickDownColor: colors.downColor,
        });
  
        const chartData: ChartData[] = data.map(candle => ({
          time: candle[0] / 1000,
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
        }));
  
        candlestickSeries.setData(chartData);
  
        const timeToIndexMap = new Map(chartData.map((d, index) => [d.time, index]));
  
        const markers = patterns
          .flatMap(p => {
            const startIndex = timeToIndexMap.get(data[p.startIndex][0] / 1000);
            const endIndex = timeToIndexMap.get(data[p.endIndex][0] / 1000);
            if (startIndex !== undefined && endIndex !== undefined) {
              return [
                {
                  time: chartData[startIndex].time,
                  position: 'aboveBar' as LightweightCharts.PriceAxisPosition,
                  color: colors.markerStartColor,
                  shape: 'arrowDown',
                  text: 'S',
                },
                {
                  time: chartData[endIndex].time,
                  position: 'aboveBar' as LightweightCharts.PriceAxisPosition,
                  color: colors.markerEndColor,
                  shape: 'arrowUp',
                  text: 'E',
                },
              ];
            }
            return [];
          })
          .sort((a, b) => a.time - b.time);
  
        candlestickSeries.setMarkers(markers);
  
        const handleResize = () => {
          chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };
  
        window.addEventListener('resize', handleResize);
  
        return () => {
          window.removeEventListener('resize', handleResize);
          if (chartRef.current) {
            chartRef.current.remove();
          }
        };
      }
    }, [data, patterns, theme]);
  
    return <div ref={chartContainerRef} style={{ width: '100%', height: '400px' }} />;
  };