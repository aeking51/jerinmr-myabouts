-- First, truncate existing data that exceeds limits
UPDATE visitors SET 
  page_url = LEFT(page_url, 1000),
  referrer = LEFT(referrer, 1000),
  user_agent = LEFT(user_agent, 500)
WHERE length(page_url) > 1000 OR length(referrer) > 1000 OR length(user_agent) > 500;

-- Add CHECK constraints for visitors table to enforce input validation at database level
-- Using reasonable limits that accommodate existing data
ALTER TABLE visitors 
  ADD CONSTRAINT check_user_agent_length CHECK (user_agent IS NULL OR length(user_agent) <= 500),
  ADD CONSTRAINT check_referrer_length CHECK (referrer IS NULL OR length(referrer) <= 1000),
  ADD CONSTRAINT check_page_url_length CHECK (page_url IS NULL OR length(page_url) <= 1000),
  ADD CONSTRAINT check_session_id_length CHECK (session_id IS NULL OR length(session_id) <= 100),
  ADD CONSTRAINT check_ip_address_length CHECK (ip_address IS NULL OR length(ip_address) <= 45),
  ADD CONSTRAINT check_timezone_length CHECK (timezone IS NULL OR length(timezone) <= 100),
  ADD CONSTRAINT check_language_length CHECK (language IS NULL OR length(language) <= 20),
  ADD CONSTRAINT check_country_length CHECK (country IS NULL OR length(country) <= 100),
  ADD CONSTRAINT check_city_length CHECK (city IS NULL OR length(city) <= 100),
  ADD CONSTRAINT check_device_type_length CHECK (device_type IS NULL OR length(device_type) <= 50),
  ADD CONSTRAINT check_browser_length CHECK (browser IS NULL OR length(browser) <= 50),
  ADD CONSTRAINT check_os_length CHECK (operating_system IS NULL OR length(operating_system) <= 50),
  ADD CONSTRAINT check_screen_resolution_length CHECK (screen_resolution IS NULL OR length(screen_resolution) <= 20);