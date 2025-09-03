'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2,
  Crown,
  Ship,
  Calendar,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Dahabiya {
  id: string;
  name: string;
  slug: string;
  maxCapacity: number;
}

interface Itinerary {
  id: string;
  name: string;
  slug: string;
  durationDays: number;
}

interface PDFDocument {
  id: string;
  name: string;
  type: 'FACTSHEET' | 'ITINERARY' | 'BROCHURE';
  category: string;
  url: string;
  size: number;
  uploadedAt: string;
  dahabiyaId?: string;
  itineraryId?: string;
}

export default function PDFManagerPage() {
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('factsheets');
  
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'FACTSHEET' as 'FACTSHEET' | 'ITINERARY' | 'BROCHURE',
    category: '',
    dahabiyaId: '',
    itineraryId: '',
    file: null as File | null
  });

  const [dahabiyas, setDahabiyas] = useState<Dahabiya[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      loadDocuments();
      loadDahabiyas();
      loadItineraries();
    }
  }, [session]);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/admin/pdf-documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadDahabiyas = async () => {
    try {
      const response = await fetch('/api/dahabiyas');
      if (response.ok) {
        const data = await response.json();
        setDahabiyas(data);
      }
    } catch (error) {
      console.error('Error loading dahabiyas:', error);
    }
  };

  const loadItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries');
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    } catch (error) {
      console.error('Error loading itineraries:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.name) {
      toast.error('Please provide a name and select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('name', uploadForm.name);
    formData.append('type', uploadForm.type);
    formData.append('category', uploadForm.category);
    if (uploadForm.dahabiyaId) formData.append('dahabiyaId', uploadForm.dahabiyaId);
    if (uploadForm.itineraryId) formData.append('itineraryId', uploadForm.itineraryId);

    try {
      const response = await fetch('/api/admin/pdf-documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('📄 PDF uploaded successfully!');
        setUploadForm({
          name: '',
          type: 'FACTSHEET',
          category: '',
          dahabiyaId: '',
          itineraryId: '',
          file: null
        });
        loadDocuments();
      } else {
        toast.error('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Error uploading PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/admin/pdf-documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Document deleted successfully');
        loadDocuments();
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentsByType = (type: string) => {
    return documents.filter(doc => doc.type === type);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading PDF Manager...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only pharaonic administrators may access the PDF vault.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100">
      <div className="container mx-auto py-8">
        {/* Pharaonic Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-ocean-blue-600 via-navy-blue-600 to-deep-blue-700 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <Crown className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">PDF Document Manager</h1>
              <p className="text-amber-200">Manage factsheets, itineraries, and brochures</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border-2 border-amber-200">
              <TabsTrigger value="factsheets" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Ship className="w-4 h-4" />
                Factsheets
              </TabsTrigger>
              <TabsTrigger value="itineraries" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Calendar className="w-4 h-4" />
                Itineraries
              </TabsTrigger>
              <TabsTrigger value="brochures" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <FileText className="w-4 h-4" />
                Brochures
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                <Upload className="w-4 h-4" />
                Upload New
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6">
              <Card className="border-2 border-amber-300 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-ocean-blue-500 to-navy-blue-500 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Upload className="w-6 h-6" />
                    Upload New PDF Document
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleFileUpload} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-amber-800 font-semibold">Document Name *</Label>
                        <Input
                          id="name"
                          value={uploadForm.name}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Royal Cleopatra Factsheet"
                          required
                          className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-amber-800 font-semibold">Document Type *</Label>
                        <Select value={uploadForm.type} onValueChange={(value: 'FACTSHEET' | 'ITINERARY' | 'BROCHURE') => setUploadForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger className="border-2 border-amber-200 focus:border-blue-500 bg-white/80">
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FACTSHEET">Dahabiya Factsheet</SelectItem>
                            <SelectItem value="ITINERARY">Itinerary PDF</SelectItem>
                            <SelectItem value="BROCHURE">Marketing Brochure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {uploadForm.type === 'FACTSHEET' && (
                      <div>
                        <Label htmlFor="dahabiya" className="text-amber-800 font-semibold">Associated Dahabiya</Label>
                        <Select value={uploadForm.dahabiyaId} onValueChange={(value) => setUploadForm(prev => ({ ...prev, dahabiyaId: value }))}>
                          <SelectTrigger className="border-2 border-amber-200 focus:border-blue-500 bg-white/80">
                            <SelectValue placeholder="Select dahabiya" />
                          </SelectTrigger>
                          <SelectContent>
                            {dahabiyas.map((dahabiya) => (
                              <SelectItem key={dahabiya.id} value={dahabiya.id}>
                                {dahabiya.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {uploadForm.type === 'ITINERARY' && (
                      <div>
                        <Label htmlFor="itinerary" className="text-amber-800 font-semibold">Associated Itinerary</Label>
                        <Select value={uploadForm.itineraryId} onValueChange={(value) => setUploadForm(prev => ({ ...prev, itineraryId: value }))}>
                          <SelectTrigger className="border-2 border-amber-200 focus:border-blue-500 bg-white/80">
                            <SelectValue placeholder="Select itinerary" />
                          </SelectTrigger>
                          <SelectContent>
                            {itineraries.map((itinerary) => (
                              <SelectItem key={itinerary.id} value={itinerary.id}>
                                {itinerary.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="category" className="text-amber-800 font-semibold">Category</Label>
                      <Input
                        id="category"
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Luxury, Standard, Premium"
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                    </div>

                    <div>
                      <Label htmlFor="file" className="text-amber-800 font-semibold">PDF File *</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                        required
                        className="border-2 border-amber-200 focus:border-blue-500 bg-white/80"
                      />
                      <p className="text-sm text-amber-600 mt-1">Only PDF files are allowed. Max size: 10MB</p>
                    </div>

                    <Button
                      type="submit"
                      disabled={uploading}
                      className="bg-gradient-to-r from-ocean-blue-600 to-navy-blue-600 hover:from-ocean-blue-700 hover:to-navy-blue-700 text-white px-8 py-3 text-lg font-bold rounded-lg shadow-lg"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-3" />
                          Upload PDF
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
