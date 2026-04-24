import type { ProteinMetadata } from "@/types/simulation.types";

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>
}

type PDBLookupResult =
  | { status: "success"; data: ProteinMetadata }
  | { status: "error"; message: string }
  | { status: "not_found"; message: string }

type EntryQueryData = {
  rcsb_entry_info: {
    deposited_atom_count?: number | null;
    experimental_method?: string | null;
    molecular_weight?: number | null;
  } | null;
  rcsb_primary_citation: {
    pdbx_database_id_DOI?: string | null;
    title?: string | null;
  } | null;
  rcsb_accession_info: {
    initial_release_date?: string | null;
    revision_date?: string | null;
  } | null;
  struct_keywords: {
    pdbx_keywords?: string[] | null;
  } | null;
  struct: {
    title?: string | null;
  } | null;
}


const PDB_GRAPHQL_ENDPOINT = "https://data.rcsb.org/graphql";
const PBDID_METADATA_QUERY = `query GetPDBMetadata($pdbId: String!) {
  entry(entry_id: $pdbId) {
    rcsb_entry_info {
      deposited_atom_count,
      experimental_method, 
      molecular_weight,
    },
    rcsb_primary_citation {
      pdbx_database_id_DOI,
      title,
    },
    rcsb_accession_info {
      initial_release_date,
      revision_date,
    },
    struct_keywords {
      pdbx_keywords,
    },
    struct {
      title
    },
  }
}`

export async function fetchPDBMetadata(pdbId: string, signal?: AbortSignal): Promise<PDBLookupResult> {

  try {
    const response = await fetch(PDB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: PBDID_METADATA_QUERY,
        variables: { pdbId: pdbId.trim().toUpperCase() }
      }),
      signal,
    });

    if (!response.ok) {
      return { status: "error", message: `PDB query failed: ${response.statusText}` };
    }

    const json = await response.json() as GraphQLResponse<{ entry: EntryQueryData }>;

    if (json.errors) {
      return { status: "error", message: `GraphQL error: ${json.errors.map(e => e.message).join(", ")}` };
    }

    const entry = json.data?.entry;

    if (!entry) {
      return { status: "not_found", message: `No metadata found for PDB ID ${pdbId}` };
    }

    const metadata: ProteinMetadata = {
      entryId: pdbId.toUpperCase(),
      title: entry.struct?.title ?? null,
      deposited_atom_count: entry.rcsb_entry_info?.deposited_atom_count ?? null,
      experimental_method: entry.rcsb_entry_info?.experimental_method ?? null,
      molecular_weight: entry.rcsb_entry_info?.molecular_weight ?? null,
      pdbx_database_id_DOI: entry.rcsb_primary_citation?.pdbx_database_id_DOI ?? null,
      citation_title: entry.rcsb_primary_citation?.title ?? null,
      pdbx_keywords: entry.struct_keywords?.pdbx_keywords ?? [],
      initial_release_date: entry.rcsb_accession_info?.initial_release_date ?? null,
      revision_date: entry.rcsb_accession_info?.revision_date ?? null,
    };

    return { status: "success", data: metadata };
  } catch (error: unknown) {
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Request was aborted"
        : error instanceof Error
          ? `Network error: ${error.message}`
          : "Network error: Unknown error";
    return { status: "error", message };
  }
}

