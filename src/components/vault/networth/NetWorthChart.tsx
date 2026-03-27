import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Currency } from '../../../types/vault.ts'
import { formatCurrency } from '../../../utils/currency.ts'

interface ChartDataPoint {
  date: string
  assets: number
  liabilities: number
  netWorth: number
}

interface NetWorthChartProps {
  data: ChartDataPoint[]
  displayCurrency: Currency
}

export function NetWorthChart({ data, displayCurrency }: NetWorthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#44403c" />
        <XAxis dataKey="date" stroke="#a8a29e" fontSize={12} />
        <YAxis stroke="#a8a29e" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: '#292524', border: '1px solid #44403c', borderRadius: '8px' }}
          labelStyle={{ color: '#f5f5f4' }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((value: any, name: any) => [
            formatCurrency(Number(value), displayCurrency),
            name === 'assets' ? 'Assets' : name === 'liabilities' ? 'Liabilities' : 'Net Worth',
          ]) as any}
        />
        <Area type="monotone" dataKey="assets" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
        <Area type="monotone" dataKey="liabilities" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
        <Area type="monotone" dataKey="netWorth" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
