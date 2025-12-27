// ./src/sanity/lib/load-query.ts
import { type QueryParams } from "sanity";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'wlkublm0',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-28',
});

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  const result = await client.fetch<QueryResponse>(
    query,
    params ?? {},
    { filterResponse: false }
  );

  return {
    data: result,
  };
}