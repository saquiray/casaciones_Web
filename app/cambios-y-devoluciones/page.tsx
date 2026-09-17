import Link from "next/link";

export default function CambiosYDevolucionesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Casaciones Judiciales del Perú
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
          <div className="mb-10 border-b pb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Información legal
            </p>

            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Política de Cambios y Devoluciones
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Última actualización: [FECHA]
            </p>
          </div>

          <div className="space-y-10 leading-7">
            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                1. Naturaleza del servicio
              </h2>

              <p>
                Casaciones Judiciales del Perú ofrece servicios digitales
                relacionados con la búsqueda y consulta de información
                jurídica.
              </p>

              <p className="mt-3">
                Los planes y paquetes adquiridos pueden otorgar créditos u
                otros beneficios digitales que serán habilitados en la cuenta
                del usuario una vez confirmado el pago.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                2. Solicitudes de devolución
              </h2>

              <p>
                El usuario podrá solicitar la revisión de una operación cuando
                se presente alguna de las siguientes situaciones:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  El pago fue cobrado pero los créditos no fueron acreditados.
                </li>
                <li>Se produjo un cobro duplicado.</li>
                <li>Se produjo un error atribuible a la plataforma.</li>
                <li>
                  La operación fue procesada de manera distinta a las
                  condiciones informadas durante la compra.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                3. Cómo solicitar una devolución
              </h2>

              <p>
                Las solicitudes deberán enviarse mediante el canal de atención
                establecido:
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-5">
                <p><strong>Correo:</strong> [CORREO]</p>
                <p><strong>Teléfono:</strong> [TELÉFONO]</p>
              </div>

              <p className="mt-4">
                La solicitud deberá incluir, cuando sea posible:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Nombre del usuario.</li>
                <li>Correo asociado a la cuenta.</li>
                <li>Fecha de la operación.</li>
                <li>Monto de la operación.</li>
                <li>Número o referencia de operación.</li>
                <li>Motivo de la solicitud.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                4. Créditos no utilizados
              </h2>

              <p>
                Cuando el usuario solicite la devolución de créditos que no
                hayan sido utilizados, la solicitud será evaluada de acuerdo
                con las circunstancias de la operación, las condiciones
                informadas antes de la compra y la normativa aplicable.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                5. Créditos utilizados
              </h2>

              <p>
                Cuando los créditos adquiridos hayan sido utilizados total o
                parcialmente, la solicitud será evaluada considerando el
                servicio efectivamente utilizado y las condiciones informadas
                durante la contratación.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                6. Cobros duplicados
              </h2>

              <p>
                Si una misma operación hubiera generado un cobro duplicado, el
                usuario podrá solicitar la revisión de la transacción.
              </p>

              <p className="mt-3">
                Una vez verificada la duplicidad, se gestionará la devolución
                que corresponda.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                7. Pago aprobado sin acreditación
              </h2>

              <p>
                Si el proveedor de pagos confirma una operación como aprobada
                pero los créditos no son acreditados, el usuario deberá
                comunicarse con nosotros.
              </p>

              <p className="mt-3">
                Se verificará la operación y, cuando corresponda, se procederá
                con la acreditación del servicio o con la devolución
                correspondiente.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                8. Pagos rechazados
              </h2>

              <p>
                Una operación rechazada no genera la entrega de créditos.
              </p>

              <p className="mt-3">
                Si el usuario observa un cargo pese a que la operación aparece
                como rechazada, deberá comunicarse con nosotros para verificar
                el estado de la transacción.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                9. Tiempo de evaluación
              </h2>

              <p>
                Las solicitudes serán evaluadas dentro del plazo aplicable
                considerando la información proporcionada por el usuario y la
                información disponible del proveedor de pagos.
              </p>

              <p className="mt-3">
                Cuando sea necesario realizar una validación con el proveedor
                de pagos o una entidad financiera, el tiempo de respuesta
                podrá depender de dicho proceso.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                10. Medio de devolución
              </h2>

              <p>
                Cuando corresponda efectuar una devolución, esta se realizará
                mediante el mecanismo disponible para la operación original o
                mediante el mecanismo permitido por el proveedor de pagos.
              </p>

              <p className="mt-3">
                Los tiempos efectivos de abono pueden depender de la entidad
                financiera o proveedor de pagos.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                11. Suscripciones
              </h2>

              <p>
                En caso de existir servicios contratados mediante suscripción,
                el usuario podrá solicitar su cancelación conforme a las
                condiciones mostradas durante la contratación.
              </p>

              <p className="mt-3">
                La cancelación evitará futuras renovaciones cuando se realice
                antes del siguiente cobro, conforme a las condiciones del
                servicio.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                12. Derechos del consumidor
              </h2>

              <p>
                Esta política no limita los derechos que correspondan al
                consumidor conforme a la legislación peruana de protección y
                defensa del consumidor.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold text-slate-900">
                13. Atención al cliente
              </h2>

              <div className="rounded-xl bg-slate-50 p-5">
                <p><strong>Correo:</strong> [CORREO]</p>
                <p><strong>Teléfono:</strong> [TELÉFONO]</p>
                <p><strong>Horario:</strong> [HORARIO]</p>
              </div>
            </section>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm text-blue-900">
                Para presentar una queja o reclamo puede utilizar nuestro{" "}
                <Link
                  href="/libro-reclamaciones"
                  className="font-semibold underline"
                >
                  Libro de Reclamaciones Virtual
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}