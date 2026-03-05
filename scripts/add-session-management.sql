-- Add single-session enforcement to admin_users table
-- This prevents the same account from being logged in on multiple devices

-- Add session tracking columns
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS current_session_token TEXT,
ADD COLUMN IF NOT EXISTS session_created_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS session_ip_address TEXT,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;

-- Add index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_session_token ON admin_users(current_session_token);

-- Add comment for documentation
COMMENT ON COLUMN admin_users.current_session_token IS 'Active JWT token - only one session allowed per admin';
COMMENT ON COLUMN admin_users.session_created_at IS 'When the current session was created';
COMMENT ON COLUMN admin_users.session_ip_address IS 'IP address of current session for security audit';
COMMENT ON COLUMN admin_users.failed_login_attempts IS 'Counter for failed login attempts';
COMMENT ON COLUMN admin_users.locked_until IS 'Account temporarily locked until this timestamp';
