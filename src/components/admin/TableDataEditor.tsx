"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Save, X, Table } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TableRow {
  [key: string]: unknown;
}

interface TableDataEditorProps {
  contentKey: string;
  title: string;
  initialData: TableRow[];
  onSave: (data: TableRow[]) => Promise<void>;
  tableType: 'schedule' | 'rates';
}

const SCHEDULE_COLUMNS = [
  { key: 'itinerary', label: 'Itinerary', type: 'text', required: true },
  { key: 'nights', label: 'Nights', type: 'number', required: true },
  { key: 'departureDay', label: 'Departure Day', type: 'text', required: true },
  { key: 'route', label: 'Route', type: 'text', required: true },
  { key: 'season', label: 'Season', type: 'text', required: true },
  { key: 'dates', label: 'Dates', type: 'text', required: true }
];

const RATES_COLUMNS = [
  { key: 'itinerary', label: 'Itinerary', type: 'text', required: true },
  { key: 'nights', label: 'Nights', type: 'number', required: true },
  { key: 'cabinType', label: 'Cabin/Suite', type: 'text', required: true },
  { key: 'season', label: 'Season', type: 'text', required: true },
  { key: 'pricePerPerson', label: 'Rate', type: 'text', required: true },
  { key: 'inclusions', label: 'Inclusions', type: 'array', required: false }
];

export default function TableDataEditor({ 
  contentKey, 
  title, 
  initialData, 
  onSave, 
  tableType 
}: TableDataEditorProps) {
  const [tableData, setTableData] = useState<TableRow[]>(initialData);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const columns = tableType === 'schedule' ? SCHEDULE_COLUMNS : RATES_COLUMNS;

  useEffect(() => {
    setTableData(initialData);
    setHasChanges(false);
  }, [initialData]);

  const addNewRow = () => {
    const newRow: TableRow = {};
    columns.forEach(col => {
      if (col.type === 'array') {
        newRow[col.key] = [];
      } else if (col.type === 'number') {
        newRow[col.key] = 0;
      } else {
        newRow[col.key] = '';
      }
    });
    
    setTableData([...tableData, newRow]);
    setEditingRow(tableData.length);
    setHasChanges(true);
  };

  const deleteRow = (index: number) => {
    const newData = tableData.filter((_, i) => i !== index);
    setTableData(newData);
    setHasChanges(true);
    if (editingRow === index) {
      setEditingRow(null);
    }
  };

  const updateRowField = (rowIndex: number, field: string, value: unknown) => {
    const newData = [...tableData];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setTableData(newData);
    setHasChanges(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await onSave(tableData);
      setHasChanges(false);
      setEditingRow(null);
      toast.success(`${title} updated successfully`);
    } catch (error) {
      console.error('Error saving table data:', error);
      toast.error(`Failed to update ${title}`);
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setTableData(initialData);
    setEditingRow(null);
    setHasChanges(false);
  };

  const renderCellEditor = (row: TableRow, column: { key: string; type: string; label: string; required?: boolean }, rowIndex: number) => {
    if (column.type === 'array') {
      const arrayValue = Array.isArray(row[column.key]) ? row[column.key] as string[] : [];
      return (
        <div className="space-y-2">
          {arrayValue.map((item: string, idx: number) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newArray = [...arrayValue];
                  newArray[idx] = e.target.value;
                  updateRowField(rowIndex, column.key, newArray);
                }}
                className="text-sm"
                placeholder={`${column.label} item ${idx + 1}`}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newArray = arrayValue.filter((_: unknown, i: number) => i !== idx);
                  updateRowField(rowIndex, column.key, newArray);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const newArray = [...arrayValue, ''];
              updateRowField(rowIndex, column.key, newArray);
            }}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      );
    }

    return (
      <Input
        type={column.type === 'number' ? 'number' : 'text'}
        value={String(row[column.key] || '')}
        onChange={(e) => {
          const value = column.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
          updateRowField(rowIndex, column.key, value);
        }}
        className="text-sm"
        placeholder={column.label}
        required={column.required}
      />
    );
  };

  const renderCellDisplay = (row: TableRow, column: { key: string; type: string; label: string }) => {
    if (column.type === 'array') {
      const arrayValue = Array.isArray(row[column.key]) ? row[column.key] as string[] : [];
      return (
        <ul className="list-disc list-inside space-y-1">
          {arrayValue.map((item: string, idx: number) => (
            <li key={idx} className="text-sm">{item}</li>
          ))}
        </ul>
      );
    }
    return <span className="text-sm">{String(row[column.key] || '')}</span>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600" />
            {title}
            <Badge variant="outline" className="ml-2">
              {tableData.length} rows
            </Badge>
          </CardTitle>
          <div className="flex gap-2">
            {hasChanges && (
              <>
                <Button
                  onClick={cancelEditing}
                  variant="outline"
                  size="sm"
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={saveChanges}
                  size="sm"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
            <Button
              onClick={addNewRow}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Row
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200"
                  >
                    {column.label}
                    {column.required && <span className="text-red-500 ml-1">*</span>}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 border-b border-gray-100">
                      {editingRow === rowIndex ? (
                        renderCellEditor(row, column, rowIndex)
                      ) : (
                        renderCellDisplay(row, column)
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 border-b border-gray-100 text-center">
                    <div className="flex justify-center gap-1">
                      {editingRow === rowIndex ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRow(null)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRow(rowIndex)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tableData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Table className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No data yet</p>
              <p className="text-sm">Click &ldquo;Add Row&rdquo; to start adding {tableType} data</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
