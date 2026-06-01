import { NextRequest, NextResponse } from 'next/server';
import { searchResolutions } from '@/src/services/poderJudicial/poderJudicialService';
import { PoderJudicialSearchParams } from '@/src/interfaces/poderJudicial';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    console.error('Error in Poder Judicial proxy API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}
