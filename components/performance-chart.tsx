"use client"

import { useEffect, useRef } from "react"

export default function PerformanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the chart
    const data = [
      { day: "Mon", turnaround: 28, target: 30 },
      { day: "Tue", turnaround: 25, target: 30 },
      { day: "Wed", turnaround: 22, target: 30 },
      { day: "Thu", turnaround: 26, target: 30 },
      { day: "Fri", turnaround: 24, target: 30 },
      { day: "Sat", turnaround: 20, target: 30 },
      { day: "Sun", turnaround: 18, target: 30 },
    ]

    // Chart dimensions
    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 40
    const barWidth = chartWidth / data.length / 2
    const spacing = barWidth / 2
    const maxValue = 40 // Maximum value for the y-axis

    // Draw the chart
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(30, 10)
    ctx.lineTo(30, chartHeight + 10)
    ctx.lineTo(chartWidth + 30, chartHeight + 10)
    ctx.stroke()

    // Draw horizontal grid lines
    const gridLines = 5
    ctx.textAlign = "right"
    ctx.font = "10px sans-serif"
    ctx.fillStyle = "#64748b"

    for (let i = 0; i <= gridLines; i++) {
      const y = chartHeight - (i * chartHeight) / gridLines + 10
      const value = Math.round((i * maxValue) / gridLines)

      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.moveTo(30, y)
      ctx.lineTo(chartWidth + 30, y)
      ctx.stroke()

      ctx.fillText(value.toString(), 25, y + 3)
    }

    // Draw bars and labels
    data.forEach((item, index) => {
      const x = index * (barWidth * 2 + spacing) + 40
      const turnaroundHeight = (item.turnaround / maxValue) * chartHeight
      const targetHeight = (item.target / maxValue) * chartHeight

      // Draw turnaround time bar
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x, chartHeight - turnaroundHeight + 10, barWidth, turnaroundHeight)

      // Draw target bar
      ctx.fillStyle = "#e2e8f0"
      ctx.fillRect(x + barWidth + spacing / 2, chartHeight - targetHeight + 10, barWidth, targetHeight)

      // Draw day label
      ctx.textAlign = "center"
      ctx.fillStyle = "#64748b"
      ctx.fillText(item.day, x + barWidth / 2, chartHeight + 25)
    })

    // Draw legend
    ctx.textAlign = "left"
    ctx.font = "10px sans-serif"

    // Actual turnaround
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(chartWidth - 100, 15, 10, 10)
    ctx.fillStyle = "#64748b"
    ctx.fillText("Actual", chartWidth - 85, 23)

    // Target
    ctx.fillStyle = "#e2e8f0"
    ctx.fillRect(chartWidth - 50, 15, 10, 10)
    ctx.fillStyle = "#64748b"
    ctx.fillText("Target", chartWidth - 35, 23)
  }, [])

  return (
    <div className="w-full h-[200px]">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  )
}
