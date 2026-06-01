import * as cheerio from 'cheerio';
import { PoderJudicialResult, PoderJudicialPagination } from '../../interfaces/poderJudicial';

export function parsePoderJudicialHtml(html: string, pg: number): { results: Omit<PoderJudicialResult, 'pdfUrl'>[], pagination: PoderJudicialPagination } {
  const $ = cheerio.load(html);
  const results: Omit<PoderJudicialResult, 'pdfUrl'>[] = [];

  $('h3').each((_, el) => {
    const h3 = $(el);
    const link = h3.find('a');
    if (!link.length) return;

    const fullTitle = link.text().trim();
    const firstSpaceIndex = fullTitle.indexOf(' ');
    let expediente = '';
    let tipoResolucion = '';
    if (firstSpaceIndex !== -1) {
      expediente = fullTitle.substring(0, firstSpaceIndex).trim();
      tipoResolucion = fullTitle.substring(firstSpaceIndex + 1).trim();
    } else {
      expediente = fullTitle;
      tipoResolucion = 'SENTENCIA';
    }

    const onclickAttr = link.attr('onclick') || '';
    const onclickMatch = onclickAttr.match(/newwin\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/);
    const ano = onclickMatch ? onclickMatch[1] : '';
    const archivo = onclickMatch ? onclickMatch[2] : '';

    const header = h3.parent();
    let demandante = '';
    let demandado = '';

    header.find('span.date').each((_, span) => {
      const text = $(span).text().trim();
      if (text.startsWith('Demandante:')) {
        demandante = text.replace('Demandante:', '').trim();
      } else if (text.startsWith('Demandado:')) {
        demandado = text.replace('Demandado:', '').trim();
      }
    });

    const divContainer = header.parent();
    const pDetail = divContainer.next('p.item-detalle');
    const resumen = pDetail.text().trim();

    const spanMeta = pDetail.next('span.date');
    const metaText = spanMeta.text().trim();

    const pubMatch = metaText.match(/Resolución publicada el:\s*([^;]+)/i);
    const fechaPublicacion = pubMatch ? pubMatch[1].trim() : '';

    const ingMatch = metaText.match(/Fecha de ingreso del expediente:\s*([^;]+)/i);
    const fechaIngreso = ingMatch ? ingMatch[1].trim() : '';

    const scoreMatch = metaText.match(/Score:\s*([0-9.]+)/i);
    const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

    results.push({
      titulo: `${expediente} ${tipoResolucion}`,
      expediente,
      tipoResolucion,
      demandante,
      demandado,
      resumen,
      fechaPublicacion,
      fechaIngreso,
      score,
      ano,
      archivo,
    });
  });

  // Pagination
  const paginas: number[] = [];
  let totalPaginas = 1;

  $('.pagination li a').each((_, a) => {
    const text = $(a).text().trim();
    const pageNum = parseInt(text, 10);
    if (!isNaN(pageNum)) {
      paginas.push(pageNum);
    }
  });

  if (paginas.length > 0) {
    totalPaginas = Math.max(...paginas);
  } else {
    paginas.push(1);
  }

  const pagination: PoderJudicialPagination = {
    paginaActual: pg,
    totalPaginas,
    paginas,
  };

  return { results, pagination };
}
