import {
  PoderJudicialSearchParams,
  PoderJudicialSearchResponse,
  PoderJudicialResult,
  PoderJudicialPdfResponse
} from '../../interfaces/poderJudicial';
import { parsePoderJudicialHtml } from '../../utils/parsers/poderJudicialParser';

const TC_SEARCH_URL = 'http://181.177.234.6/buscarRes/public/resolucionjur';
const TC_OPENURL_BASE = 'http://181.177.234.6/buscarRes/public/openurl';

export async function searchResolutions(
  params: PoderJudicialSearchParams
): Promise<PoderJudicialSearchResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set('filtro', params.filtro || 'S');
  queryParams.set('search', params.search || '');
  queryParams.set('demandante', params.demandante || '');
  queryParams.set('demandado', params.demandado || '');
  queryParams.set('numexpediente', params.numexpediente || '');
  queryParams.set('anoingreso', params.anoingreso || '');
  queryParams.set('idtipoproceso', String(params.idtipoproceso ?? 0));
  queryParams.set('anopublica', params.anopublica || '');
  queryParams.set('pg', String(params.pg || 1));

  const targetUrl = `${TC_SEARCH_URL}?${queryParams.toString()}`;

  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch resolutions search: ${response.statusText}`);
  }

  const html = await response.text();
  const { results: parsedResults, pagination } = parsePoderJudicialHtml(html, params.pg);

  // Now, resolve PDF URLs using the openurl endpoint in parallel
  const resultsWithPdf: PoderJudicialResult[] = await Promise.all(
    parsedResults.map(async (res) => {
      let pdfUrl = '';
      if (res.ano && res.archivo) {
        try {
          const openUrl = `${TC_OPENURL_BASE}/${res.ano}/${res.archivo}`;
          const openRes = await fetch(openUrl);
          if (openRes.ok) {
            const data: PoderJudicialPdfResponse = await openRes.json();
            if (data.existe === 'SI' && data.archivo) {
              pdfUrl = data.archivo;
            }
          }
        } catch (err) {
          console.error(`Error resolving PDF URL for ${res.archivo}:`, err);
        }
      }
      return {
        ...res,
        pdfUrl,
      };
    })
  );

  return {
    results: resultsWithPdf,
    pagination,
  };
}
