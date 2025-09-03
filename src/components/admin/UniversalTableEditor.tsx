"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit3, Save, X, Table, Type, Hash, Calendar, List } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TableRow {
  [key: string]: unknown;
}

interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'array' | 'email' | 'url';
  required?: boolean;
}

interface UniversalTableEditorProps {
  contentKey: string;
  title: string;
  initialData: TableRow[];
  onSave: (data: TableRow[]) => Promise<void>;
  predefinedColumns?: TableColumn[];
}

export default function UniversalTableEditor({ 
  contentKey, 
  title, 
  initialData, 
  onSave,
  predefinedColumns 
}: UniversalTableEditorProps) {
  const [tableData, setTableData] = useState<TableRow[]>(initialData);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingHeaders, setEditingHeaders] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Auto-detect columns from data or use predefined
  useEffect(() => {
    console.log('UniversalTableEditor - initialData:', initialData);
    console.log('UniversalTableEditor - predefinedColumns:', predefinedColumns);
    
    if (predefinedColumns && predefinedColumns.length > 0) {
      console.log('Using predefined columns');
      setColumns(predefinedColumns);
    } else if (initialData.length > 0) {
      // Auto-detect columns from first row
      const firstRow = initialData[0];
      if (firstRow) {
        console.log('Auto-detecting columns from first row:', firstRow);
        const detectedColumns: TableColumn[] = Object.keys(firstRow).map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          type: detectColumnType(firstRow[key]),
          required: false
        }));
        console.log('Detected columns:', detectedColumns);
        setColumns(detectedColumns);
      }
    } else {
      // Default empty structure
      console.log('Using default empty structure');
      setColumns([
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'value', label: 'Value', type: 'text', required: false }
      ]);
    }
  }, [initialData, predefinedColumns]);

  useEffect(() => {
    setTableData(initialData);
    setHasChanges(false);
  }, [initialData]);

  const detectColumnType = (value: unknown): 'text' | 'number' | 'date' | 'array' => {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('-')) return 'date';
    return 'text';
  };

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

  const addNewColumn = () => {
    const newColumn: TableColumn = {
      key: `column_${Date.now()}`,
      label: 'New Column',
      type: 'text',
      required: false
    };
    setColumns([...columns, newColumn]);
    setHasChanges(true);
  };

  const updateColumn = (index: number, updates: Partial<TableColumn>) => {
    const newColumns = [...columns];
    const existingColumn = newColumns[index];
    if (existingColumn) {
      newColumns[index] = { ...existingColumn, ...updates };
      setColumns(newColumns);
      setHasChanges(true);
    }
  };

  const deleteColumn = (index: number) => {
    const columnToDelete = columns[index];
    if (columnToDelete) {
      const newColumns = columns.filter((_, i) => i !== index);
      const newData = tableData.map(row => {
        const { [columnToDelete.key]: deleted, ...rest } = row;
        return rest;
      });
      
      setColumns(newColumns);
      setTableData(newData);
      setHasChanges(true);
    }
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
      console.log('Saving table data:', tableData);
      await onSave(tableData);
      setHasChanges(false);
      setEditingRow(null);
      setEditingHeaders(false);
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
    setEditingHeaders(false);
    setHasChanges(false);
  };

  const getColumnIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash className="w-3 h-3" />;
      case 'date': return <Calendar className="w-3 h-3" />;
      case 'array': return <List className="w-3 h-3" />;
      default: return <Type className="w-3 h-3" />;
    }
  };

  const renderCellEditor = (row: TableRow, column: TableColumn, rowIndex: number) => {
    if (column.type === 'array') {
      const arrayValue = Array.isArray(row[column.key]) ? row[column.key] as string[] : [];
      return (
        <div className="space-y-1">
          {arrayValue.map((item: string, idx: number) => (
            <div key={idx} className="flex items-center gap-1">
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
                  const newArray = arrayValue.filter((_, i: number) => i !== idx);
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
        type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : column.type === 'email' ? 'email' : column.type === 'url' ? 'url' : 'text'}
        value={String(row[column.key] || '')}
        onChange={(e) => {
          let value: unknown = e.target.value;
          if (column.type === 'number') {
            value = parseInt(e.target.value) || 0;
          }
          updateRowField(rowIndex, column.key, value);
        }}
        className="text-sm min-w-[150px]"
        placeholder={column.label}
        required={column.required}
      />
    );
  };

  const renderCellDisplay = (row: TableRow, column: TableColumn) => {
    if (column.type === 'array') {
      const arrayValue = Array.isArray(row[column.key]) ? row[column.key] as string[] : [];
      if (arrayValue.length === 0) {
        return <span className="text-gray-400 italic">Empty list</span>;
      }
      return (
        <div className="space-y-1">
          {arrayValue.map((item: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      );
    }

    const value = row[column.key];
    if (!value && value !== 0) return <span className="text-gray-400 text-sm">-</span>;
    
    return <span className="text-sm">{String(value)}</span>;
  };

  const renderHeaderEditor = (column: TableColumn, index: number) => {
    return (
      <div className="space-y-2 p-2 bg-gray-50 rounded">
        <Input
          value={column.label}
          onChange={(e) => updateColumn(index, { label: e.target.value })}
          className="text-sm font-medium"
          placeholder="Column Label"
        />
        <select
          value={column.type}
          onChange={(e) => updateColumn(index, { type: e.target.value as 'text' | 'number' | 'date' | 'array' | 'email' | 'url' })}
          className="w-full text-sm border rounded px-2 py-1"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="email">Email</option>
          <option value="url">URL</option>
          <option value="array">List</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={column.required || false}
            onChange={(e) => updateColumn(index, { required: e.target.checked })}
            className="text-sm"
          />
          <label className="text-xs text-gray-600">Required</label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => deleteColumn(index)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600" />
            {title}
            <Badge variant="outline" className="ml-2">
              {tableData.length} rows × {columns.length} columns
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
              onClick={() => setEditingHeaders(!editingHeaders)}
              size="sm"
              variant="outline"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {editingHeaders ? 'Done' : 'Edit Headers'}
            </Button>
            <Button
              onClick={addNewColumn}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Column
            </Button>
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
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200 min-w-[150px]"
                  >
                    {editingHeaders ? (
                      renderHeaderEditor(column, index)
                    ) : (
                      <div className="flex items-center gap-2">
                        {getColumnIcon(column.type)}
                        {column.label}
                        {column.required && <span className="text-red-500 ml-1">*</span>}
                      </div>
                    )}
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
              <p className="text-sm">Click &ldquo;Add Row&rdquo; to start adding data</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
