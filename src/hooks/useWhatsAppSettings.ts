"use client";

import { useState, useEffect } from 'react';

interface WhatsAppSettingsField {
  key: string;
  value?: string;
}

interface WhatsAppSettings {
  enabled: boolean;
  phone: string;
  message: string;
  position: 'bottom-right' | 'bottom-left';
  delay: number;
  businessHours: string;
  offlineMessage: string;
}

const defaultSettings: WhatsAppSettings = {
  enabled: true,
  phone: '+201234567890',
  message: 'Hello! I\'m interested in your luxury Nile cruise packages. Could you please provide more information?',
  position: 'bottom-right',
  delay: 1,
  businessHours: 'We typically respond within 1-2 hours during business hours (9 AM - 6 PM GMT+2).',
  offlineMessage: 'Thank you for your interest! We\'ll respond to your message as soon as possible during business hours.'
};

export function useWhatsAppSettings() {
  const [settings, setSettings] = useState<WhatsAppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhatsAppSettings();
  }, []);

  const fetchWhatsAppSettings = async () => {
    try {
      const response = await fetch('/api/website-content/whatsapp-settings');
      if (response.ok) {
        const data = await response.json();
        
        // Convert API fields to settings object
        const apiSettings: WhatsAppSettings = {
          enabled: data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_enabled')?.value === 'true',
          phone: data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_phone')?.value || defaultSettings.phone,
          message: data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_message')?.value || defaultSettings.message,
          position: data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_position')?.value || defaultSettings.position,
          delay: parseInt(data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_delay')?.value || '1'),
          businessHours: data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_business_hours')?.value || defaultSettings.businessHours,
          offlineMessage: data.fields?.find((f: WhatsAppSettingsField) => f.key === 'whatsapp_offline_message')?.value || defaultSettings.offlineMessage
        };
        
        setSettings(apiSettings);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp settings:', error);
      // Use default settings on error
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchWhatsAppSettings };
}
