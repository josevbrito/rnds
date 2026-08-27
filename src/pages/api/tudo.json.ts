import type { APIRoute } from 'astro';
import { datasetCompleto, respostaJson } from '../../lib/dataset';

export const GET: APIRoute = async () => respostaJson(await datasetCompleto());
