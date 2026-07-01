import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface PriceChartProps {
  priceHistory: { day: number; price: number }[]
  historicalLow: number
  originalPrice: number
  currentPrice: number
}

const MONTH_TICKS = [15, 45, 75, 105, 135, 165]
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月']

function dayToMonth(day: number): string {
  const idx = Math.min(Math.floor((day - 1) / 30), 5)
  return MONTH_LABELS[idx]
}

export function PriceChart({ priceHistory, historicalLow, originalPrice, currentPrice }: PriceChartProps) {
  return (
    <div className="bg-steam-panel rounded-sm p-4 border border-steam-border">
      <h3 className="text-sm font-bold text-steam-text-dim uppercase tracking-wider mb-3">
        {'📊'} 近期价格走势（2026年1月 – 6月）
      </h3>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceHistory} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a475e" />
            <XAxis
              dataKey="day"
              type="number"
              domain={[1, 180]}
              ticks={MONTH_TICKS}
              tickFormatter={(v: number) => dayToMonth(v)}
              tick={{ fill: '#8f98a0', fontSize: 11 }}
              axisLine={{ stroke: '#2a475e' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8f98a0', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, originalPrice * 1.1]}
              tickFormatter={(v: number) => `¥${v}`}
            />
            <Tooltip
              contentStyle={{
                background: '#1e2d3f',
                border: '1px solid #2a475e',
                borderRadius: '4px',
                color: '#c6d4df',
                fontSize: '12px',
              }}
              labelFormatter={(day: number) => `2026年${dayToMonth(day)}`}
              formatter={(value: number) => [`¥${value}`, '价格']}
            />
            <ReferenceLine
              y={historicalLow}
              stroke="#a4d007"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{
                value: `史低 ¥${historicalLow}`,
                fill: '#a4d007',
                fontSize: 10,
                position: 'right',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#66c0f4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#66c0f4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-2 text-[10px] text-steam-text-dim">
        <span className="w-3 h-[2px] bg-steam-accent inline-block" /> 价格
        <span className="w-3 h-[2px] bg-steam-green inline-block" style={{ borderTop: '1px dashed #a4d007' }} /> 史低线
      </div>
    </div>
  )
}
