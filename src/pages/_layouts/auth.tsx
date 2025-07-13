import { Outlet } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import heroImg from '../../assets/hero.svg'

export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="p-10 grid row-span-1">
        <div className="flex gap-5">
          <div>
            <img src={logoImg} alt="Logomarca" />
          </div>
          <div>
            <span className="font-bold font-dm-sans text-3xl leading-relaxed text-gray-500 block">
              Marketplace
            </span>
            <span className="text-gray-400 block">Painel de Vendedor</span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src={heroImg} alt="" />
        </div>
      </div>
      <Outlet />
    </div>
  )
}
