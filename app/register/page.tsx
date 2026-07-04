"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [selectedPlan, setSelectedPlan] =
        useState<"starter" | "professional" | "enterprise">(
            "professional"
        );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (!fullName.trim()) {
            setError("Ingrese su nombre");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (!data.user) {
                throw new Error("No se pudo crear el usuario");
            }

            const tokenMap = {
                starter: 1000000,
                professional: 5000000,
                enterprise: 20000000,
            };

            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: data.user.id,
                    full_name: fullName,
                    plan: selectedPlan,
                });

            if (profileError) throw profileError;

            const { error: creditsError } = await supabase
                .from("user_credits")
                .insert({
                    user_id: data.user.id,
                    monthly_tokens: tokenMap[selectedPlan],
                    used_tokens: 0,
                });

            if (creditsError) throw creditsError;

            router.push("/login");
        } catch (err: unknown) {
            if (
                typeof err === "object" &&
                err !== null &&
                "message" in err
            ) {
                setError(String(err.message));
            } else {
                setError("Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#090909] text-white flex items-center justify-center px-6 py-20">
            {/* Glow */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-[600px] h-[600px] rounded-full bg-slate-900/50 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <Link href="/">
                        <Image
                            src="/logo1.svg"
                            alt="Logo"
                            width={60}
                            height={60}
                        />
                    </Link>

                    <h1 className="mt-6 text-4xl font-light">
                        Crear cuenta
                    </h1>

                    <p className="mt-3 text-slate-400 text-center">
                        Comienza a consultar jurisprudencia con IA.
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block mb-2 text-sm text-slate-400">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full rounded-2xl bg-black border border-slate-800 px-4 py-3 outline-none focus:border-yellow-400 transition"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-slate-400">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl bg-black border border-slate-800 px-4 py-3 outline-none focus:border-yellow-400 transition"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm text-slate-400">
                                    Contraseña
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl bg-black border border-slate-800 px-4 py-3 outline-none focus:border-yellow-400 transition"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 text-sm text-slate-400">
                                    Confirmar contraseña
                                </label>

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-2xl bg-black border border-slate-800 px-4 py-3 outline-none focus:border-yellow-400 transition"
                                />
                            </div>
                        </div>

                        {/* Planes */}
                        <div className="pt-4">
                            <h3 className="text-lg mb-4">
                                Selecciona tu plan
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">

                                <button
                                    type="button"
                                    onClick={() => setSelectedPlan("starter")}
                                    className={`rounded-2xl border p-5 text-left transition ${selectedPlan === "starter"
                                        ? "border-yellow-400 bg-yellow-400/5"
                                        : "border-slate-800"
                                        }`}
                                >
                                    <h4 className="font-medium">
                                        Starter
                                    </h4>

                                    <p className="text-slate-400 text-sm mt-2">
                                        1M tokens
                                    </p>

                                    <p className="text-2xl mt-4">
                                        S/19
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedPlan("professional")}
                                    className={`rounded-2xl border p-5 text-left transition relative ${selectedPlan === "professional"
                                        ? "border-yellow-400 bg-yellow-400/5"
                                        : "border-slate-800"
                                        }`}
                                >
                                    <span className="absolute top-3 right-3 text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                                        Popular
                                    </span>

                                    <h4 className="font-medium">
                                        Profesional
                                    </h4>

                                    <p className="text-slate-400 text-sm mt-2">
                                        5M tokens
                                    </p>

                                    <p className="text-2xl mt-4">
                                        S/49
                                    </p>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedPlan("enterprise")}
                                    className={`rounded-2xl border p-5 text-left transition ${selectedPlan === "enterprise"
                                        ? "border-yellow-400 bg-yellow-400/5"
                                        : "border-slate-800"
                                        }`}
                                >
                                    <h4 className="font-medium">
                                        Enterprise
                                    </h4>

                                    <p className="text-slate-400 text-sm mt-2">
                                        20M tokens
                                    </p>

                                    <p className="text-2xl mt-4">
                                        S/149
                                    </p>
                                </button>

                            </div>
                        </div>
                        {error && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-yellow-400 text-black font-medium py-3 rounded-2xl hover:bg-yellow-300 transition mt-6"
                        >
                            Crear cuenta
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-400">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            href="/login"
                            className="text-yellow-400 hover:text-yellow-300"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}