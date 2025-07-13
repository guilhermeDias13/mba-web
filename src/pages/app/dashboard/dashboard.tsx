import { useCountSellerViewsPerDayControllerHandle } from '../../../api/metrics/metrics'
import { Chart } from './chart'
import { PeopleVisitorsCard } from './people-visitors-card'
import { ProductAnnouncementCard } from './product-announcement-card'
import { ProductSellCard } from './product-sell-card'

export function Dashboard() {
  const { data } = useCountSellerViewsPerDayControllerHandle()

  return (
    <div className="pt-16 px-40 h-full flex gap-10 flex-col">
      <div>
        <h1 className="font-bold text-3xl text-gray-500 font-dm-sans">
          Últimos 30 dias
        </h1>
        <span className="text-gray-300">
          Confira as estatísticas da sua loja no último mês
        </span>
      </div>
      <div className="grid grid-cols-5 gap-6 min-h-96">
        <div className="grid grid-rows-3 col-span-1 gap-4">
          <ProductSellCard />
          <ProductAnnouncementCard />
          <PeopleVisitorsCard />
        </div>
        <Chart />
      </div>
    </div>
  )
}
