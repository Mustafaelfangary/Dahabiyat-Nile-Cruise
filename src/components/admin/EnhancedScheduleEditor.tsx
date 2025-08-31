'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Edit2, Ship, Calendar, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ScheduleRow {
  id?: string;
  dahabiyaName?: string;
  destination?: string;
  routes?: string;
  itinerary?: string;
  day?: string;
  date?: string;
  minPrice?: string;
}

interface EnhancedScheduleEditorProps {
  contentKey: string;
  title: string;
  initialData: ScheduleRow[];
  onSave: (data: ScheduleRow[]) => Promise<void>;
}

const SCHEDULE_COLUMNS = [
  { key: 'dahabiyaName', label: 'Dahabiya Name', type: 'select', required: true, icon: '𓊪' },
  { key: 'destination', label: 'Destination', type: 'text', required: true, icon: '𓈖' },
  { key: 'routes', label: 'Routes', type: 'text', required: true, icon: '𓇳' },
  { key: 'itinerary', label: 'Itinerary', type: 'select', required: true, icon: '𓊃' },
  { key: 'day', label: 'Day', type: 'text', required: true, icon: '𓊨' },
  { key: 'date', label: 'Date', type: 'date', required: true, icon: '𓊽' },
  { key: 'minPrice', label: 'Min Price', type: 'number', required: true, icon: '𓋹' }
];

const SAMPLE_DAHABIYAS = [
  'Cleopatra Royal',
  'Nefertiti Luxury',
  'Pharaoh\'s Dream',
  'Golden Nile',
  'Royal Isis',
  'Hatshepsut Elite',
  'Ramses Glory'
];

const SAMPLE_ITINERARIES = [
  '7 Days Pharaonic Journey',
  '5 Days Luxor to Aswan',
  '4 Days Aswan to Luxor',
  '10 Days Grand Nile Tour',
  '3 Days Short Cruise',
  '14 Days Ultimate Experience'
];

export default function EnhancedScheduleEditor({ contentKey, title, initialData, onSave }: EnhancedScheduleEditorProps) {
  const [data, setData] = useState<ScheduleRow[]>(initialData || []);
  const [editingHeaders, setEditingHeaders] = useState(false);
  const [headers, setHeaders] = useState(SCHEDULE_COLUMNS.map(col => col.label));
  const [saving, setSaving] = useState(false);
  const [dahabiyas, setDahabiyas] = useState<string[]>(SAMPLE_DAHABIYAS);
  const [itineraries, setItineraries] = useState<string[]>(SAMPLE_ITINERARIES);

  useEffect(() => {
    // Fetch actual dahabiyas from API
    fetchDahabiyas();
  }, []);

  const fetchDahabiyas = async () => {
    try {
      const response = await fetch('/api/dahabiyas');
      if (response.ok) {
        const dahabiyasData = await response.json();
        const names = dahabiyasData.map((d: any) => d.name);
        setDahabiyas([...SAMPLE_DAHABIYAS, ...names]);
      }
    } catch (error) {
      console.error('Error fetching dahabiyas:', error);
    }
  };

  const addRow = () => {
    const newRow: ScheduleRow = {
      id: Date.now().toString(),
      dahabiyaName: '',
      destination: '',
      routes: '',
      itinerary: '',
      day: '',
      date: '',
      minPrice: ''
    };
    setData([...data, newRow]);
  };

  const removeRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const updateCell = (rowIndex: number, field: keyof ScheduleRow, value: string) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setData(newData);
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
      toast.success('Schedule saved successfully!');
    } catch (error) {
      toast.error('Failed to save schedule');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderCell = (row: ScheduleRow, column: typeof SCHEDULE_COLUMNS[0], rowIndex: number) => {
    const value = row[column.key as keyof ScheduleRow] || '';
    
    if (column.type === 'select' && column.key === 'dahabiyaName') {
      return (
        <select
          value={value}
          onChange={(e) => updateCell(rowIndex, column.key as keyof ScheduleRow, e.target.value)}
          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-800 font-semibold"
        >
          <option value="">Select Dahabiya</option>
          {dahabiyas.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      );
    }
    
    if (column.type === 'select' && column.key === 'itinerary') {
      return (
        <select
          value={value}
          onChange={(e) => updateCell(rowIndex, column.key as keyof ScheduleRow, e.target.value)}
          className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-800 font-semibold"
        >
          <option value="">Select Itinerary</option>
          {itineraries.map((itinerary) => (
            <option key={itinerary} value={itinerary}>{itinerary}</option>
          ))}
        </select>
      );
    }
    
    return (
      <Input
        type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'}
        value={value}
        onChange={(e) => updateCell(rowIndex, column.key as keyof ScheduleRow, e.target.value)}
        className="border-amber-300 focus:ring-amber-500 focus:border-amber-500"
        placeholder={`Enter ${column.label.toLowerCase()}`}
      />
    );
  };

  return (
    <Card className="w-full shadow-2xl border-4 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardHeader className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-b-4 border-amber-300">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-amber-900 flex items-center">
            <Ship className="w-6 h-6 mr-3 text-amber-700" />
            <span className="mr-2 text-2xl">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
            {title}
            <span className="ml-2 text-2xl">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setEditingHeaders(!editingHeaders)}
              variant="outline"
              size="sm"
              className="border-amber-400 text-amber-700 hover:bg-amber-100"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Edit Headers
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white"
            >
              <Save className="w-4 h-4 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="overflow-x-auto rounded-2xl shadow-xl">
          <table className="min-w-full bg-white rounded-2xl overflow-hidden border-4 border-amber-300">
            <thead className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 border-b-4 border-amber-400">
              <tr>
                {SCHEDULE_COLUMNS.map((column, index) => (
                  <th key={column.key} className="px-4 py-4 text-left border-r-2 border-amber-300 last:border-r-0">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xl text-amber-700">{column.icon}</span>
                      {editingHeaders ? (
                        <Input
                          value={headers[index]}
                          onChange={(e) => updateHeader(index, e.target.value)}
                          className="text-sm font-bold text-amber-900 bg-white border-amber-400"
                        />
                      ) : (
                        <span className="text-sm font-bold text-amber-900 uppercase tracking-wider">
                          {headers[index]}
                        </span>
                      )}
                      <span className="text-xl text-amber-700">{column.icon}</span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-4 text-center">
                  <span className="text-sm font-bold text-amber-900 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gradient-to-b from-white via-amber-50/20 to-yellow-50/30 divide-y-2 divide-amber-200">
              {data.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-gradient-to-r hover:from-amber-100 hover:to-yellow-100 transition-all duration-300">
                  {SCHEDULE_COLUMNS.map((column) => (
                    <td key={column.key} className="px-4 py-4 border-r-2 border-amber-200 last:border-r-0">
                      {renderCell(row, column, rowIndex)}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center">
                    <Button
                      onClick={() => removeRow(rowIndex)}
                      variant="outline"
                      size="sm"
                      className="border-red-400 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <Button
            onClick={addRow}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Schedule Entry
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-amber-400 text-amber-700">
              <Calendar className="w-3 h-3 mr-1" />
              {data.length} Entries
            </Badge>
            <Badge variant="outline" className="border-emerald-400 text-emerald-700">
              <MapPin className="w-3 h-3 mr-1" />
              Royal Fleet Schedule
            </Badge>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-amber-200 to-yellow-200 px-6 py-3 rounded-full shadow-lg">
            <span className="text-2xl text-amber-700">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
            <span className="text-amber-900 font-bold">Manage Your Royal Fleet Schedule</span>
            <span className="text-2xl text-amber-700">𓈎𓃭𓇋𓍯𓊪𓄿𓂧𓂋𓄿</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
