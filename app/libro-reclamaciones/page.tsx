"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LibroReclamacionesPage() {
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [codigo, setCodigo] = useState("");

  const [form, setForm] = useState({
    tipo: "RECLAMO",

    tipo_documento: "DNI",
    numero_documento: "",

    nombres: "",
    apellidos: "",

    telefono: "",
    correo: "",

    fecha_operacion: "",
    numero_operacion: "",

    servicio: "Consulta y búsqueda de casaciones",

    monto: "",

    detalle: "",
    pedido: "",

    acepta_declaracion: false,
  });

  function actualizarCampo(
    campo: string,
    valor: string | boolean
  ) {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  async function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setEnviando(true);

    try {
      const response = await fetch(
        "/api/libro-reclamaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "No se pudo registrar el reclamo."
        );

        return;
      }

      setCodigo(data.reclamo.codigo);
      setExito(true);

    } catch (error) {
      console.error(error);

      alert(
        "No se pudo conectar con el servidor."
      );

    } finally {
      setEnviando(false);
    }
  }

  if (exito) {
    return (
      <main className="min-h-screen bg-[#050505] px-6 py-16 text-white">

        <div className="mx-auto max-w-2xl">

          <Link
            href="/"
            className="mb-8 inline-block text-sm text-slate-400 hover:text-yellow-400"
          >
            ← Volver a Casaciones
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-[#0b0b0b] p-8 shadow-xl">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
              ✓
            </div>

            <h1 className="mb-4 text-3xl font-bold">
              Registro realizado
            </h1>

            <p className="mb-6 leading-7 text-slate-400">
              Su reclamo o queja ha sido registrado
              correctamente.
            </p>

            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">

              <p className="mb-2 text-sm text-slate-400">
                Código de registro
              </p>

              <p className="text-2xl font-bold tracking-wider text-yellow-400">
                {codigo}
              </p>

            </div>

            <p className="mt-6 text-sm leading-6 text-slate-500">
              Guarde este código para futuras consultas
              relacionadas con su reclamo o queja.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              Volver al inicio
            </Link>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/"
          className="mb-8 inline-block text-sm text-slate-400 hover:text-yellow-400"
        >
          ← Volver a Casaciones
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Libro de Reclamaciones
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-400">
            Utilice este formulario para registrar una
            queja o reclamo relacionado con los servicios
            ofrecidos por Casaciones.
          </p>
        </div>

        <form
          onSubmit={enviarFormulario}
          className="space-y-8"
        >

          {/* Tipo */}

          <section className="rounded-2xl border border-slate-800 bg-[#0b0b0b] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              1. Tipo de solicitud
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  actualizarCampo(
                    "tipo",
                    "RECLAMO"
                  )
                }
                className={`rounded-xl border p-5 text-left transition ${
                  form.tipo === "RECLAMO"
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-slate-700"
                }`}
              >
                <p className="font-semibold">
                  Reclamo
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Disconformidad relacionada con el
                  servicio recibido.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  actualizarCampo(
                    "tipo",
                    "QUEJA"
                  )
                }
                className={`rounded-xl border p-5 text-left transition ${
                  form.tipo === "QUEJA"
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-slate-700"
                }`}
              >
                <p className="font-semibold">
                  Queja
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Disconformidad relacionada con la
                  atención o procedimiento.
                </p>
              </button>

            </div>

          </section>

          {/* Datos personales */}

          <section className="rounded-2xl border border-slate-800 bg-[#0b0b0b] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              2. Datos del consumidor
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tipo de documento
                </label>

                <select
                  value={form.tipo_documento}
                  onChange={(e) =>
                    actualizarCampo(
                      "tipo_documento",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                >
                  <option value="DNI">
                    DNI
                  </option>

                  <option value="CE">
                    Carné de Extranjería
                  </option>

                  <option value="PASAPORTE">
                    Pasaporte
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Número de documento
                </label>

                <input
                  required
                  value={form.numero_documento}
                  onChange={(e) =>
                    actualizarCampo(
                      "numero_documento",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Nombres
                </label>

                <input
                  required
                  value={form.nombres}
                  onChange={(e) =>
                    actualizarCampo(
                      "nombres",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Apellidos
                </label>

                <input
                  required
                  value={form.apellidos}
                  onChange={(e) =>
                    actualizarCampo(
                      "apellidos",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Teléfono
                </label>

                <input
                  value={form.telefono}
                  onChange={(e) =>
                    actualizarCampo(
                      "telefono",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Correo electrónico
                </label>

                <input
                  required
                  type="email"
                  value={form.correo}
                  onChange={(e) =>
                    actualizarCampo(
                      "correo",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

            </div>

          </section>

          {/* Operación */}

          <section className="rounded-2xl border border-slate-800 bg-[#0b0b0b] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              3. Información de la operación
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Fecha de operación
                </label>

                <input
                  type="date"
                  value={form.fecha_operacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "fecha_operacion",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Número de operación
                </label>

                <input
                  value={form.numero_operacion}
                  onChange={(e) =>
                    actualizarCampo(
                      "numero_operacion",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Servicio
                </label>

                <input
                  value={form.servicio}
                  onChange={(e) =>
                    actualizarCampo(
                      "servicio",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Monto involucrado
                </label>

                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.monto}
                  onChange={(e) =>
                    actualizarCampo(
                      "monto",
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white"
                />
              </div>

            </div>

          </section>

          {/* Reclamo */}

          <section className="rounded-2xl border border-slate-800 bg-[#0b0b0b] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              4. Detalle
            </h2>

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Detalle del reclamo o queja
                </label>

                <textarea
                  required
                  rows={7}
                  value={form.detalle}
                  onChange={(e) =>
                    actualizarCampo(
                      "detalle",
                      e.target.value
                    )
                  }
                  className="w-full resize-y rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Pedido del consumidor
                </label>

                <textarea
                  required
                  rows={5}
                  value={form.pedido}
                  onChange={(e) =>
                    actualizarCampo(
                      "pedido",
                      e.target.value
                    )
                  }
                  className="w-full resize-y rounded-xl border border-slate-700 bg-[#111] px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

            </div>

          </section>

          {/* Declaración */}

          <section className="rounded-2xl border border-slate-800 bg-[#0b0b0b] p-6">

            <label className="flex cursor-pointer gap-3">

              <input
                type="checkbox"
                required
                checked={form.acepta_declaracion}
                onChange={(e) =>
                  actualizarCampo(
                    "acepta_declaracion",
                    e.target.checked
                  )
                }
                className="mt-1 h-5 w-5 accent-yellow-400"
              />

              <span className="text-sm leading-6 text-slate-400">
                Declaro que la información proporcionada
                es verdadera y corresponde a los hechos
                descritos en esta reclamación o queja.
              </span>

            </label>

          </section>

          {/* Botón */}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-yellow-400 px-6 py-4 font-bold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviando
              ? "Registrando..."
              : "Registrar reclamo o queja"}
          </button>

        </form>

      </div>

    </main>
  );
}