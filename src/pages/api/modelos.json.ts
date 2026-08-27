import type { APIRoute } from 'astro';
import { dataset, respostaJson } from '../../lib/dataset';

export const GET: APIRoute = async () => respostaJson(await dataset('modelos'));
