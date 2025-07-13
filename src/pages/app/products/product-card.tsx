import { Link } from 'react-router-dom'
import type { ListAllSellerProductsResponseProductsItem } from '../../../api/model'
import { ProductStatus } from './product-status'

interface ProductCardProps {
  product: ListAllSellerProductsResponseProductsItem
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-3xl p-1 space-y-1 border border-transparent hover:border hover:border-blue-dark"
    >
      <div className="rounded-3xl overflow-hidden relative">
        <img
          src={product.attachments[0].url}
          alt=""
          className="object-cover h-48 w-full"
        />
        <div className="flex items-center justify-center gap-1 absolute top-2 right-2">
          <ProductStatus status={product.status} />
          <span className="bg-gray-400 uppercase px-2 py-1 text-white text-xs font-medium rounded-full">
            {product.category.slug}
          </span>
        </div>
      </div>
      <div className="pt-3 px-3 pb-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-400">{product.title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-medium">R$</span>
            <span className="font-dm-sans font-bold text-lg">
              {(product.priceInCents / 100).toLocaleString('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        <p className="line-clamp-3 text-gray-300 text-sm">
          {product.description}
        </p>
      </div>
    </Link>
  )
}
