import {
  PoderJudicialSearchParams,
  PoderJudicialSearchResponse,
  PoderJudicialResult,
  PoderJudicialPdfResponse
} from '../../interfaces/poderJudicial';
import { parsePoderJudicialHtml } from '../../utils/parsers/poderJudicialParser';

const PODER_JUDICIAL_BASE_URL = 'http://181.177.234.6';

const TC_SEARCH_PATH = '/buscarRes/public/resolucionjur';
const TC_OPENURL_PATH = '/buscarRes/public/openurl';

// --- Timeouts ---
// Main search page (HTML) — allow more time since it's the critical request
const SEARCH_TIMEOUT_MS = 15_000;
// Individual PDF URL resolution — these are optional, keep them tight
const PDF_TIMEOUT_MS = 5_000;
// Max concurrent PDF requests to avoid overwhelming the external API
const PDF_CONCURRENCY_LIMIT = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildPoderJudicialUrl(path: string, searchParams?: URLSearchParams) {
  const url = new URL(path, PODER_JUDICIAL_BASE_URL);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url.toString();
}

/**
 * Fetch wrapper with AbortController timeout and structured error handling.
 * Returns `null` instead of throwing so callers can degrade gracefully.
 */
async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  label: string
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(
        `[PoderJudicial] ${label} — HTTP ${response.status} ${response.statusText} | URL: ${url}`
      );
      return null;
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(
        `[PoderJudicial] ${label} — Timeout after ${timeoutMs}ms | URL: ${url}`
      );
    } else {
      console.error(
        `[PoderJudicial] ${label} — Network error | URL: ${url}`,
        error instanceof Error ? error.message : error
      );
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolve the PDF URL for a single result.
 * Returns empty string on any failure (timeout, network, bad response).
 */
async function resolvePdfUrl(ano: string, archivo: string): Promise<string> {
  const openUrl = buildPoderJudicialUrl(
    `${TC_OPENURL_PATH}/${ano}/${archivo}`
  );

  const response = await fetchWithTimeout(
    openUrl,
    PDF_TIMEOUT_MS,
    `PDF resolve (${archivo})`
  );

  if (!response) return '';

  try {
    const data: PoderJudicialPdfResponse = await response.json();
    if (data.existe === 'SI' && data.archivo) {
      return data.archivo;
    }
  } catch (err) {
    console.warn(
      `[PoderJudicial] PDF JSON parse error for ${archivo}:`,
      err instanceof Error ? err.message : err
    );
  }

  return '';
}

/**
 * Process PDF resolution in batches to limit concurrency.
 * Uses Promise.allSettled so one failure never blocks the rest.
 */
async function resolvePdfUrlsBatched(
  results: Omit<PoderJudicialResult, 'pdfUrl'>[]
): Promise<PoderJudicialResult[]> {
  const output: PoderJudicialResult[] = [];

  for (let i = 0; i < results.length; i += PDF_CONCURRENCY_LIMIT) {
    const batch = results.slice(i, i + PDF_CONCURRENCY_LIMIT);

    const settled = await Promise.allSettled(
      batch.map(async (res) => {
        let pdfUrl = '';
        if (res.ano && res.archivo) {
          pdfUrl = await resolvePdfUrl(res.ano, res.archivo);
        }
        return { ...res, pdfUrl } as PoderJudicialResult;
      })
    );

    for (const result of settled) {
      if (result.status === 'fulfilled') {
        output.push(result.value);
      } else {
        // This should rarely happen since resolvePdfUrl already catches errors,
        // but just in case — push the item with empty pdfUrl
        console.warn(
          '[PoderJudicial] Unexpected PDF batch rejection:',
          result.reason
        );
        // We can't recover the original item easily here, but allSettled
        // guarantees we get a result for each input, so this is a safeguard.
        output.push({
          titulo: '',
          expediente: '',
          tipoResolucion: '',
          demandante: '',
          demandado: '',
          resumen: '',
          fechaPublicacion: '',
          fechaIngreso: '',
          score: 0,
          ano: '',
          archivo: '',
          pdfUrl: '',
        });
      }
    }
  }

  return output;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

const EMPTY_RESPONSE: PoderJudicialSearchResponse = {
  results: [],
  pagination: {
    paginaActual: 1,
    totalPaginas: 1,
    paginas: [1],
  },
};

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

  console.log(`[PoderJudicial] Search request — pg=${params.pg} | URL: ${targetUrl}`);

  // --- 1. Fetch main search HTML ---
  const response = await fetchWithTimeout(
    targetUrl,
    SEARCH_TIMEOUT_MS,
    'Main search'
  );

  if (!response) {
    // External API is down/slow — return empty results instead of throwing 500
    console.error(
      '[PoderJudicial] Main search failed — returning empty response as fallback'
    );
    return {
      ...EMPTY_RESPONSE,
      pagination: { ...EMPTY_RESPONSE.pagination, paginaActual: params.pg || 1 },
    };
  }

  // --- 2. Parse HTML ---
  let html: string;
  try {
    html = await response.text();
  } catch (err) {
    console.error(
      '[PoderJudicial] Failed to read response body:',
      err instanceof Error ? err.message : err
    );
    return {
      ...EMPTY_RESPONSE,
      pagination: { ...EMPTY_RESPONSE.pagination, paginaActual: params.pg || 1 },
    };
  }

  const { results: parsedResults, pagination } = parsePoderJudicialHtml(
    html,
    params.pg
  );

  console.log(
    `[PoderJudicial] Parsed ${parsedResults.length} results — resolving PDFs...`
  );

  // --- 3. Resolve PDF URLs (non-blocking, batched, allSettled) ---
  const resultsWithPdf = await resolvePdfUrlsBatched(parsedResults);

  const resolvedCount = resultsWithPdf.filter((r) => r.pdfUrl).length;
  console.log(
    `[PoderJudicial] Done — ${resolvedCount}/${resultsWithPdf.length} PDFs resolved`
  );

  return {
    results: resultsWithPdf,
    pagination,
  };
}
