import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { currentUser } from '@/data/firm'
import { initials } from '@/lib/format'

interface TopbarProps {
  title: string
  onOpenMobileMenu: () => void
}

export function Topbar({ title, onOpenMobileMenu }: TopbarProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Menu mobile */}
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Abrir menu"
        className="grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      {/* Busca */}
      <div className="ml-auto hidden items-center md:flex">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar casos, clientes, prazos..."
            aria-label="Buscar"
            className="h-10 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background xl:w-80"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 md:ml-2">
        <ThemeToggle />

        {/* Notificações */}
        <button
          type="button"
          aria-label="Notificações"
          className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" strokeWidth={1.75} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-critical ring-2 ring-surface" />
        </button>

        {/* Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-foreground">
                {currentUser.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {currentUser.role}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
              <Settings /> Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/login')}
              className="text-critical focus:text-critical [&_svg]:text-critical"
            >
              <LogOut /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
