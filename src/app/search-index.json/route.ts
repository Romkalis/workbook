import { buildSearchIndex } from '@/lib/content';

// Индекс собирается один раз во время сборки и отдаётся как статический файл.
export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndex());
}
