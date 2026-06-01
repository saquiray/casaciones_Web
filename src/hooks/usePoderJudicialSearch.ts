import { useState, useCallback } from 'react';
import { PoderJudicialSearchParams, PoderJudicialResult, PoderJudicialPagination } from '../interfaces/poderJudicial';

export function usePoderJudicialSearch() {
  const [params, setParams] = useState<PoderJudicialSearchParams>({
    filtro: 'S',
    search: '',
    demandante: '',
    demandado: '',
    numexpediente: '',
    anoingreso: '',
    idtipoproceso: 0,
    anopublica: '',
    pg: 1,
  });

  const [results, setResults] = useState<PoderJudicialResult[]>([]);
  const [pagination, setPagination] = useState<PoderJudicialPagination>({
    paginaActual: 1,
    totalPaginas: 1,
    paginas: [1],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (currentParams: PoderJudicialSearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set('filtro', currentParams.filtro);
      queryParams.set('search', currentParams.search || '');
      queryParams.set('demandante', currentParams.demandante || '');
      queryParams.set('demandado', currentParams.demandado || '');
      queryParams.set('numexpediente', currentParams.numexpediente || '');
      queryParams.set('anoingreso', currentParams.anoingreso || '');
      queryParams.set('idtipoproceso', String(currentParams.idtipoproceso));
      queryParams.set('anopublica', currentParams.anopublica || '');
      queryParams.set('pg', String(currentParams.pg));

      const res = await fetch(`/api/poder-judicial/search?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error('Error al realizar la búsqueda.');
      }
      const data = await res.json();
      setResults(data.results || []);
      setPagination(data.pagination || { paginaActual: currentParams.pg, totalPaginas: 1, paginas: [1] });
      setParams(currentParams);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Error de conexión');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    params,
    setParams,
    results,
    pagination,
    loading,
    error,
    search,
  };
}
