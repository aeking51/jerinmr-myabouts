-- Add indexes on frequently queried columns in visitors table
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON public.visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON public.visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_device_type ON public.visitors(device_type);

-- Optional: Add a composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_visitors_country_visited_at ON public.visitors(country, visited_at DESC);