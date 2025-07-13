import {
  ArrowUp01Icon,
  SaleTag02Icon,
  Search01Icon,
  Tick02Icon,
} from 'hugeicons-react'
import * as Select from '@radix-ui/react-select'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'

const productFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
})

type ProductFiltersSchema = z.infer<typeof productFiltersSchema>

export function ProductFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search')
  const status = searchParams.get('status')

  const { handleSubmit, register, control, reset } =
    useForm<ProductFiltersSchema>({
      resolver: zodResolver(productFiltersSchema),
      defaultValues: {
        search: search ?? '',
        status: status ?? '',
      },
    })

  function handleFilter({ status, search }: ProductFiltersSchema) {
    setSearchParams(state => {
      if (search) {
        state.set('search', search)
      } else {
        state.delete('search')
      }

      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams(state => {
      state.delete('search')
      state.delete('status')

      return state
    })

    reset({
      search: '',
      status: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="bg-white p-6 rounded-3xl space-y-10 h-80"
    >
      <div className="space-y-6">
        <h2 className="font-bold font-dm-sans text-lg text-gray-300">
          Filtrar
        </h2>
        <div className="space-y-5">
          <div className="group border-b border-zinc-300 flex items-center">
            <div className="flex flex-1 items-center gap-2">
              <Search01Icon className="text-gray-200 group-focus-within:text-orange-dark" />
              <input
                type="search"
                id="search"
                className="w-full outline-none py-4"
                placeholder="Pesquisar"
                {...register('search')}
              />
            </div>
          </div>
          <div className="group border-b border-zinc-300 flex items-center">
            <div className="flex flex-1 items-center gap-2">
              <SaleTag02Icon className="text-gray-200 group-focus-within:text-orange-dark" />
              <Controller
                name="status"
                control={control}
                render={({ field: { name, onChange, value } }) => {
                  return (
                    <Select.Root
                      value={value}
                      onValueChange={value =>
                        onChange(value === 'none' ? '' : value)
                      }
                      name={name}
                    >
                      <Select.Trigger className="w-full py-4 outline-none flex items-center justify-between data-[placeholder]:text-gray-200">
                        <Select.Value placeholder="Status" />
                        <Select.Icon>
                          <ArrowUp01Icon />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          side="bottom"
                          sideOffset={8}
                          position="popper"
                          className="z-10 w-[--radix-select-trigger-width] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                        >
                          <Select.Item
                            className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-gray-50"
                            value="none"
                          >
                            <Select.ItemText asChild>
                              <span className="text-gray-400">Nenhum</span>
                            </Select.ItemText>
                          </Select.Item>
                          <Select.Item
                            className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-gray-50"
                            value="available"
                          >
                            <Select.ItemText asChild>
                              <span className="text-gray-400">Disponível</span>
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <Tick02Icon className="size-6" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-gray-50"
                            value="sold"
                          >
                            <Select.ItemText asChild>
                              <span className="text-gray-400">Vendido</span>
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <Tick02Icon className="size-6" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-gray-50"
                            value="cancelled"
                          >
                            <Select.ItemText asChild>
                              <span className="text-gray-400">Cancelado</span>
                            </Select.ItemText>
                            <Select.ItemIndicator>
                              <Tick02Icon className="size-6" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="px-5 py-4 bg-orange-base w-full rounded-lg text-white flex items-center justify-center hover:bg-orange-dark transition-colors"
        >
          Aplicar filtro
        </button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="px-5 py-4 border border-orange-base w-full rounded-lg text-orange-base flex items-center justify-center hover:border-orange-dark transition-colors"
        >
          Limpar filtros
        </button>
      </div>
    </form>
  )
}
