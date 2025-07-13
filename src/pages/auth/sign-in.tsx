import {
  AccessIcon,
  ArrowRight02Icon,
  Mail02Icon,
  ViewIcon,
} from 'hugeicons-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthenticateSellerControllerHandle } from '../../api/sessions/sessions'
import axios, { type AxiosError } from 'axios'
import { toast } from 'sonner'
import { handleSeePassword } from '../../utils/input-utils'

const signInFormSchema = z.object({
  email: z
    .string()
    .email('O valor não é um input do tipo e-mail')
    .min(1, 'Campo obrigatório'),
  password: z.string().min(1, 'Campo obrigatório'),
})

type SignInForm = z.infer<typeof signInFormSchema>

export function SignIn() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
    },
  })

  const { mutateAsync: authenticateSeller, isPending } =
    useAuthenticateSellerControllerHandle()

  async function handleSignIn({ email, password }: SignInForm) {
    try {
      await authenticateSeller({
        data: {
          password,
          email,
        },
      })

      toast.success('Login realizado com sucesso!')
      navigate('/')
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
    <div className="bg-white px-20 py-12 m-6 rounded-[32px] flex flex-col justify-between">
      <form onSubmit={handleSubmit(handleSignIn)} className="space-y-12">
        <div>
          <h1 className="text-gray-500 font-dm-sans font-bold text-2xl">
            Acesse sua conta
          </h1>
          <p className="text-gray-300 text-sm">
            Informe seu e-mail e senha para entrar
          </p>
        </div>

        <div className="space-y-5">
          <div className="group">
            <label
              className="uppercase text-gray-300 text-xs group-focus-within:text-orange-dark"
              htmlFor="email"
            >
              E-mail
            </label>
            <div className="border-b border-zinc-300 flex items-center">
              <div className="flex flex-1 items-center gap-2">
                <Mail02Icon className="text-gray-200 group-focus-within:text-orange-dark" />
                <input
                  {...register('email')}
                  type="text"
                  id="email"
                  className="w-full outline-none py-4"
                  placeholder="Seu e-mail cadastrado"
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
                  {...register('password')}
                  type="password"
                  id="password"
                  className="w-full outline-none py-4"
                  placeholder="Sua senha de acesso"
                />
                <ViewIcon
                  className="ml-auto text-gray-200 cursor-pointer"
                  onClick={() => handleSeePassword('password')}
                />
              </div>
              {errors.password?.message && (
                <span className="mt-2 block text-red-700">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          disabled={isPending}
          type="submit"
          className="px-5 py-4 bg-orange-base w-full rounded-lg text-white flex items-center justify-between hover:bg-orange-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Acessar
          <ArrowRight02Icon />
        </button>
      </form>

      <div className="space-y-5">
        <p className="text-gray-300">Ainda não tem uma conta?</p>
        <Link
          to="/sign-up"
          className="px-5 py-4 bg-transparent border border-orange-base w-full rounded-lg text-orange-base flex items-center justify-between hover:border-orange-dark hover:text-orange-dark transition-all"
        >
          Cadastrar
          <ArrowRight02Icon />
        </Link>
      </div>
    </div>
  )
}
