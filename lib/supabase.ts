import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnon);

/* ─── Stars table helpers ─────────────────────────────── */

export async function saveStar(data: {
  id: string;
  name: string;
  dedicated_to: string;
  message: string;
  owner_name: string;
  ra: string;
  dec: string;
  constellation: string;
  magnitude: number;
  tx_hash: string;
  certificate_number: string;
}) {
  const { error } = await supabase.from('stars').insert([data]);
  if (error) throw new Error(`Supabase insert failed: ${error.message}`);
}

export async function getStarById(id: string) {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(`Star not found: ${error.message}`);
  return data;
}

export async function getRecentStars(limit = 20) {
  const { data, error } = await supabase
    .from('stars')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Fetch failed: ${error.message}`);
  return data ?? [];
}

/*
SQL schema (run once in Supabase dashboard):

create table stars (
  id                text primary key,
  name              text not null,
  dedicated_to      text not null,
  message           text,
  owner_name        text,
  ra                text,
  dec               text,
  constellation     text,
  magnitude         numeric,
  tx_hash           text,
  certificate_number text,
  created_at        timestamptz default now()
);
alter table stars enable row level security;
create policy "Public read" on stars for select using (true);
create policy "Anon insert" on stars for insert with check (true);
*/
