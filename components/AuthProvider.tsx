'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'

interface Perfil {
  id: string
  email: string
  nombre: string | null
  plan_id: string
  consultas_usadas: number
  fecha_reset: string
  creditos: number
}

interface AuthContextType {
  user: User | null
  perfil: Perfil | null
  setPerfil: React.Dispatch<React.SetStateAction<Perfil | null>>
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshPerfil: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  perfil: null,
  setPerfil: () => { },
  session: null,
  loading: true,
  signOut: async () => { },
  refreshPerfil: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchPerfil = async (userId: string) => {
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setPerfil(data)
    }
  }

  const refreshPerfil = async () => {
    if (user) {
      await fetchPerfil(user.id)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchPerfil(session.user.id)
      }

      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchPerfil(session.user.id)
        } else {
          setPerfil(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    console.log("saliendo")
    setUser(null)
    setPerfil(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{
      user, perfil, setPerfil, session, loading, signOut, refreshPerfil
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
