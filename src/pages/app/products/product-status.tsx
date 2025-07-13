interface ProdcutStatusProps {
  status: keyof typeof STATUS
}

const STATUS = {
  available: { name: 'Anunciado', color: 'bg-blue-dark' },
  sold: { name: 'Vendido', color: 'bg-success' },
  cancelled: { name: 'Desativado', color: 'bg-gray-400' },
}

export function ProductStatus({ status }: ProdcutStatusProps) {
  return (
    <span
      className={`${STATUS[status].color} uppercase px-2 py-1 text-white text-xs font-medium rounded-full`}
    >
      {STATUS[status].name}
    </span>
  )
}
