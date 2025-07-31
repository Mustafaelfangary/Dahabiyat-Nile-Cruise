'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Divider
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface Setting {
  key: string;
  value: string;
  group: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group]?.push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const groups = Object.keys(groupedSettings).sort();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        
        // Convert object format to array format if needed
        if (Array.isArray(data)) {
          setSettings(data);
        } else if (data && typeof data === 'object') {
          const settingsArray = Object.entries(data).map(([key, value]) => ({
            key,
            value: String(value),
            group: 'general' // Default group
          }));
          setSettings(settingsArray);
        }
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      // Save each setting
      for (const setting of settings) {
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: setting.key,
            value: setting.value,
            group: setting.group
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${setting.key}`);
        }
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        🔧 System Settings
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your website settings including site information and configuration options.
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="settings tabs">
            {groups.map((group, index) => (
              <Tab 
                key={group} 
                label={group.charAt(0).toUpperCase() + group.slice(1)} 
                id={`settings-tab-${index}`}
                aria-controls={`settings-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {groups.map((group, index) => (
          <TabPanel key={group} value={tabValue} index={index}>
            <Typography variant="h6" gutterBottom>
              {group.charAt(0).toUpperCase() + group.slice(1)} Settings
            </Typography>
            
            <Grid container spacing={3}>
              {groupedSettings[group]?.map((setting) => (
                <Grid item xs={12} md={6} key={setting.key}>
                  <TextField
                    fullWidth
                    label={setting.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    variant="outlined"
                    multiline={setting.value.length > 50}
                    rows={setting.value.length > 50 ? 3 : 1}
                    helperText={
                      setting.key === 'site_name' ? 'The name of your website' :
                      `Current value for ${setting.key}`
                    }
                  />
                </Grid>
              ))}
            </Grid>


          </TabPanel>
        ))}
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSettings}
          disabled={saving}
        >
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </Box>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          🎯 Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Website Configuration:</strong> Use these settings to configure your website's basic information and behavior.
        </Typography>
      </Box>
    </Container>
  );
}
