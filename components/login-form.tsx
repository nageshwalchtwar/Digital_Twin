"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Array of valid credentials
  const validCredentials = [
    { username: "Ankit", password: "admin123" },
    { username: "Nagesh", password: "admin123" },
    { username: "Shailesh", password: "admin123" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    // Check if the entered credentials match any in the validCredentials array
    const isValid = validCredentials.some(
      (cred) => cred.username === username && cred.password === password
    )

    if (isValid) {
      router.push("/dashboard")
    } else {
      setError("I know its hard to remember but your entered credentials are incorrect")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <User size={16} />
            </div>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              placeholder="Enter your username here"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <Lock size={16} />
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              placeholder="Enter your password here"
            />
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-500">{error}</div>}

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  )
}