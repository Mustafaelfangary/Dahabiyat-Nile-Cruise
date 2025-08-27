"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface MobileAdminOptimizerProps {
  children: React.ReactNode;
  title?: string;
  showMobileMenu?: boolean;
  onMobileMenuToggle?: () => void;
}

export default function MobileAdminOptimizer({ 
  children, 
  title = "Admin Panel",
  showMobileMenu = false,
  onMobileMenuToggle 
}: MobileAdminOptimizerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-admin-optimizer">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="p-1.5"
            >
              {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="p-1.5">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1.5">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-3 space-y-3">
        {children}
      </div>
    </div>
  );
}

// Mobile-optimized table component
interface MobileTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
  }[];
  actions?: {
    label: string;
    onClick: (item: any) => void;
    variant?: 'default' | 'destructive' | 'outline';
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  keyField?: string;
}

export function MobileTable({ 
  data, 
  columns, 
  actions = [], 
  keyField = 'id' 
}: MobileTableProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    // Desktop table view
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b bg-gray-50">
              {columns.map((column) => (
                <th key={column.key} className="text-left py-3 px-4 font-semibold text-sm">
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item[keyField]} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="py-3 px-4 text-sm">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {actions.map((action, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant={action.variant || 'outline'}
                          onClick={() => action.onClick(item)}
                          className="text-xs"
                        >
                          {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Mobile card view
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <Card key={item[keyField]} className="border border-gray-200">
          <CardContent className="p-3">
            <div className="space-y-2">
              {columns.map((column) => (
                <div key={column.key} className="flex justify-between items-start">
                  <span className="text-xs font-medium text-gray-600 min-w-0 flex-1">
                    {column.label}:
                  </span>
                  <span className="text-xs text-gray-900 ml-2 text-right">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </span>
                </div>
              ))}
              
              {actions.length > 0 && (
                <div className="flex gap-1 pt-2 border-t border-gray-100">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant || 'outline'}
                      onClick={() => action.onClick(item)}
                      className="text-xs px-2 py-1 h-auto flex-1"
                    >
                      {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mobile-optimized form component
interface MobileFormProps {
  children: React.ReactNode;
  title?: string;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function MobileForm({ 
  children, 
  title, 
  onSubmit, 
  submitLabel = "Save", 
  cancelLabel = "Cancel",
  onCancel 
}: MobileFormProps) {
  return (
    <Card className="admin-card-mobile">
      {title && (
        <CardHeader className="admin-card-header">
          <CardTitle className="admin-card-title">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="admin-card-content">
        <form onSubmit={onSubmit} className="admin-form-mobile space-y-4">
          {children}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
            <Button 
              type="submit" 
              className="admin-form-button-mobile admin-form-button-primary"
            >
              {submitLabel}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                className="admin-form-button-mobile admin-form-button-secondary"
              >
                {cancelLabel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Mobile-optimized stats grid
interface MobileStatsProps {
  stats: {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
  }[];
}

export function MobileStats({ stats }: MobileStatsProps) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="admin-card-mobile hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                  {stat.title}
                </p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">
                  {stat.value}
                </p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded-full ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
