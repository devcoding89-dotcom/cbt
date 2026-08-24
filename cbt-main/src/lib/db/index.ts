import "server-only";
import type { Repo } from "./repo";
import { localRepo } from "./local";

export const usingSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

let repoRef: Repo = localRepo;

if (usingSupabase) {
  // Lazy require so the local build never needs the supabase env vars.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { supabaseRepo } = require("./supabase") as typeof import("./supabase");
  repoRef = supabaseRepo;
}

export const repo: Repo = repoRef;
export * from "./repo";
