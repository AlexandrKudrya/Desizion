import { useState } from 'react'
import type { ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 relative">
        {/* Mobile sidebar - Sheet drawer */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-72 p-0 bg-card/95 backdrop-blur-xl">
            <SheetHeader className="p-4 border-b border-border/50">
              <SheetTitle className="text-primary glow-text-cyan">
                Проекты
              </SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100%-60px)] overflow-auto">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] glass border-r border-border/50">
            <Sidebar />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>

      {/* Mobile bottom action button */}
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 z-50 md:hidden h-14 w-14 rounded-full shadow-2xl glow-cyan"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  )
}
