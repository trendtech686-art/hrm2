"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user = session?.user
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error("Email hoặc mật khẩu không đúng")
    }

    router.push("/dashboard")
    router.refresh()
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    session,
  }
}
