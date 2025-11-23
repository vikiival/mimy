"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo/Project Name */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="font-bold text-xl">
            May I?
          </span>
        </Link>
        
        {/* Connect Button */}
        <Button variant="outline" size="sm">Connect Wallet</Button>
      </div>
    </header>
  )
}
