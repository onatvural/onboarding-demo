"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  performance: {
    label: "Getiri",
    color: "#60A5FA", // Açık mavi renk
  },
} satisfies ChartConfig

// Mock data generator for fund performance
function generateMockData(seed: number) {
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz"]
  const baseValue = 100 + (seed * 10) % 30

  // Farklı pattern'ler
  const patterns = [
    // Pattern 0: İnişli çıkışlı volatil
    (index: number) => {
      const volatility = 15
      const wave = Math.sin(index * 0.8) * volatility
      return baseValue + wave + (Math.random() - 0.5) * 10
    },
    // Pattern 1: Stabil yavaş artış
    (index: number) => {
      return baseValue + index * 2 + (Math.random() - 0.5) * 3
    },
    // Pattern 2: Dramatik son aylarda artış
    (index: number) => {
      const multiplier = index > 3 ? (index - 3) * 8 : 0
      return baseValue + index * 1 + multiplier + (Math.random() - 0.5) * 4
    },
    // Pattern 3: Yüksek volatilite
    (index: number) => {
      const jump = index % 2 === 0 ? 12 : -8
      return baseValue + index * 2 + jump + (Math.random() - 0.5) * 8
    },
    // Pattern 4: Düşüş sonrası toparlanma
    (index: number) => {
      if (index < 2) return baseValue - index * 8
      return baseValue - 16 + (index - 2) * 10 + (Math.random() - 0.5) * 5
    },
    // Pattern 5: Neredeyse sabit
    (index: number) => {
      return baseValue + (Math.random() - 0.5) * 4
    },
  ]

  const patternIndex = seed % patterns.length
  const pattern = patterns[patternIndex]

  return months.map((month, index) => ({
    month,
    performance: parseFloat(Math.max(pattern(index), baseValue - 20).toFixed(2))
  }))
}

export function FundChart({ fundIndex }: { fundIndex: number }) {
  const chartData = generateMockData(fundIndex)

  return (
    <ChartContainer config={chartConfig} className="h-[120px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
          top: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 10 }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <defs>
          <linearGradient id={`fillPerformance-${fundIndex}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-performance)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-performance)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="performance"
          type="monotone"
          fill={`url(#fillPerformance-${fundIndex})`}
          fillOpacity={0.4}
          stroke="var(--color-performance)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
