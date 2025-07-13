import { Calendar01Icon } from 'hugeicons-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useCountSellerViewsPerDayControllerHandle } from '../../../api/metrics/metrics'
import 'dayjs/locale/pt-BR'
import dayjs from 'dayjs'

dayjs.locale('pt-BR')

export function Chart() {
  const { data } = useCountSellerViewsPerDayControllerHandle()

  const formattedData = data?.viewsPerDay.map(value => {
    return {
      ...value,
      date: dayjs(value.date).format('DD/MM'),
    }
  })

  const firstDate = dayjs(data?.viewsPerDay[0].date).format('DD [de] MMMM')
  const lastDate = dayjs(
    data?.viewsPerDay[data?.viewsPerDay.length - 1].date
  ).format('DD [de] MMMM')

  return (
    <div className="bg-white rounded-2xl col-span-4 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold font-dm-sans text-lg">Visitantes</h1>
        <div className="flex items-center justify-center gap-2">
          <Calendar01Icon className="size-4 text-blue-dark" />
          <p className="uppercase text-xs leading-tight">
            {firstDate} - {lastDate}
          </p>
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={300}
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="Visitantes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
