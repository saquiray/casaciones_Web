import Link from "next/link";

export default function TerminosYCondicionesPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Volver */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-slate-400 transition hover:text-yellow-400"
        >
          ← Volver a Casaciones
        </Link>

        {/* Encabezado */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Términos y Condiciones
          </h1>

          <p className="mt-4 text-sm text-slate-400">
            Última actualización: [FECHA]
          </p>
        </div>

        <div className="space-y-10 text-[15px] leading-7 text-slate-300">

          {/* 1 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              1. Información del titular de la plataforma
            </h2>

            <p>
              Los presentes Términos y Condiciones regulan el acceso,
              navegación y utilización de la plataforma digital
              <strong className="text-white"> Casaciones </strong>
              (en adelante, la &quot;Plataforma&quot;), así como la adquisición
              y utilización de los servicios y paquetes de créditos
              ofrecidos a través de ella.
            </p>

            <div className="mt-4 rounded-xl border border-slate-800 bg-[#0b0b0b] p-5">
              <p>
                <strong className="text-white">Razón social:</strong>{" "}
                [RAZÓN SOCIAL]
              </p>

              <p>
                <strong className="text-white">RUC:</strong>{" "}
                [RUC]
              </p>

              <p>
                <strong className="text-white">Domicilio:</strong>{" "}
                [DIRECCIÓN]
              </p>

              <p>
                <strong className="text-white">Correo electrónico:</strong>{" "}
                [CORREO]
              </p>

              <p>
                <strong className="text-white">Teléfono:</strong>{" "}
                [TELÉFONO]
              </p>
            </div>

            <p className="mt-4">
              Para efectos de estos Términos y Condiciones, la empresa
              antes identificada será denominada &quot;Casaciones&quot;,
              &quot;nosotros&quot; o &quot;la Plataforma&quot;.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              2. Aceptación de los términos
            </h2>

            <p>
              El acceso, registro y utilización de la Plataforma implica
              que el usuario declara haber leído y comprendido estos
              Términos y Condiciones y acepta sujetarse a ellos.
            </p>

            <p className="mt-4">
              Cuando corresponda, determinadas operaciones realizadas
              dentro de la Plataforma podrán requerir que el usuario
              manifieste expresamente su aceptación de estos términos
              antes de continuar.
            </p>

            <p className="mt-4">
              Si el usuario no está de acuerdo con alguno de estos
              términos, deberá abstenerse de utilizar los servicios
              correspondientes.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              3. Descripción del servicio
            </h2>

            <p>
              Casaciones es una plataforma digital destinada a facilitar
              la búsqueda, consulta y acceso a información relacionada
              con casaciones y resoluciones judiciales disponibles en
              las fuentes y bases de información incorporadas en la
              Plataforma.
            </p>

            <p className="mt-4">
              La Plataforma puede proporcionar herramientas de búsqueda,
              filtros, consulta de información, visualización de
              resultados y otros servicios tecnológicos relacionados.
            </p>

            <p className="mt-4">
              La información presentada tiene finalidad informativa y
              de consulta. El usuario es responsable de verificar la
              información que considere necesaria directamente en las
              fuentes oficiales correspondientes cuando requiera
              certeza jurídica, vigencia o integridad documental.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              4. Registro de usuarios
            </h2>

            <p>
              Para acceder a determinadas funcionalidades de la
              Plataforma, el usuario podrá necesitar crear una cuenta.
            </p>

            <p className="mt-4">
              El usuario se compromete a proporcionar información
              verdadera, completa y actualizada durante el proceso de
              registro.
            </p>

            <p className="mt-4">
              El usuario es responsable de mantener la confidencialidad
              de sus credenciales de acceso y de las actividades
              realizadas desde su cuenta.
            </p>

            <p className="mt-4">
              En caso de detectar un acceso no autorizado o cualquier
              situación que pueda comprometer la seguridad de su cuenta,
              el usuario deberá comunicarlo a Casaciones a través de los
              canales de contacto disponibles.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              5. Paquetes de créditos
            </h2>

            <p>
              Casaciones ofrece paquetes de créditos que pueden ser
              adquiridos por los usuarios para utilizar determinadas
              funcionalidades de la Plataforma.
            </p>

            <p className="mt-4">
              Antes de realizar una compra, el usuario podrá visualizar
              el paquete seleccionado, la cantidad de créditos
              correspondiente y el precio aplicable.
            </p>

            <p className="mt-4">
              Salvo que se indique expresamente lo contrario en la
              Plataforma, los paquetes de créditos corresponden a
              compras de pago único y no constituyen una suscripción
              periódica.
            </p>
          </section>

          {/* 6 - MUY IMPORTANTE */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              6. Vigencia de los créditos
            </h2>

            <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6">

              <p className="font-semibold text-yellow-400">
                Los créditos adquiridos en Casaciones no tienen fecha
                de vencimiento.
              </p>

              <p className="mt-4">
                Los créditos permanecen asociados a la cuenta del
                usuario hasta que sean utilizados y no serán eliminados
                o descontados automáticamente por el transcurso del
                tiempo.
              </p>

              <p className="mt-4">
                En consecuencia, un usuario que adquiera un paquete de
                créditos podrá utilizarlos posteriormente sin que exista
                una fecha límite de utilización establecida por
                Casaciones.
              </p>

            </div>

            <p className="mt-4">
              La condición de no vencimiento no impide que puedan
              realizarse ajustes derivados de operaciones fraudulentas,
              errores técnicos, duplicidades, reversos de pagos o
              cualquier otra situación debidamente justificada.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              7. Consumo de créditos
            </h2>

            <p>
              De acuerdo con la información publicada actualmente en
              la Plataforma, cada búsqueda que utilice el sistema de
              consulta puede consumir un (1) crédito.
            </p>

            <p className="mt-4">
              El consumo de créditos será registrado en la cuenta del
              usuario conforme a las reglas técnicas implementadas por
              la Plataforma.
            </p>

            <p className="mt-4">
              El usuario deberá verificar su saldo disponible antes de
              realizar operaciones que consuman créditos.
            </p>

            <p className="mt-4">
              Las funcionalidades específicas que consumen créditos y
              la cantidad correspondiente podrán modificarse en el
              futuro. Cualquier modificación relevante será comunicada
              mediante la Plataforma.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              8. Precios
            </h2>

            <p>
              Los precios de los paquetes de créditos serán mostrados
              en la Plataforma antes de que el usuario confirme la
              compra.
            </p>

            <p className="mt-4">
              Los precios se expresan en soles peruanos (S/), salvo que
              se indique expresamente otra moneda.
            </p>

            <p className="mt-4">
              Casaciones podrá modificar sus precios, promociones o
              características comerciales en cualquier momento.
              Los cambios no afectarán las compras que ya hayan sido
              confirmadas, salvo cuando corresponda legalmente realizar
              una corrección, reversión o ajuste.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              9. Proceso de compra
            </h2>

            <p>
              Para adquirir créditos, el usuario deberá seleccionar el
              paquete de su preferencia y continuar con el proceso de
              pago habilitado en la Plataforma.
            </p>

            <p className="mt-4">
              Antes de confirmar la operación, el usuario podrá revisar
              la información correspondiente al paquete seleccionado,
              incluyendo su precio y cantidad de créditos.
            </p>

            <p className="mt-4">
              La compra será considerada realizada cuando el sistema
              confirme satisfactoriamente el pago y Casaciones pueda
              verificar la operación.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              10. Medios de pago
            </h2>

            <p>
              Los pagos podrán procesarse mediante los medios de pago
              habilitados por Casaciones a través de su proveedor de
              servicios de pago.
            </p>

            <p className="mt-4">
              Entre los medios que podrían estar disponibles se
              encuentran tarjetas de crédito o débito y otros medios
              habilitados por el proveedor de pagos, según disponibilidad
              y condiciones vigentes.
            </p>

            <p className="mt-4">
              La aprobación o rechazo de una transacción puede depender
              del proveedor de pagos, entidad financiera, banco emisor
              u otros participantes del sistema de pagos.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              11. Acreditación de créditos
            </h2>

            <p>
              Una vez confirmado un pago válido, los créditos
              correspondientes al paquete adquirido serán acreditados
              en la cuenta del usuario de acuerdo con el funcionamiento
              de la Plataforma.
            </p>

            <p className="mt-4">
              Si el pago fue efectuado pero los créditos no aparecen
              correctamente en la cuenta, el usuario deberá comunicarse
              con Casaciones proporcionando, de ser posible, los datos
              de la operación y el comprobante correspondiente.
            </p>

            <p className="mt-4">
              Casaciones podrá solicitar información adicional para
              verificar la transacción.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              12. Errores en las transacciones
            </h2>

            <p>
              En caso de detectarse una transacción duplicada, un pago
              procesado incorrectamente, un error de acreditación o
              cualquier otra incidencia relacionada con una operación,
              Casaciones podrá realizar las verificaciones y ajustes
              correspondientes.
            </p>

            <p className="mt-4">
              Los ajustes se realizarán procurando mantener un registro
              verificable de la operación y respetando los derechos que
              correspondan al consumidor conforme a la legislación
              aplicable.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              13. Uso permitido de la Plataforma
            </h2>

            <p>
              El usuario se compromete a utilizar la Plataforma de forma
              lícita y de acuerdo con estos Términos y Condiciones.
            </p>

            <p className="mt-4">
              Está prohibido utilizar la Plataforma para:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Realizar actividades contrarias a la legislación
                aplicable.
              </li>

              <li>
                Intentar acceder sin autorización a cuentas, sistemas,
                bases de datos o infraestructura de Casaciones.
              </li>

              <li>
                Interferir con el funcionamiento normal de la
                Plataforma.
              </li>

              <li>
                Intentar evadir los mecanismos de control de créditos.
              </li>

              <li>
                Automatizar consultas de manera abusiva o que pueda
                afectar la disponibilidad del servicio.
              </li>

              <li>
                Utilizar vulnerabilidades o errores técnicos para
                obtener créditos, información o funcionalidades de
                manera no autorizada.
              </li>

              <li>
                Reproducir, redistribuir o comercializar contenidos o
                información obtenidos mediante la Plataforma cuando
                ello infrinja derechos de terceros o la legislación
                aplicable.
              </li>
            </ul>
          </section>

          {/* 14 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              14. Disponibilidad del servicio
            </h2>

            <p>
              Casaciones procurará mantener la Plataforma disponible y
              operativa, pero pueden producirse interrupciones
              temporales debido a mantenimiento, actualizaciones,
              problemas técnicos, fallas de proveedores, problemas de
              conectividad u otras circunstancias.
            </p>

            <p className="mt-4">
              Cuando sea posible, Casaciones procurará realizar
              mantenimientos programados de manera que reduzcan la
              afectación al servicio.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              15. Información de fuentes judiciales
            </h2>

            <p>
              La Plataforma puede recopilar, organizar, indexar o
              presentar información proveniente de fuentes públicas,
              institucionales u otras fuentes disponibles para consulta.
            </p>

            <p className="mt-4">
              La incorporación de información en la Plataforma no
              significa que Casaciones sea la entidad emisora de las
              resoluciones judiciales o documentos consultados.
            </p>

            <p className="mt-4">
              El usuario debe considerar como fuente primaria aquella
              entidad oficial que corresponda al documento o información
              que esté consultando.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              16. Propiedad intelectual
            </h2>

            <p>
              Los elementos propios de la Plataforma, incluyendo su
              diseño, código, interfaces, logotipos, marcas, textos,
              gráficos, estructura y demás elementos protegibles,
              pertenecen a Casaciones o se utilizan legítimamente bajo
              licencia o autorización.
            </p>

            <p className="mt-4">
              El acceso a la Plataforma no implica la transferencia al
              usuario de derechos de propiedad intelectual sobre sus
              elementos.
            </p>

            <p className="mt-4">
              Los documentos y resoluciones provenientes de terceros
              mantienen los derechos que correspondan a sus respectivos
              titulares y fuentes.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              17. Protección de datos personales
            </h2>

            <p>
              El tratamiento de los datos personales proporcionados por
              los usuarios se realizará de acuerdo con la Política de
              Privacidad de Casaciones y la legislación peruana
              aplicable en materia de protección de datos personales.
            </p>

            <p className="mt-4">
              Para conocer cómo se recopilan, utilizan, almacenan y
              protegen los datos personales, el usuario puede consultar
              nuestra:
            </p>

            <Link
              href="/politica-privacidad"
              className="mt-4 inline-block font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Política de Privacidad →
            </Link>
          </section>

          {/* 18 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              18. Cambios y devoluciones
            </h2>

            <p>
              Las solicitudes relacionadas con pagos, compras, errores
              de acreditación, duplicidad de cargos y demás incidencias
              comerciales serán atendidas de acuerdo con la Política de
              Cambios y Devoluciones publicada por Casaciones.
            </p>

            <Link
              href="/cambios-y-devoluciones"
              className="mt-4 inline-block font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Ver Política de Cambios y Devoluciones →
            </Link>
          </section>

          {/* 19 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              19. Libro de Reclamaciones
            </h2>

            <p>
              Los usuarios y consumidores pueden presentar reclamos o
              quejas relacionados con los servicios ofrecidos por
              Casaciones mediante el Libro de Reclamaciones disponible
              en la Plataforma.
            </p>

            <Link
              href="/libro-reclamaciones"
              className="mt-4 inline-block font-semibold text-yellow-400 hover:text-yellow-300"
            >
              Acceder al Libro de Reclamaciones →
            </Link>
          </section>

          {/* 20 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              20. Responsabilidad del usuario
            </h2>

            <p>
              El usuario es responsable de la información que proporcione
              a la Plataforma y del uso que realice de su cuenta,
              créditos, resultados de búsqueda y demás funcionalidades.
            </p>

            <p className="mt-4">
              El usuario deberá mantener sus datos de acceso bajo
              condiciones razonables de seguridad y no compartirlos con
              terceros cuando ello pueda comprometer su cuenta.
            </p>
          </section>

          {/* 21 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              21. Limitaciones relacionadas con la información
            </h2>

            <p>
              Casaciones realiza esfuerzos razonables para mantener la
              información disponible en la Plataforma de manera
              organizada y accesible.
            </p>

            <p className="mt-4">
              Sin embargo, pueden existir diferencias, retrasos,
              omisiones, errores de indexación, problemas de formato o
              información incompleta derivados de las fuentes originales
              o de procesos técnicos.
            </p>

            <p className="mt-4">
              La Plataforma no sustituye el análisis profesional,
              jurídico o institucional que corresponda a cada caso.
            </p>
          </section>

          {/* 22 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              22. Suspensión de cuentas
            </h2>

            <p>
              Casaciones podrá suspender temporalmente una cuenta cuando
              existan indicios razonables de uso fraudulento, acceso no
              autorizado, abuso de la Plataforma, incumplimiento de
              estos términos o situaciones que puedan comprometer la
              seguridad del servicio.
            </p>

            <p className="mt-4">
              Cuando corresponda, se realizarán las verificaciones
              necesarias antes de adoptar medidas definitivas.
            </p>
          </section>

          {/* 23 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              23. Modificación de los términos
            </h2>

            <p>
              Casaciones podrá actualizar estos Términos y Condiciones
              para reflejar cambios en sus servicios, funcionalidades,
              procesos, condiciones comerciales o requisitos legales.
            </p>

            <p className="mt-4">
              La versión vigente será publicada en esta página indicando
              la fecha de actualización correspondiente.
            </p>

            <p className="mt-4">
              Los cambios que afecten de manera relevante las
              condiciones de contratación serán comunicados mediante los
              mecanismos que correspondan.
            </p>
          </section>

          {/* 24 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              24. Comunicaciones
            </h2>

            <p>
              Las comunicaciones relacionadas con la cuenta, operaciones
              de compra, seguridad, servicio y atención al consumidor
              podrán realizarse mediante el correo electrónico asociado
              a la cuenta del usuario u otros canales habilitados por
              Casaciones.
            </p>

            <p className="mt-4">
              El usuario es responsable de mantener actualizada su
              información de contacto.
            </p>
          </section>

          {/* 25 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              25. Legislación aplicable
            </h2>

            <p>
              Estos Términos y Condiciones se interpretarán de acuerdo
              con la legislación peruana aplicable, sin perjuicio de los
              derechos que correspondan a los consumidores conforme a
              las normas de protección al consumidor y demás normativa
              aplicable.
            </p>
          </section>

          {/* 26 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              26. Contacto
            </h2>

            <p>
              Para consultas relacionadas con estos Términos y
              Condiciones, el servicio, pagos o cualquier otra cuestión
              relacionada con la Plataforma, puede comunicarse con
              nosotros mediante:
            </p>

            <div className="mt-5 rounded-xl border border-slate-800 bg-[#0b0b0b] p-5">
              <p>
                <strong className="text-white">
                  Correo:
                </strong>{" "}
                [CORREO]
              </p>

              <p className="mt-2">
                <strong className="text-white">
                  Teléfono:
                </strong>{" "}
                [TELÉFONO]
              </p>

              <p className="mt-2">
                <strong className="text-white">
                  Horario de atención:
                </strong>{" "}
                [HORARIO]
              </p>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-slate-800 pt-8">

          <div className="flex flex-wrap gap-5 text-sm">

            <Link
              href="/politica-privacidad"
              className="text-slate-400 hover:text-yellow-400"
            >
              Política de privacidad
            </Link>

            <Link
              href="/cambios-y-devoluciones"
              className="text-slate-400 hover:text-yellow-400"
            >
              Cambios y devoluciones
            </Link>

            <Link
              href="/libro-reclamaciones"
              className="text-slate-400 hover:text-yellow-400"
            >
              Libro de reclamaciones
            </Link>

          </div>

          <p className="mt-6 text-xs text-slate-600">
            © {new Date().getFullYear()} Casaciones. Todos los derechos
            reservados.
          </p>

        </div>

      </div>
    </main>
  );
}