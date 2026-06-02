import { NextRequest, NextResponse } from 'next/server';
import { searchResolutions } from '@/src/services/poderJudicial/poderJudicialService';
import { PoderJudicialSearchParams } from '@/src/interfaces/poderJudicial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Netlify serverless functions have a 10s default timeout.
// Our service already handles timeouts internally and returns
// graceful fallbacks, so this route should almost never 500.

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filtro = (searchParams.get('filtro') || 'S') as 'S' | 'A' | 'F';
    const search = searchParams.get('search') || '';
    const demandante = searchParams.get('demandante') || '';
    const demandado = searchParams.get('demandado') || '';
    const numexpediente = searchParams.get('numexpediente') || '';
    const anoingreso = searchParams.get('anoingreso') || '';
    const idtipoproceso = parseInt(searchParams.get('idtipoproceso') || '0', 10);
    const anopublica = searchParams.get('anopublica') || '';
    const pg = parseInt(searchParams.get('pg') || '1', 10);

    const params: PoderJudicialSearchParams = {
      filtro,
      search,
      demandante,
      demandado,
      numexpediente,
      anoingreso,
      idtipoproceso,
      anopublica,
      pg,
    };

    const data = await searchResolutions(params);
    return NextResponse.json(data);
  } catch (error) {
    // Last-resort catch — the service should never throw, but if something
    // truly unexpected happens, return a valid empty response with a warning
    // header instead of a 500 that breaks the frontend.
    console.error(
      '[API /poder-judicial/search] Unhandled error:',
      error instanceof Error ? error.stack : error
    );

    return NextResponse.json(
      {
        results: [],
        pagination: {
          paginaActual: 1,
          totalPaginas: 1,
          paginas: [1],
        },
        _warning: 'El servicio externo no está disponible. Intente nuevamente.',
      },
      {
        status: 200,
        headers: {
          'X-Fallback': 'true',
        },
      }
    );
  }
}
