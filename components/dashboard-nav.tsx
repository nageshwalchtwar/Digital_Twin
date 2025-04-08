"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart2, LogOut, PlayCircle } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/cookies here
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="font-bold text-xl text-slate-800">
            Digital Twin
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/dashboard" passHref>
            <Button variant={pathname === "/dashboard" ? "default" : "ghost"} className="gap-2">
              <BarChart2 size={18} />
              <span>Dashboard</span>
            </Button>
          </Link>

          <Link href="/dashboard/simulation" passHref>
            <Button variant={pathname === "/dashboard/simulation" ? "default" : "ghost"} className="gap-2">
              <PlayCircle size={18} />
              <span>Simulation</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
