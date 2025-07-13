import type { ListAllSellerProductsControllerHandleStatus } from '../../../api/model'
import { useSearchParams } from 'react-router-dom'
import { useListAllSellerProductsControllerHandle } from '../../../api/products/products'
import { ProductCard } from './product-card'
import { ProductFilter } from './product-filter'

export function Products() {
  const [searchParams] = useSearchParams()

  const search = searchParams.get('search')
  const status = searchParams.get(
    'status'
  ) as ListAllSellerProductsControllerHandleStatus

  const { data } = useListAllSellerProductsControllerHandle({
    search,
    status,
  })

  return (
    <div className="pt-16 px-40 h-full flex gap-10 flex-col">
      <div>
        <h1 className="font-bold text-3xl text-gray-500 font-dm-sans">
          Seus produtos
        </h1>
        <span className="text-gray-300">
          Acesse gerencie a sua lista de produtos à venda
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <ProductFilter />

        <div className="col-span-2 grid grid-cols-2 gap-4 pb-2 overflow-x-scroll max-h-[675px]">
          {data?.products.map(product => {
            return <ProductCard key={product.id} product={product} />
          })}
        </div>
      </div>
    </div>
  )
}
