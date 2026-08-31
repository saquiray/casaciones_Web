'use client'

import {
  useState,
  useEffect,
  useCallback,
} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import UserMenu from '@/components/UserMenu'
import ModalUpgrade from '@/components/ModalUpgrade'
import ModalDetalle from '@/components/ModalDetalle'

import { useAuth } from '@/components/AuthProvider'
import { TESAURO_DATA } from '@/lib/tesauroData'


// ============================================================
// RESULTADO DE BÚSQUEDA CHUNKED
// ============================================================

interface ResultadoBusqueda {

  id: string

  score: number

  documento_id: string

  chunk_id: number

  titulo: string

  fuente: string

  url_pdf: string

  pagina_inicio: number

  pagina_fin: number

  paginas: string

  anio: number

  numero: string

  nombre_archivo: string

  tipo_documento: string

  contenido: string

}


// ============================================================
// RESPUESTA DEL BACKEND
// ============================================================

interface ApiBusquedaResponse {

  paginaActual: number

  porPagina: number

  totalResultados: number

  totalPaginas: number

  resultados: ResultadoBusqueda[]

}


// ============================================================
// TESAURO
// ============================================================

interface TesaurioNode {

  id: number

  nombre: string

  slug: string

  code: string

  count: number

  children?: TesaurioNode[]

}


// ============================================================
// CONFIGURACIÓN
// ============================================================

const AUTH_REQUIRED =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'


// ============================================================
// COMPONENTE
// ============================================================

export default function ElPeruanoPage() {

  const {
    user,
    loading: authLoading,
    perfil,
    setPerfil,
  } = useAuth()


  const router = useRouter()


  // ==========================================================
  // BÚSQUEDA
  // ==========================================================

  const [busqueda, setBusqueda] =
    useState('')


  const [busquedaDebounced, setBusquedaDebounced] =
    useState('')


  const [anio, setAnio] =
    useState('')


  // ==========================================================
  // RESULTADOS
  // ==========================================================

  const [resultados, setResultados] =
    useState<ResultadoBusqueda[]>([])


  const [total, setTotal] =
    useState(0)


  const [paginaActual, setPaginaActual] =
    useState(1)


  const [totalPaginas, setTotalPaginas] =
    useState(0)


  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [buscando, setBuscando] =
    useState(false)


  const [cargando, setCargando] =
    useState(false)


  const [showUpgradeModal, setShowUpgradeModal] =
    useState(false)


  const [casacionSeleccionada, setCasacionSeleccionada] =
    useState<number | null>(null)


  // ==========================================================
  // TESAURO
  // ==========================================================

  const [selectedTesaurioPath, setSelectedTesaurioPath] =
    useState<TesaurioNode[]>([])


  const getNodesForLevel = (
    level: number
  ): TesaurioNode[] => {

    if (level === 0) {

      return TESAURO_DATA as TesaurioNode[]

    }


    const parent =
      selectedTesaurioPath[
        level - 1
      ]


    if (
      !parent?.children?.length
    ) {

      return []

    }


    return parent.children
  }


  const handleSelectTesaurioLevel = (
    level: number,
    slug: string
  ) => {

    if (!slug) {

      setSelectedTesaurioPath(
        prev =>
          prev.slice(0, level)
      )

      return
    }


    const nodes =
      getNodesForLevel(level)


    const selectedNode =
      nodes.find(
        node =>
          node.slug === slug
      )


    if (!selectedNode) {

      return

    }


    setSelectedTesaurioPath(
      prev => {

        const newPath =
          prev.slice(0, level)


        newPath[level] =
          selectedNode


        return newPath

      }
    )

  }


  const getSelectedValueForLevel = (
    level: number
  ) => {

    return (
      selectedTesaurioPath[
        level
      ]?.slug || ''
    )

  }


  const getTesaurioLevelsToRender = () => {

    const levels: number[] = [0]


    selectedTesaurioPath.forEach(
      (
        node,
        index
      ) => {

        if (
          node.children?.length
        ) {

          levels.push(
            index + 1
          )

        }

      }
    )


    return levels
  }


  const getTesaurioLevelTitle = (
    level: number
  ) => {

    if (level === 0) {

      return 'Materia'

    }


    if (level === 1) {

      return 'Submateria'

    }


    if (level === 2) {

      return 'Tema'

    }


    if (level === 3) {

      return 'Subtema'

    }


    return `Nivel ${level + 1}`

  }


  // ==========================================================
  // AUTENTICACIÓN
  // ==========================================================

  useEffect(() => {

    if (
      AUTH_REQUIRED &&
      !authLoading &&
      !user
    ) {

      router.push('/')

    }

  }, [
    authLoading,
    router,
    user,
  ])


  // ==========================================================
  // DEBOUNCE
  // ==========================================================

  useEffect(() => {

    const timeout =
      setTimeout(
        () => {

          setBusquedaDebounced(
            busqueda
          )

        },
        500
      )


    return () =>
      clearTimeout(timeout)

  }, [
    busqueda
  ])


  // ==========================================================
  // BUSCAR SENTENCIAS
  // ==========================================================

  const cargarResultados =
    useCallback(
      async (
        pagina = 1
      ) => {

        if (
          AUTH_REQUIRED &&
          !user
        ) {

          return

        }


        setCargando(true)


        try {

          const params =
            new URLSearchParams()


          // --------------------------------------------------
          // TEXTO
          // --------------------------------------------------

          if (
            busquedaDebounced.trim()
          ) {

            params.set(
              'q',
              busquedaDebounced.trim()
            )

          }


          // --------------------------------------------------
          // AÑO
          // --------------------------------------------------

          if (anio) {

            params.set(
              'year',
              anio
            )

          }


          // --------------------------------------------------
          // PAGINACIÓN
          // --------------------------------------------------

          params.set(
            'pagina',
            pagina.toString()
          )


          // ==================================================
          // NUEVO ENDPOINT DE SENTENCIAS
          // ==================================================

          const url =
            `/api/proxy/search/sentencias?${params.toString()}`


          console.log(
            'Buscando sentencias:',
            url
          )


          const response =
            await fetch(
              url,
              {
                method: 'GET',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                cache: 'no-store',
              }
            )


          // ==================================================
          // ERROR
          // ==================================================

          if (
            !response.ok
          ) {

            const texto =
              await response.text()


            console.error(
              'Error backend:',
              texto
            )


            throw new Error(
              `Error HTTP ${response.status}`
            )

          }


          // ==================================================
          // RESPUESTA
          // ==================================================

          const data:
            ApiBusquedaResponse =
            await response.json()


          console.log(
            'Respuesta sentencias:',
            data
          )


          setResultados(
            data.resultados || []
          )


          setTotal(
            data.totalResultados || 0
          )


          setPaginaActual(
            data.paginaActual || 1
          )


          setTotalPaginas(
            data.totalPaginas || 0
          )


        } catch (error) {

          console.error(
            'Error buscando sentencias:',
            error
          )


          setResultados([])

          setTotal(0)

          setPaginaActual(1)

          setTotalPaginas(0)


        } finally {

          setCargando(false)

        }

      },
      [
        busquedaDebounced,
        anio,
        user,
      ]
    )


  // ==========================================================
  // GASTAR CRÉDITO
  // ==========================================================

  const gastarCredito =
    async () => {

      if (
        !AUTH_REQUIRED ||
        !user
      ) {

        return

      }


      try {

        const response =
          await fetch(
            '/api/creditos/gastar',
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',
              },
            }
          )


        if (
          !response.ok
        ) {

          const error =
            await response.json()


          if (
            response.status === 402
          ) {

            setShowUpgradeModal(
              true
            )


            throw new Error(
              'No tienes créditos disponibles'
            )

          }


          throw new Error(
            error.error ||
            'Error consumiendo crédito'
          )

        }


        const data =
          await response.json()


        if (
          data.success
        ) {

          setPerfil(
            data.perfil
          )

        }


        console.log(
          'Crédito consumido:',
          data
        )


      } catch (error) {

        console.error(
          error
        )


        throw error

      }

    }


  // ==========================================================
  // BOTÓN BUSCAR
  // ==========================================================

  const handleBuscar =
    async () => {

      if (
        buscando
      ) {

        return

      }


      setBuscando(true)


      try {

        await gastarCredito()


        setPaginaActual(1)


        await cargarResultados(
          1
        )


      } catch (error) {

        console.error(
          error
        )


      } finally {

        setBuscando(false)

      }

    }


  // ==========================================================
  // LOADING AUTH
  // ==========================================================

  if (
    authLoading
  ) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-900
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            animate-spin
            rounded-full
            h-10
            w-10
            border-2
            border-amber-500/30
            border-t-amber-500
          "
        />

      </div>

    )

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-900
        via-slate-800
        to-slate-900
      "
    >

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          backdrop-blur-md
          bg-slate-900/70
          border-b
          border-slate-700/50
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-4
            flex
            items-center
            justify-between
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <Link
              href="/"
              className="
                text-slate-400
                hover:text-white
                transition
              "
            >
              ← Volver
            </Link>


            <div>

              <h1
                className="
                  text-2xl
                  font-bold
                  text-white
                "
              >
                Buscador de Sentencias
              </h1>


              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-2
                  mt-2
                "
              >

                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1
                    rounded-full
                    bg-blue-500/10
                    border
                    border-blue-500/30
                    text-blue-400
                    text-xs
                    font-semibold
                  "
                >
                  🏛️ Tribunal Constitucional
                </span>


                <span
                  className="
                    text-sm
                    text-slate-400
                  "
                >
                  OpenSearch + PDFs indexados
                </span>

              </div>

            </div>

          </div>


          <nav
            className="
              hidden
              md:flex
              items-center
              gap-12
              text-sm
              text-slate-300
            "
          >

            <Link
              href="/poder-judicial"
              className="
                hover:text-white
                transition
              "
            >
              Poder Judicial
            </Link>


            <Link
              href="/tribunal-constitucional"
              className="
                hover:text-white
                transition
              "
            >
              Tribunal Constitucional
            </Link>

          </nav>


          <UserMenu />

        </div>

      </header>


      {/* ==================================================== */}
      {/* MAIN */}
      {/* ==================================================== */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          py-6
        "
      >

        {/* ================================================== */}
        {/* FILTROS */}
        {/* ================================================== */}

        <div
          className="
            bg-slate-800/50
            border
            border-slate-700/50
            rounded-2xl
            p-5
            mb-6
          "
        >

          {/* ================================================ */}
          {/* BÚSQUEDA */}
          {/* ================================================ */}

          <div
            className="
              mb-5
            "
          >

            <input
              type="text"
              value={busqueda}
              onChange={
                e =>
                  setBusqueda(
                    e.target.value
                  )
              }
              disabled={
                buscando ||
                cargando
              }
              onKeyDown={
                e => {

                  if (
                    e.key === 'Enter' &&
                    !buscando &&
                    !cargando
                  ) {

                    e.preventDefault()

                    handleBuscar()

                  }

                }
              }
              placeholder='Buscar sentencias... Usa "comillas" para una frase exacta'
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-slate-900
                border
                border-slate-700
                text-white
                outline-none
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />


            <p
              className="
                text-xs
                text-slate-500
                mt-2
              "
            >
              Búsqueda normal:{' '}

              <span
                className="
                  text-slate-300
                "
              >
                voto singular magistrado
              </span>

              {' · '}

              Frase exacta:{' '}

              <span
                className="
                  text-slate-300
                "
              >
                &quot;voto singular del magistrado&quot;
              </span>

              {' · '}

              Presiona Enter para buscar

            </p>

          </div>


          {/* ================================================= */}
          {/* AÑO */}
          {/* ================================================= */}

          <div
            className="
              mb-5
            "
          >

            <label
              className="
                block
                text-sm
                font-semibold
                text-slate-300
                mb-2
              "
            >
              Año
            </label>


            <select
              value={anio}
              onChange={
                e => {

                  setAnio(
                    e.target.value
                  )

                  setPaginaActual(
                    1
                  )

                }
              }
              disabled={
                buscando ||
                cargando
              }
              className="
                w-full
                px-4
                py-3
                rounded-xl
                bg-slate-900
                border
                border-slate-700
                text-white
                outline-none
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              <option value="">
                Todos los años
              </option>


              {Array.from(

                {
                  length:
                    new Date().getFullYear()
                    - 2000
                    + 1
                },

                (_, i) =>
                  new Date().getFullYear()
                  - i

              ).map(
                year => (

                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>

                )
              )}

            </select>

          </div>


          {/* ================================================= */}
          {/* BOTONES */}
          {/* ================================================= */}

          <div
            className="
              flex
              gap-3
              mt-6
            "
          >

            <button
              onClick={
                handleBuscar
              }
              disabled={
                buscando ||
                cargando
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-amber-500
                text-black
                font-semibold
                hover:bg-amber-400
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                min-w-[110px]
              "
            >

              {buscando ||
              cargando
                ? 'Buscando...'
                : 'Buscar'}

            </button>


            <button
              onClick={
                () => {

                  setBusqueda('')

                  setBusquedaDebounced('')

                  setAnio('')

                  setSelectedTesaurioPath([])

                  setPaginaActual(1)

                  setResultados([])

                  setTotal(0)

                  setTotalPaginas(0)

                }
              }
              disabled={
                buscando ||
                cargando
              }
              className="
                px-5
                py-3
                rounded-xl
                bg-slate-700
                text-white
                hover:bg-slate-600
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Limpiar
            </button>

          </div>

        </div>


        {/* ================================================== */}
        {/* INFO */}
        {/* ================================================== */}

        <div
          className="
            text-sm
            text-slate-400
          "
        >

          {cargando ? (

            <span
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  animate-spin
                  rounded-full
                  h-4
                  w-4
                  border-2
                  border-amber-500/30
                  border-t-amber-500
                "
              />

              Buscando...

            </span>

          ) : (

            <>

              <span
                className="
                  text-white
                  font-semibold
                "
              >
                {total}
              </span>

              {' '}

              resultados encontrados


              {totalPaginas > 0 && (

                <span
                  className="
                    ml-2
                    text-slate-500
                  "
                >
                  · Página {paginaActual} de {totalPaginas}
                </span>

              )}

            </>

          )}

        </div>


        {/* ================================================== */}
        {/* RESULTADOS */}
        {/* ================================================== */}

        <div
          className="
            space-y-5
            mt-5
          "
        >

          {resultados.map(
            (
              resultado,
              index
            ) => {

              // ============================================
              // PÁGINA DEL CHUNK
              // ============================================

              const pagina =
                resultado.pagina_inicio ||
                1


              // ============================================
              // PDF
              // ============================================

              const pdfPath =
                resultado.url_pdf ||
                `/sentencias/${encodeURIComponent(
                  resultado.nombre_archivo
                )}`


              // ============================================
              // VISOR
              // ============================================

              const pdfViewerUrl =
                `/api/proxy/pdfjs/web/viewer.html?file=` +
                encodeURIComponent(
                  `/api/proxy${pdfPath}`
                ) +
                `#page=${pagina}&search=${encodeURIComponent(
                  busqueda
                )}`


              // ============================================
              // RESULTADO
              // ============================================

              return (

                <div
                  key={
                    `${resultado.documento_id}-` +
                    `${resultado.chunk_id}-` +
                    `${index}`
                  }
                  className="
                    bg-slate-800/40
                    border
                    border-slate-700/40
                    rounded-2xl
                    overflow-hidden
                    shadow-lg
                    hover:border-amber-500/20
                    transition
                  "
                >

                  {/* ====================================== */}
                  {/* HEADER */}
                  {/* ====================================== */}

                  <div
                    className="
                      p-5
                      border-b
                      border-slate-700/30
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-start
                        lg:justify-between
                        gap-5
                      "
                    >

                      {/* ================================== */}
                      {/* INFO */}
                      {/* ================================== */}

                      <div
                        className="
                          flex-1
                          min-w-0
                        "
                      >

                        {/* -------------------------------- */}
                        {/* TÍTULO */}
                        {/* -------------------------------- */}

                        <h2
                          className="
                            text-white
                            font-bold
                            text-lg
                            leading-7
                            break-words
                          "
                        >
                          {resultado.titulo ||
                            resultado.documento_id}
                        </h2>


                        {/* -------------------------------- */}
                        {/* META */}
                        {/* -------------------------------- */}

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            mt-4
                          "
                        >

                          <span
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-slate-700/40
                              text-slate-300
                              text-xs
                            "
                          >
                            📄 Págs.{' '}
                            {resultado.pagina_inicio}
                            {' - '}
                            {resultado.pagina_fin}
                          </span>


                          <span
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-slate-700/40
                              text-slate-300
                              text-xs
                            "
                          >
                            📅 {resultado.anio}
                          </span>


                          {resultado.numero && (

                            <span
                              className="
                                px-3
                                py-1
                                rounded-xl
                                bg-slate-700/40
                                text-slate-300
                                text-xs
                              "
                            >
                              ⚖️ {resultado.numero}
                            </span>

                          )}


                          <span
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-slate-700/40
                              text-slate-300
                              text-xs
                            "
                          >
                            🏛️ {resultado.fuente}
                          </span>


                          {/* CHUNK */}

                          <span
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-slate-700/40
                              text-slate-300
                              text-xs
                            "
                          >
                            🧩 Chunk{' '}
                            {resultado.chunk_id}
                          </span>


                          {/* SCORE */}

                          <span
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-amber-500/10
                              border
                              border-amber-500/20
                              text-amber-400
                              text-xs
                              font-semibold
                            "
                          >
                            ⭐{' '}
                            {resultado.score?.toFixed(
                              2
                            )}
                          </span>

                        </div>


                        {/* -------------------------------- */}
                        {/* RESUMEN */}
                        {/* -------------------------------- */}

                        <div
                          className="
                            mt-5
                          "
                        >

                          {resultado.contenido ? (

                            <div
                              className="
                                text-sm
                                leading-7
                                text-slate-300
                                bg-slate-900/30
                                border
                                border-slate-700/20
                                rounded-xl
                                p-4
                              "
                            >

                              {resultado.contenido.substring(
                                0,
                                700
                              )}

                              {resultado.contenido.length >
                                700 &&
                                '...'}

                            </div>

                          ) : (

                            <div
                              className="
                                text-slate-500
                                text-sm
                              "
                            >
                              Sin contenido disponible
                            </div>

                          )}

                        </div>

                      </div>


                      {/* ================================== */}
                      {/* BOTONES */}
                      {/* ================================== */}

                      <div
                        className="
                          flex
                          lg:flex-col
                          gap-3
                          shrink-0
                        "
                      >

                        {/* -------------------------------- */}
                        {/* VER PDF */}
                        {/* -------------------------------- */}

                        <a
                          href={
                            pdfViewerUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            font-medium
                            bg-blue-500/10
                            border
                            border-blue-500/30
                            text-blue-400
                            hover:bg-blue-500/20
                            transition
                            text-center
                          "
                        >
                          Ver PDF
                        </a>


                        {/* -------------------------------- */}
                        {/* DESCARGAR */}
                        {/* -------------------------------- */}

                        <a
                          href={
                            `/api/proxy${pdfPath}`
                          }
                          download
                          className="
                            px-4
                            py-3
                            rounded-xl
                            text-sm
                            font-medium
                            bg-emerald-500/10
                            border
                            border-emerald-500/30
                            text-emerald-400
                            hover:bg-emerald-500/20
                            transition
                            text-center
                          "
                        >
                          Descargar
                        </a>

                      </div>

                    </div>

                  </div>

                </div>

              )

            }
          )}

        </div>


        {/* ================================================== */}
        {/* VACÍO */}
        {/* ================================================== */}

        {!cargando &&
          resultados.length === 0 && (

            <div
              className="
                text-center
                py-20
              "
            >

              <div
                className="
                  text-slate-500
                  text-lg
                "
              >
                No se encontraron resultados
              </div>


              <p
                className="
                  text-slate-600
                  text-sm
                  mt-2
                "
              >
                Intenta con otra búsqueda o
                cambia los filtros
              </p>

            </div>

          )}


        {/* ================================================== */}
        {/* PAGINACIÓN */}
        {/* ================================================== */}

        {totalPaginas > 1 && (

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              mt-8
              flex-wrap
            "
          >

            {/* ANTERIOR */}

            <button
              disabled={
                paginaActual === 1 ||
                cargando
              }
              onClick={
                () =>
                  cargarResultados(
                    paginaActual - 1
                  )
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-slate-700
                text-white
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:bg-slate-600
                transition
              "
            >
              ← Anterior
            </button>


            {/* PÁGINAS */}

            {Array.from(
              {
                length:
                  totalPaginas
              },
              (_, index) =>
                index + 1
            )
              .filter(
                page => {

                  return (
                    page === 1 ||
                    page === totalPaginas ||
                    Math.abs(
                      page -
                      paginaActual
                    ) <= 2
                  )

                }
              )
              .map(
                page => (

                  <button
                    key={page}
                    onClick={
                      () =>
                        cargarResultados(
                          page
                        )
                    }
                    disabled={
                      cargando
                    }
                    className={`
                      px-4
                      py-2
                      rounded-xl
                      transition

                      ${
                        page ===
                        paginaActual

                          ? 'bg-amber-500 text-black font-semibold'

                          : 'bg-slate-700 text-white hover:bg-slate-600'
                      }
                    `}
                  >
                    {page}
                  </button>

                )
              )}


            {/* SIGUIENTE */}

            <button
              disabled={
                paginaActual ===
                  totalPaginas ||
                cargando
              }
              onClick={
                () =>
                  cargarResultados(
                    paginaActual + 1
                  )
              }
              className="
                px-4
                py-2
                rounded-xl
                bg-slate-700
                text-white
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:bg-slate-600
                transition
              "
            >
              Siguiente →
            </button>

          </div>

        )}

      </main>


      {/* ==================================================== */}
      {/* MODAL DETALLE */}
      {/* ==================================================== */}

      <ModalDetalle
        casacionId={
          casacionSeleccionada
        }
        onCerrar={
          () =>
            setCasacionSeleccionada(
              null
            )
        }
      />


      {/* ==================================================== */}
      {/* MODAL UPGRADE */}
      {/* ==================================================== */}

      <ModalUpgrade
        isOpen={
          showUpgradeModal
        }
        onClose={
          () =>
            setShowUpgradeModal(
              false
            )
        }
        consultasUsadas={
          perfil?.consultas_usadas ||
          0
        }
        consultasMax={
          perfil?.creditos ||
          0
        }
      />

    </div>

  )

}