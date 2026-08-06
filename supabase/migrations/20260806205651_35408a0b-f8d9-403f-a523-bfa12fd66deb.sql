ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS paddle_price_id_eur text,
  ADD COLUMN IF NOT EXISTS paddle_price_id_usd text;