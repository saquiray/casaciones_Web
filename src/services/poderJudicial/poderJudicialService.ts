import {
  PoderJudicialSearchParams,
  PoderJudicialSearchResponse,
  PoderJudicialResult,
  PoderJudicialPdfResponse
} from '../../interfaces/poderJudicial';
import { parsePoderJudicialHtml } from '../../utils/parsers/poderJudicialParser';

const PODER_JUDICIAL_BASE_URL =
  process.env.PODER_JUDICIAL_BASE_URL || 'http://181.177.234.6';

const TC_SEARCH_PATH = '/buscarRes/public/resolucionjur';
const TC_OPENURL_PATH = '/buscarRes/public/openurl';

function buildPoderJudicialUrl(path: string, searchParams?: URLSearchParams) {
  const url = new URL(path, PODER_JUDICIAL_BASE_URL);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url.toString();
}

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

  const targetUrl = buildPoderJudicialUrl(TC_SEARCH_PATH, queryParams);

  const response = await fetch(targetUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch resolutions search from ${targetUrl}: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const { results: parsedResults, pagination } = parsePoderJudicialHtml(html, params.pg);

  // Now, resolve PDF URLs using the openurl endpoint in parallel
  const resultsWithPdf: PoderJudicialResult[] = await Promise.all(
    parsedResults.map(async (res) => {
      let pdfUrl = '';
      if (res.ano && res.archivo) {
        try {
          const openUrl = buildPoderJudicialUrl(
            `${TC_OPENURL_PATH}/${res.ano}/${res.archivo}`
          );
          const openRes = await fetch(openUrl, { cache: 'no-store' });
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
