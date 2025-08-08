-- Create visitors table to log site visitor details
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  screen_resolution TEXT,
  timezone TEXT,
  language TEXT,
  referrer TEXT,
  page_url TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  is_mobile BOOLEAN DEFAULT false,
  country TEXT,
  city TEXT
);

-- Enable Row Level Security
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert visitor data (for tracking)
CREATE POLICY "Allow visitor logging" 
ON public.visitors 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading visitor data (for admin page)
CREATE POLICY "Allow reading visitor data" 
ON public.visitors 
FOR SELECT 
USING (true);

-- Create index for better performance on common queries
CREATE INDEX idx_visitors_visited_at ON public.visitors(visited_at DESC);
CREATE INDEX idx_visitors_ip_address ON public.visitors(ip_address);
CREATE INDEX idx_visitors_device_type ON public.visitors(device_type);