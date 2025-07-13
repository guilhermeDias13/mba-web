import {
  ChartHistogramIcon,
  Logout01Icon,
  PackageIcon,
  PlusSignIcon,
} from 'hugeicons-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import logoImg from '../assets/logo.svg'
import { useSignOutControllerHandle } from '../api/sessions/sessions'
import axios, { type AxiosError } from 'axios'
import { toast } from 'sonner'
import { useSellerProfileControllerHandle } from '../api/sellers/sellers'

export function Header() {
  const navigate = useNavigate()
  const { data } = useSellerProfileControllerHandle()
  const { mutateAsync: signOut } = useSignOutControllerHandle()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/sign-in')
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
    <header className="w-full flex justify-between items-center py-4 px-5">
      <img src={logoImg} alt="" className="w-14 h-10" />

      <nav className="flex items-center justify-center gap-2">
        <NavLink
          to="/"
          className="group flex items-center justify-center gap-1 px-4 py-2 aria-[current=page]:bg-shape rounded-xl"
        >
          <ChartHistogramIcon className="text-gray-300 group-[.active]:text-orange-base" />
          <span className="text-gray-300 group-[.active]:text-orange-base group-[.active]:font-semibold">
            Dashboard
          </span>
        </NavLink>
        <NavLink
          to="/products"
          className="group flex items-center justify-center gap-1 px-4 py-2 aria-[current=page]:bg-shape rounded-xl"
        >
          <PackageIcon className="text-gray-300 group-[.active]:text-orange-base" />
          <span className="text-gray-300 group-[.active]:text-orange-base group-[.active]:font-semibold">
            Produtos
          </span>
        </NavLink>
      </nav>

      <div className="flex items-center justify-center gap-4">
        <Link
          to="/products/new"
          className="px-5 py-4 h-10 bg-orange-base rounded-lg text-white flex items-center gap-2 hover:bg-orange-dark transition-colors"
        >
          <PlusSignIcon />
          Novo produto
        </Link>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="size-12 outline-none">
              <img
                src={
                  data?.seller.avatar?.url
                    ? data?.seller.avatar?.url
                    : 'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
                className="size-12 rounded-lg object-cover"
                alt=""
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[120px] rounded-md bg-shape p-1 space-y-2"
              sideOffset={5}
            >
              <DropdownMenu.Item
                disabled
                className="text-md font-dm-sans px-4 py-2 text-gray-300 select-none disabled:opacity-80"
              >
                {data?.seller.name}
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="cursor-pointer text-md font-dm-sans font-semibold flex items-center justify-between px-4 py-2 text-red-500 select-none rounded-md outline-none data-[highlighted]:bg-red-400 hover:bg-red-700/20"
                onClick={handleSignOut}
              >
                Logout
                <Logout01Icon className="size-4" />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
