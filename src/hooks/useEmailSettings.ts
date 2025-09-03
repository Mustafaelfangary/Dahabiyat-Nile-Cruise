"use client";

import { useState, useEffect } from 'react';

interface EmailSettingsField {
  key: string;
  value?: string;
}

interface EmailSettings {
  enabled: boolean;
  adminEmail: string;
  customerNotifications: boolean;
  adminNotifications: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpFrom: string;
}

const defaultSettings: EmailSettings = {
  enabled: true,
  adminEmail: 'info@cleopatradahabiya.com',
  customerNotifications: true,
  adminNotifications: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: '',
  smtpFrom: ''
};

export function useEmailSettings() {
  const [settings, setSettings] = useState<EmailSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    try {
      const response = await fetch('/api/website-content/email-notifications');
      if (response.ok) {
        const data = await response.json();
        
        // Convert API fields to settings object
        const apiSettings: EmailSettings = {
          enabled: data.fields?.find((f: EmailSettingsField) => f.key === 'email_enabled')?.value === 'true',
          adminEmail: data.fields?.find((f: EmailSettingsField) => f.key === 'admin_email')?.value || defaultSettings.adminEmail,
          customerNotifications: data.fields?.find((f: EmailSettingsField) => f.key === 'email_customer_notifications')?.value === 'true',
          adminNotifications: data.fields?.find((f: EmailSettingsField) => f.key === 'email_admin_notifications')?.value === 'true',
          smtpHost: data.fields?.find((f: EmailSettingsField) => f.key === 'smtp_host')?.value || defaultSettings.smtpHost,
          smtpPort: data.fields?.find((f: EmailSettingsField) => f.key === 'smtp_port')?.value || defaultSettings.smtpPort,
          smtpUser: data.fields?.find((f: EmailSettingsField) => f.key === 'smtp_user')?.value || defaultSettings.smtpUser,
          smtpFrom: data.fields?.find((f: EmailSettingsField) => f.key === 'smtp_from')?.value || defaultSettings.smtpFrom
        };
        
        setSettings(apiSettings);
      }
    } catch (error) {
      console.error('Error fetching email settings:', error);
      // Use default settings on error
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchEmailSettings };
}
