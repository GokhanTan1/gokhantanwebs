'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from './button'
import { Sheet, SheetContent, SheetTrigger } from './sheet'
import { Menu } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menü</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-secondary">
        <nav className="flex flex-col space-y-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-lg font-bold hover:text-primary"
          >
            Gökhan Tan
          </Link>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start hover:text-primary" asChild>
              <Link href="/about" onClick={() => setOpen(false)}>
                Hakkımda
              </Link>
            </Button>
            <Button variant="secondary" className="w-full justify-start hover:text-primary" asChild>
              <Link href="/experience" onClick={() => setOpen(false)}>
                Deneyim
              </Link>
            </Button>
            <Button variant="secondary" className="w-full justify-start hover:text-primary" asChild>
              <Link href="/portfolio" onClick={() => setOpen(false)}>
                Projeler
              </Link>
            </Button>
            <Button variant="secondary" className="w-full justify-start hover:text-primary" asChild>
              <Link href="/contact" onClick={() => setOpen(false)}>
                İletişim
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}