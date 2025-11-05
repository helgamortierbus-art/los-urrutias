import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { start, end, name, email, message } = req.body;

  if (!start || !end || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const nights = Math.max(0, Math.round((new Date(end) - new Date(start)) / (24*60*60*1000)));
  const price = 80;
  const total = nights * price;

  try {
    const { data, error } = await supabase.rpc('insert_booking_if_available', {
      p_start: start,
      p_end: end,
      p_nights: nights,
      p_price: price,
      p_total: total,
      p_name: name,
      p_email: email,
      p_message: message || ''
    });

    if (error) {
      return res.status(400).json({ error: error.message || 'Could not create booking' });
    }

    return res.status(200).json({ id: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
