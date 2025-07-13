import {
  ArrowLeft02Icon,
  ArrowUp01Icon,
  ImageUploadIcon,
  Tick02Icon,
  UnavailableIcon,
} from 'hugeicons-react'
import { useNavigate, useParams } from 'react-router-dom'
import * as Select from '@radix-ui/react-select'
import {
  useChangeProductStatusControllerHandle,
  useEditProductControllerHandle,
  useGetProductControllerHandle,
  useSellProductControllerHandle,
} from '../../../api/products/products'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useListAllCategoriesControllerHandle } from '../../../api/categories/categories'
import { ProductStatus } from './product-status'
import { type ChangeEvent, useEffect, useState } from 'react'
import type {
  ListAllSellerProductsControllerHandleStatus,
  UploadAttachmentsResponse,
} from '../../../api/model'
import { toast } from 'sonner'
import axios, { type AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useUploadAttachmentsControllerHandle } from '../../../api/attachments/attachments'
import { createFileListFromUrl } from '../../../utils/file-utils'

const productSchema = z.object({
  title: z.string(),
  categoryId: z.string().uuid(),
  priceInCents: z.number(),
  description: z.string(),
  file: z.custom<FileList>().refine(files => {
    return Array.from(files ?? []).length !== 0
  }, 'A imagem do produto é obrigatória.'),
})

type ProductSchema = z.infer<typeof productSchema>

export function Product() {
  const navigate = useNavigate()

  const { id } = useParams()

  const queryClient = useQueryClient()

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useListAllCategoriesControllerHandle()

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductControllerHandle(id)

  const { mutateAsync: changeProductStatus } =
    useChangeProductStatusControllerHandle({
      mutation: {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: [`/products/${productData?.product.id}`],
          })
        },
      },
    })

  const { mutateAsync: uploadAttachments } =
    useUploadAttachmentsControllerHandle()

  const { mutateAsync: createProduct } = useSellProductControllerHandle({
    mutation: {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['/products/me'],
        })
      },
    },
  })

  const { mutateAsync: editProduct } = useEditProductControllerHandle()

  const [preview, setPreview] = useState<string | null>(null)

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      priceInCents: 0,
    },
  })

  useEffect(() => {
    async function fillProductDataInForm() {
      if (productData?.product) {
        reset({
          title: productData.product.title,
          description: productData.product.description,
          categoryId: productData.product.category.id,
          priceInCents: productData.product.priceInCents / 100,
          file: await createFileListFromUrl(
            productData.product.attachments[0].url
          ),
        })
        setPreview(productData.product.attachments[0]?.url || null)
      }
    }

    fillProductDataInForm()
  }, [productData, reset])

  function handleNavigateToProducts() {
    navigate('/products')
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    if (file) {
      const fileURL = URL.createObjectURL(file)
      setPreview(fileURL)
    }
  }

  async function handleUpdateProductStatus(
    status: ListAllSellerProductsControllerHandleStatus
  ) {
    try {
      await changeProductStatus({
        id: productData?.product.id,
        status,
      })

      toast.success('Status do produto alterado com sucesso!')
    } catch (err) {
      const errors = err as Error | AxiosError

      if (axios.isAxiosError(errors)) {
        toast.error(errors.response?.data.message)
        return
      }

      throw new Error(errors.message)
    }
  }

  async function handleCreateProduct(data: ProductSchema) {
    const formData = new FormData()

    formData.append('files', data.file[0])

    try {
      const response = await uploadAttachments(formData)

      await createProduct({
        data: {
          title: data.title,
          categoryId: data.categoryId,
          description: data.description,
          priceInCents: data.priceInCents * 100,
          attachmentsIds: [response.attachments[0].id],
        },
      })

      toast.success('Produto criado com sucesso!')
      navigate('/products')
    } catch (err) {
      const errors = err as Error | AxiosError

      if (axios.isAxiosError(errors)) {
        toast.error(errors.response?.data.message)
        return
      }

      throw new Error(errors.message)
    }
  }

  async function handleUpdateProduct(data: ProductSchema) {
    console.log(data)
    const formData = new FormData()

    formData.append('files', data.file[0])

    try {
      const response = await uploadAttachments(formData)

      await editProduct({
        id: productData?.product.id,
        data: {
          title: data.title,
          categoryId: data.categoryId,
          description: data.description,
          priceInCents: data.priceInCents * 100,
          attachmentsIds: [response.attachments[0].id],
        },
      })

      toast.success('Produto editado com sucesso!')
      navigate('/products')
    } catch (err) {
      const errors = err as Error | AxiosError

      if (axios.isAxiosError(errors)) {
        toast.error(errors.response?.data.message)
        return
      }

      throw new Error(errors.message)
    }
  }

  if (isLoadingProduct || isLoadingCategories) {
    return <div>Carregando...</div>
  }

  return (
    <div className="pt-16 px-40 h-full flex gap-10 flex-col">
      <div className="flex items-start justify-between">
        <div>
          {productData?.product && (
            <button
              type="button"
              onClick={handleNavigateToProducts}
              className="flex items-center justify-center gap-2 group"
            >
              <ArrowLeft02Icon className="text-orange-base size-5 group-hover:text-orange-dark" />
              <span className="font-medium text-sm text-orange-base group-hover:text-orange-dark">
                Voltar
              </span>
            </button>
          )}
          <h1 className="font-bold text-3xl text-gray-500 font-dm-sans">
            {productData?.product ? 'Editar produto' : 'Novo produto'}
          </h1>
          <span className="text-gray-300">
            Cadastre um produto para venda no marketplace
          </span>
        </div>
        {productData?.product && (
          <div className="self-end flex items-center justify-center gap-4">
            <button
              type="button"
              className="text-orange-base flex items-center gap-2 font-medium text-sm hover:text-orange-dark"
              onClick={() => handleUpdateProductStatus('sold')}
            >
              <Tick02Icon className="size-5" />
              Marcar como vendido
            </button>
            <button
              type="button"
              className="text-orange-base flex items-center gap-2 font-medium text-sm hover:text-orange-dark"
              onClick={() => handleUpdateProductStatus('cancelled')}
            >
              <UnavailableIcon className="size-5" />
              Desativar anúncio
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Controller
          name="file"
          control={control}
          render={({ field: { onChange } }) => {
            return (
              <div className="flex flex-col">
                <div className="h-96 bg-shape flex items-center justify-center flex-col rounded-3xl gap-4 relative">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept="image/png"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={event => {
                      handleFileChange(event)
                      onChange(event.target.files)
                    }}
                  />
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <ImageUploadIcon className="size-8 text-orange-base" />
                  )}
                </div>
                {errors.file?.message && (
                  <span className="mt-2 block text-red-700">
                    {errors.file.message}
                  </span>
                )}
              </div>
            )
          }}
        />
        <div className="col-span-2 bg-white p-8 rounded-3xl flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="font-dm-sans font-bold text-lg text-gray-300">
              Dados do produto
            </h2>
            {productData?.product && (
              <ProductStatus status={productData?.product.status} />
            )}
          </div>
          <form
            onSubmit={
              !productData
                ? handleSubmit(handleCreateProduct)
                : handleSubmit(handleUpdateProduct)
            }
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <div className="group flex-1">
                  <label
                    className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
                    htmlFor="title"
                  >
                    Título
                  </label>
                  <div className="border-b border-zinc-300 flex items-center">
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        id="title"
                        className="w-full outline-none py-4"
                        placeholder="Nome do produto"
                        {...register('title')}
                      />
                    </div>
                  </div>
                </div>
                <div className="group">
                  <label
                    className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
                    htmlFor="price"
                  >
                    Preço
                  </label>
                  <div className="border-b border-zinc-300 flex items-center">
                    <div className="flex flex-1 items-center gap-2">
                      <span>R$</span>

                      <input
                        type="number"
                        id="price"
                        className="w-full outline-none py-4"
                        placeholder="0,00"
                        min="1"
                        step="any"
                        {...register('priceInCents', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="group">
                  <label
                    className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
                    htmlFor="description"
                  >
                    Descrição
                  </label>
                  <div className="border-b border-zinc-300 flex items-center">
                    <div className="flex flex-1 items-center gap-2">
                      <textarea
                        id="description"
                        className="w-full outline-none py-4"
                        placeholder="Escreva detalhes sobre o produto, tamanho, características"
                        {...register('description')}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="group">
                  <label
                    className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
                    htmlFor="category"
                  >
                    Categoria
                  </label>
                  <div className="border-b border-zinc-300 flex items-center">
                    <div className="flex flex-1 items-center gap-2">
                      <Controller
                        name="categoryId"
                        control={control}
                        render={({ field: { value, name, onChange } }) => {
                          return (
                            <Select.Root
                              name={name}
                              value={value}
                              onValueChange={onChange}
                            >
                              <Select.Trigger className="w-full py-4 outline-none flex items-center justify-between data-[placeholder]:text-gray-200">
                                <Select.Value placeholder="Categoria" />
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
                                  {categoriesData?.categories.map(category => {
                                    return (
                                      <Select.Item
                                        key={category.id}
                                        className="flex items-center justify-between gap-2 px-3 py-2.5 outline-none data-[highlighted]:bg-gray-50"
                                        value={category.id}
                                      >
                                        <Select.ItemText asChild>
                                          <span className="text-gray-400">
                                            {category.title}
                                          </span>
                                        </Select.ItemText>
                                        <Select.ItemIndicator>
                                          <Tick02Icon className="size-6" />
                                        </Select.ItemIndicator>
                                      </Select.Item>
                                    )
                                  })}
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
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-4 h-14  bg-transparent border border-orange-base rounded-lg w-full text-orange-base font-semibold flex justify-center items-center gap-2 hover:border-orange-dark hover:text-orange-dark transition-colors"
                onClick={handleNavigateToProducts}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-4 h-14  bg-orange-base rounded-lg w-full text-white flex justify-center items-center gap-2 font-semibold hover:bg-orange-dark transition-colors"
              >
                {productData?.product ? 'Salvar e editar' : 'Salvar e publicar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
