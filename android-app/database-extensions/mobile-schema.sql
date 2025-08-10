-- Mobile App Database Extensions
-- Add these tables and columns to your existing PostgreSQL database

-- ============================================================================
-- USER DEVICE MANAGEMENT
-- ============================================================================

-- Table for managing user devices and push notification tokens
CREATE TABLE IF NOT EXISTS user_devices (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token VARCHAR(500) NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios')),
    app_version VARCHAR(20),
    device_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    UNIQUE(user_id, device_token),
    INDEX idx_user_devices_user_id (user_id),
    INDEX idx_user_devices_platform (platform),
    INDEX idx_user_devices_active (is_active)
);

-- ============================================================================
-- MOBILE ANALYTICS
-- ============================================================================

-- Table for tracking mobile app events and analytics
CREATE TABLE IF NOT EXISTS mobile_analytics (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    screen_name VARCHAR(100),
    app_version VARCHAR(20),
    platform VARCHAR(20),
    device_info JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for analytics queries
    INDEX idx_mobile_analytics_user_id (user_id),
    INDEX idx_mobile_analytics_event_type (event_type),
    INDEX idx_mobile_analytics_created_at (created_at),
    INDEX idx_mobile_analytics_session_id (session_id)
);

-- ============================================================================
-- PUSH NOTIFICATIONS
-- ============================================================================

-- Table for push notification history and tracking
CREATE TABLE IF NOT EXISTS push_notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    target_type VARCHAR(50) DEFAULT 'all', -- 'all', 'user', 'segment'
    target_criteria JSONB DEFAULT '{}',
    recipient_count INTEGER DEFAULT 0,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
    created_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_push_notifications_sent_at (sent_at),
    INDEX idx_push_notifications_status (status),
    INDEX idx_push_notifications_target_type (target_type)
);

-- Table for individual notification deliveries
CREATE TABLE IF NOT EXISTS notification_deliveries (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER NOT NULL REFERENCES push_notifications(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token VARCHAR(500) NOT NULL,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'failed')),
    error_message TEXT,
    
    -- Indexes
    INDEX idx_notification_deliveries_notification_id (notification_id),
    INDEX idx_notification_deliveries_user_id (user_id),
    INDEX idx_notification_deliveries_status (status)
);

-- ============================================================================
-- MOBILE APP CONFIGURATION
-- ============================================================================

-- Table for mobile app configuration settings
CREATE TABLE IF NOT EXISTS mobile_app_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_mobile_app_config_key (config_key),
    INDEX idx_mobile_app_config_active (is_active)
);

-- Insert default mobile app configuration
INSERT INTO mobile_app_config (config_key, config_value, description) VALUES
('app_version', '"1.0.0"', 'Current mobile app version'),
('min_app_version', '"1.0.0"', 'Minimum required app version'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
('force_update', 'false', 'Force users to update the app'),
('features', '{"biometricAuth": true, "offlineMode": true, "pushNotifications": true}', 'Available app features'),
('support_info', '{"email": "support@dahabiyatnilecruise.com", "phone": "+201200958713"}', 'Support contact information')
ON CONFLICT (config_key) DO NOTHING;

-- ============================================================================
-- OFFLINE CONTENT CACHE
-- ============================================================================

-- Table for managing offline content versions
CREATE TABLE IF NOT EXISTS offline_content_cache (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL, -- 'dahabiyas', 'packages', 'gallery', etc.
    content_data JSONB NOT NULL,
    version_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Indexes
    INDEX idx_offline_content_type (content_type),
    INDEX idx_offline_content_created_at (created_at)
);

-- ============================================================================
-- USER PREFERENCES EXTENSIONS
-- ============================================================================

-- Add mobile-specific columns to existing users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS mobile_preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_mobile_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS mobile_onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS biometric_enabled BOOLEAN DEFAULT false;

-- Update existing users with default mobile preferences
UPDATE users 
SET mobile_preferences = '{
    "notifications": {
        "bookingUpdates": true,
        "promotions": true,
        "pushNotifications": true
    },
    "theme": "system",
    "language": "en",
    "currency": "USD"
}'
WHERE mobile_preferences = '{}' OR mobile_preferences IS NULL;

-- ============================================================================
-- BOOKING EXTENSIONS FOR MOBILE
-- ============================================================================

-- Add mobile-specific columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS created_via VARCHAR(20) DEFAULT 'web' CHECK (created_via IN ('web', 'mobile')),
ADD COLUMN IF NOT EXISTS mobile_device_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS push_notifications_sent JSONB DEFAULT '[]';

-- ============================================================================
-- MOBILE SESSION TRACKING
-- ============================================================================

-- Table for tracking mobile app sessions
CREATE TABLE IF NOT EXISTS mobile_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    device_token VARCHAR(500),
    app_version VARCHAR(20),
    platform VARCHAR(20),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    screens_visited JSONB DEFAULT '[]',
    actions_performed JSONB DEFAULT '[]',
    
    -- Indexes
    INDEX idx_mobile_sessions_user_id (user_id),
    INDEX idx_mobile_sessions_started_at (started_at),
    INDEX idx_mobile_sessions_session_id (session_id)
);

-- ============================================================================
-- MOBILE CRASH REPORTS
-- ============================================================================

-- Table for mobile app crash reports
CREATE TABLE IF NOT EXISTS mobile_crash_reports (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    app_version VARCHAR(20) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    device_info JSONB DEFAULT '{}',
    crash_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    screen_name VARCHAR(100),
    user_actions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'ignored')),
    
    -- Indexes
    INDEX idx_mobile_crash_reports_created_at (created_at),
    INDEX idx_mobile_crash_reports_app_version (app_version),
    INDEX idx_mobile_crash_reports_status (status)
);

-- ============================================================================
-- MOBILE FEATURE FLAGS
-- ============================================================================

-- Table for managing mobile feature flags
CREATE TABLE IF NOT EXISTS mobile_feature_flags (
    id SERIAL PRIMARY KEY,
    feature_name VARCHAR(100) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    target_criteria JSONB DEFAULT '{}', -- User segments, app versions, etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Index
    INDEX idx_mobile_feature_flags_enabled (is_enabled),
    INDEX idx_mobile_feature_flags_name (feature_name)
);

-- Insert default feature flags
INSERT INTO mobile_feature_flags (feature_name, is_enabled, rollout_percentage, description) VALUES
('biometric_authentication', true, 100, 'Enable biometric authentication'),
('offline_mode', true, 100, 'Enable offline content caching'),
('push_notifications', true, 100, 'Enable push notifications'),
('social_sharing', true, 100, 'Enable social media sharing'),
('maps_integration', true, 100, 'Enable Google Maps integration'),
('dark_theme', true, 100, 'Enable dark theme support'),
('multi_language', true, 100, 'Enable multi-language support')
ON CONFLICT (feature_name) DO NOTHING;

-- ============================================================================
-- MOBILE FEEDBACK AND RATINGS
-- ============================================================================

-- Table for mobile app feedback and ratings
CREATE TABLE IF NOT EXISTS mobile_app_feedback (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    feedback_type VARCHAR(50) DEFAULT 'general', -- 'bug', 'feature_request', 'general'
    app_version VARCHAR(20),
    platform VARCHAR(20),
    screen_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'closed')),
    admin_response TEXT,
    responded_at TIMESTAMP,
    responded_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes
    INDEX idx_mobile_app_feedback_user_id (user_id),
    INDEX idx_mobile_app_feedback_rating (rating),
    INDEX idx_mobile_app_feedback_created_at (created_at),
    INDEX idx_mobile_app_feedback_status (status)
);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_devices_updated_at 
    BEFORE UPDATE ON user_devices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobile_app_config_updated_at 
    BEFORE UPDATE ON mobile_app_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobile_feature_flags_updated_at 
    BEFORE UPDATE ON mobile_feature_flags 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR MOBILE ANALYTICS
-- ============================================================================

-- View for mobile user statistics
CREATE OR REPLACE VIEW mobile_user_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at as user_created_at,
    u.last_mobile_login,
    COUNT(DISTINCT ud.id) as device_count,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.created_via = 'mobile' THEN b.id END) as mobile_bookings,
    MAX(ud.updated_at) as last_device_activity,
    STRING_AGG(DISTINCT ud.platform, ', ') as platforms_used
FROM users u
LEFT JOIN user_devices ud ON u.id = ud.user_id AND ud.is_active = true
LEFT JOIN bookings b ON u.id = b.user_id
GROUP BY u.id, u.name, u.email, u.created_at, u.last_mobile_login;

-- View for daily mobile analytics
CREATE OR REPLACE VIEW daily_mobile_analytics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(CASE WHEN event_type = 'screen_view' THEN 1 END) as screen_views,
    COUNT(CASE WHEN event_type = 'booking_started' THEN 1 END) as booking_attempts,
    COUNT(CASE WHEN event_type = 'booking_completed' THEN 1 END) as booking_completions
FROM mobile_analytics
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_last_mobile_login ON users(last_mobile_login);
CREATE INDEX IF NOT EXISTS idx_users_mobile_onboarding ON users(mobile_onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_bookings_created_via ON bookings(created_via);
CREATE INDEX IF NOT EXISTS idx_bookings_mobile_created_at ON bookings(created_at) WHERE created_via = 'mobile';

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

-- Insert sample mobile app configuration (for testing)
-- INSERT INTO mobile_app_config (config_key, config_value, description) VALUES
-- ('test_mode', 'true', 'Enable test mode for development'),
-- ('debug_logging', 'true', 'Enable debug logging'),
-- ('api_timeout', '30', 'API request timeout in seconds')
-- ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- ============================================================================
-- CLEANUP AND MAINTENANCE
-- ============================================================================

-- Function to clean up old analytics data (run monthly)
CREATE OR REPLACE FUNCTION cleanup_old_mobile_data()
RETURNS void AS $$
BEGIN
    -- Delete analytics data older than 6 months
    DELETE FROM mobile_analytics 
    WHERE created_at < CURRENT_DATE - INTERVAL '6 months';
    
    -- Delete old session data older than 3 months
    DELETE FROM mobile_sessions 
    WHERE started_at < CURRENT_DATE - INTERVAL '3 months';
    
    -- Delete resolved crash reports older than 1 year
    DELETE FROM mobile_crash_reports 
    WHERE status = 'resolved' AND created_at < CURRENT_DATE - INTERVAL '1 year';
    
    -- Delete old notification deliveries older than 3 months
    DELETE FROM notification_deliveries 
    WHERE delivered_at < CURRENT_DATE - INTERVAL '3 months';
    
    RAISE NOTICE 'Mobile data cleanup completed';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (you can set this up as a cron job)
-- SELECT cleanup_old_mobile_data();
