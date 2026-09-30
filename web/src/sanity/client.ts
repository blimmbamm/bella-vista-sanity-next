import { createClient } from "next-sanity";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "../environment";

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2026-02-18",
  useCdn: false,
});