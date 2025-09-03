"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Coins, RefreshCw, Save, Table, Crown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import TableDataEditor from '@/components/admin/TableDataEditor';

interface TableRow {
  [key: string]: unknown;
}

export default function ScheduleRatesAdminPage() {
  const { data: session, status } = useSession();
  const [scheduleData, setScheduleData] = useState<TableRow[]>([]);
  const [ratesData, setRatesData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    if (status === 'authenticated') {
      loadTableData();
    }
  }, [status]);

  const loadTableData = async () => {
    setLoading(true);
    try {
      // Load schedule data
      const scheduleResponse = await fetch('/api/website-content?key=schedule_table_json');
      if (scheduleResponse.ok) {
        const scheduleContent = await scheduleResponse.json();
        if (scheduleContent.content) {
          try {
            const parsedSchedule = JSON.parse(scheduleContent.content);
            setScheduleData(Array.isArray(parsedSchedule) ? parsedSchedule : []);
          } catch (error) {
            console.error('Error parsing schedule data:', error);
            setScheduleData([]);
          }
        }
      }

      // Load rates data
      const ratesResponse = await fetch('/api/website-content?key=rates_table_json');
      if (ratesResponse.ok) {
        const ratesContent = await ratesResponse.json();
        if (ratesContent.content) {
          try {
            const parsedRates = JSON.parse(ratesContent.content);
            setRatesData(Array.isArray(parsedRates) ? parsedRates : []);
          } catch (error) {
            console.error('Error parsing rates data:', error);
            setRatesData([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading table data:', error);
      toast.error('Failed to load table data');
    } finally {
      setLoading(false);
    }
  };

  const saveScheduleData = async (data: TableRow[]) => {
    const response = await fetch('/api/website-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'schedule_table_json',
        content: JSON.stringify(data, null, 2)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save schedule data');
    }

    setScheduleData(data);
  };

  const saveRatesData = async (data: TableRow[]) => {
    const response = await fetch('/api/website-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: 'rates_table_json',
        content: JSON.stringify(data, null, 2)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save rates data');
    }

    setRatesData(data);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-medium">Loading Schedule & Rates Editor...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-amber-600" />
            <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
            <p className="text-gray-600">Please sign in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Table className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Rates Editor</h1>
            <p className="text-gray-600">Manage sailing schedules and cruise rates with an intuitive interface</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Crown className="w-3 h-3 mr-1" />
            Admin Panel
          </Badge>
          <Button
            onClick={loadTableData}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Sailing Schedule
            <Badge variant="secondary" className="ml-1">
              {scheduleData.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Cruise Rates
            <Badge variant="secondary" className="ml-1">
              {ratesData.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Sailing Schedule Management</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Manage your dahabiya sailing schedules including itineraries, departure days, routes, and seasonal availability.
                Changes will be reflected immediately on the public schedule page.
              </p>
            </div>
            
            <TableDataEditor
              contentKey="schedule_table_json"
              title="Sailing Schedule"
              initialData={scheduleData}
              onSave={saveScheduleData}
              tableType="schedule"
            />
          </div>
        </TabsContent>

        <TabsContent value="rates" className="mt-6">
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-900">Cruise Rates Management</h3>
              </div>
              <p className="text-emerald-700 text-sm">
                Set and update cruise rates for different cabin types, seasons, and itineraries.
                Include detailed inclusions for each rate category. Changes are applied instantly.
              </p>
            </div>
            
            <TableDataEditor
              contentKey="rates_table_json"
              title="Cruise Rates"
              initialData={ratesData}
              onSave={saveRatesData}
              tableType="rates"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Save className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Quick Tips</h3>
        </div>
        <ul className="text-gray-700 text-sm space-y-1">
          <li>• Click &quot;Edit&quot; on any row to modify individual fields</li>
          <li>• Use &quot;Add Row&quot; to create new schedule entries or rate categories</li>
          <li>• For inclusions, click &quot;Add Inclusions&quot; to add multiple items</li>
          <li>• All changes are saved automatically when you click &quot;Save Changes&quot;</li>
          <li>• Changes appear immediately on the public website</li>
        </ul>
      </div>
    </div>
  );
}
