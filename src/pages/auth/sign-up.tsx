import { type ChangeEvent, useState } from 'react'
import {
  AccessIcon,
  ArrowRight02Icon,
  ImageUploadIcon,
  Mail02Icon,
  SmartPhone01Icon,
  UserIcon,
  ViewIcon,
} from 'hugeicons-react'
import { useForm, Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { useUploadAttachmentsControllerHandle } from '../../api/attachments/attachments'
import { useRegisterSellerControllerHandle } from '../../api/sellers/sellers'
import { toast } from 'sonner'
import axios, { type AxiosError } from 'axios'
import { handleSeePassword } from '../../utils/input-utils'

const signUpFormSchema = z
  .object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email('O valor não é um input do tipo e-mail'),
    password: z.string().min(6, 'Deve conter pelo menos 6 caracteres'),
    passwordConfirmation: z
      .string()
      .min(6, 'Deve conter pelo menos 6 caracteres'),
    file: z.custom<FileList>().refine(files => {
      return Array.from(files ?? []).length !== 0
    }, 'A imagem do perfil é obrigatória.'),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'As senhas não batem, por favor, verifique!',
    path: ['passwordConfirmation'],
  })

type SignUpForm = z.infer<typeof signUpFormSchema>

export function SignUp() {
  const navigate = useNavigate()

  const { mutateAsync: uploadAttachments } =
    useUploadAttachmentsControllerHandle()

  const { mutateAsync: registerSeller } = useRegisterSellerControllerHandle()

  const [preview, setPreview] = useState<string | null>(null)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpFormSchema),
  })

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    if (file) {
      const fileURL = URL.createObjectURL(file)
      setPreview(fileURL)
    }
  }

  async function handleCreateSeller(data: SignUpForm) {
    const formData = new FormData()

    formData.append('files', data.file[0])

    try {
      const response = await uploadAttachments(formData)

      await registerSeller({
        data: {
          avatarId: response.attachments[0].id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
      })

      toast.success('Vendedor cadastrado com sucesso!')
      navigate(`/sign-in?email=${data.email}`)
    } catch (err) {
      const errors = err as Error | AxiosError

      if (axios.isAxiosError(errors)) {
        toast.error(errors.response?.data.message)
        return
      }

      throw new Error(errors.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateSeller)}
      className="bg-white px-20 py-12 m-6 rounded-[32px] flex flex-col justify-between"
    >
      <div className="space-y-12">
        <div>
          <h1 className="text-gray-500 font-dm-sans font-bold text-2xl">
            Crie sua conta
          </h1>
          <p className="text-gray-300 text-sm">
            Informe os seus dados pessoais e de acesso
          </p>
        </div>

        <div className="space-y-5">
          <h1 className="font-bold text-lg">Perfil</h1>

          <Controller
            name="file"
            control={control}
            render={({ field: { onChange } }) => (
              <>
                <div className="h-32 w-32 bg-orange-base/20 flex flex-col items-center justify-center rounded-xl relative cursor-pointer hover:opacity-60 transition-opacity">
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
              </>
            )}
          />
          <div className="group">
            <label
              className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
              htmlFor="name"
            >
              Nome
            </label>
            <div className="border-b border-zinc-300 flex items-center">
              <div className="flex flex-1 items-center gap-2">
                <UserIcon className="text-gray-200 group-focus-within:text-orange-dark" />
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="w-full outline-none py-4"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>
          </div>
          <div className="group">
            <label
              className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
              htmlFor="phone"
            >
              Telefone
            </label>
            <div className="border-b border-zinc-300 flex items-center">
              <div className="flex flex-1 items-center gap-2">
                <SmartPhone01Icon className="text-gray-200 group-focus-within:text-orange-dark" />
                <input
                  type="tel"
                  id="phone"
                  {...register('phone')}
                  className="w-full outline-none py-4"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h1 className="font-bold text-lg">Acesso</h1>

          <div className="group">
            <label
              className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
              htmlFor="email"
            >
              e-mail
            </label>
            <div className="border-b border-zinc-300 flex items-center">
              <div className="flex flex-1 items-center gap-2">
                <Mail02Icon className="text-gray-200 group-focus-within:text-orange-dark" />
                <input
                  type="text"
                  id="email"
                  {...register('email')}
                  className="w-full outline-none py-4"
                  placeholder="Seu e-mail de acesso"
                />
              </div>
            </div>
            {errors.email?.message && (
              <span className="mt-2 block text-red-700">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="group">
            <label
              className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="border-b border-zinc-300 flex items-center">
              <div className="flex flex-1 items-center gap-2">
                <AccessIcon className="text-gray-200 group-focus-within:text-orange-dark" />
                <input
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register('password')}
                  className="w-full outline-none py-4"
                  placeholder="Senha de acesso"
                />
                <ViewIcon
                  className="ml-auto text-gray-200 cursor-pointer"
                  onClick={() => handleSeePassword('password')}
                />
              </div>
            </div>
            {errors.password?.message && (
              <span className="mt-2 block text-red-700">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="group">
            <label
              className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
              htmlFor="passwordConfirmation"
            >
              Confirmar senha
            </label>
            <div className="border-b border-zinc-300 flex items-center">
              <div className="flex flex-1 items-center gap-2">
                <AccessIcon className="text-gray-200 group-focus-within:text-orange-dark" />
                <input
                  type="password"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  {...register('passwordConfirmation')}
                  className="w-full outline-none py-4"
                  placeholder="Confirme a senha"
                />
                <ViewIcon
                  className="ml-auto text-gray-200 cursor-pointer"
                  onClick={() => handleSeePassword('passwordConfirmation')}
                />
              </div>
            </div>
            {errors.passwordConfirmation?.message && (
              <span className="mt-2 block text-red-700">
                {errors.passwordConfirmation.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-4 bg-orange-base w-full rounded-lg text-white flex items-center justify-between hover:bg-orange-dark transition-colors"
        >
          Cadastrar
          <ArrowRight02Icon />
        </button>
      </div>

      <div className="space-y-5 mt-20">
        <p className="text-gray-300">Já tem uma conta?</p>
        <Link
          to="/sign-in"
          className="px-5 py-4 bg-transparent border border-orange-base w-full rounded-lg text-orange-base flex items-center justify-between hover:border-orange-dark hover:text-orange-dark transition-all"
        >
          Acessar
          <ArrowRight02Icon />
        </Link>
      </div>
    </form>
  )
}
