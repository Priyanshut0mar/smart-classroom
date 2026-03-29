// api/thresholds.js — Vercel Serverless Function
// Threshold GET/POST — dashboard aur ESP32 dono use karte hain

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET — current thresholds fetch karo ─────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('thresholds')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      // Default values agar row nahi hai
      return res.status(200).json({ temp_limit: 30, hum_limit: 75, air_limit: 500 });
    }
    return res.status(200).json(data);
  }

  // ── POST — thresholds update karo ───────────────────────────
  if (req.method === 'POST') {
    const { temp_limit, hum_limit, air_limit } = req.body;

    const { error } = await supabase
      .from('thresholds')
      .upsert([{ id: 1, temp_limit, hum_limit, air_limit }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ status: 'ok' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
