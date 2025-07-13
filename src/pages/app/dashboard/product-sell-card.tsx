import { SaleTag01Icon } from 'hugeicons-react'
import { useCountSellerSoldProductsControllerHandle } from '../../../api/metrics/metrics'

export function ProductSellCard() {
  const { data } = useCountSellerSoldProductsControllerHandle()
  return (
    <div className="bg-white py-3 pl-3 pr-7 rounded-3xl flex items-center gap-4">
      <div className="bg-blue-base/40 p-6 rounded-2xl">
        <SaleTag01Icon className="size-10 text-blue-dark" />
      </div>
      <div>
        <h2 className="text-gray-400 font-bold font-dm-sans text-3xl">
          {data?.amount}
        </h2>
        <span className="text-base text-gray-300">Produtos vendidos</span>
      </div>
    </div>
  )
}
