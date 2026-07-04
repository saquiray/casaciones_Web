"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/tribunal-constitucional");
    router.refresh();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090909] text-white flex items-center justify-center px-6">
      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[500px] h-[500px] rounded-full bg-slate-900/50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/">
            <Image
              src="/logo1.svg"
              alt="Logo"
              width={60}
              height={60}
              className="mb-4"
            />
          </Link>

          <h1 className="text-4xl font-light">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-slate-400 text-center">
            Accede a tu cuenta para consultar jurisprudencia
            y utilizar el asistente jurídico.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
        >
          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Correo electrónico
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-2xl bg-black border border-slate-800 px-4 py-3 outline-none focus:border-yellow-400 transition"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-400">
                Contraseña
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-2xl bg-black border border-slate-800 px-4 py-3 outline-none focus:border-yellow-400 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-medium py-3 rounded-2xl hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {loading
                ? "Ingresando..."
                : "Iniciar sesión"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-yellow-400 hover:text-yellow-300"
            >
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}