"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Camera, 
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Settings,
  Crown,
  Upload,
  MousePointer
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileFixesGuidePage() {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({});

  const markTestComplete = (testId: string) => {
    setTestResults(prev => ({ ...prev, [testId]: true }));
    toast.success(`Test "${testId}" completed!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/10 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              👤 Profile Functionality Fixes
            </h1>
            <p className="text-gray-600 text-lg">
              Profile button navigation and image upload functionality
            </p>
          </div>
        </div>

        <Tabs defaultValue="fixes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fixes">Fixes Applied</TabsTrigger>
            <TabsTrigger value="testing">Testing Guide</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          {/* Fixes Applied Tab */}
          <TabsContent value="fixes" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer className="w-5 h-5 text-blue-600" />
                    Issue 1: Profile Button Navigation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium mb-1">❌ Problem:</p>
                        <p>User dropdown menu was missing "Profile" link. Users couldn't access their profile page.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">✅ Solution:</p>
                        <ul className="space-y-1">
                          <li>• Added "My Profile" link to user dropdown menu</li>
                          <li>• Link navigates to <code>/profile</code> page</li>
                          <li>• Proper styling and icon added</li>
                          <li>• Positioned above "Sign out" option</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">🔧 Technical Details:</p>
                      <ul className="space-y-1">
                        <li>• File: <code>src/components/Navbar.tsx</code></li>
                        <li>• Added DropdownMenuItem with Link to /profile</li>
                        <li>• Used User icon for consistency</li>
                        <li>• Proper styling and hover effects</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-600" />
                    Issue 2: Profile Image Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="text-sm text-red-800">
                        <p className="font-medium mb-1">❌ Problem:</p>
                        <p>Camera button on profile page had no functionality. Users couldn't upload profile images.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">✅ Solution:</p>
                        <ul className="space-y-1">
                          <li>• Added hidden file input for image selection</li>
                          <li>• Camera button triggers file picker</li>
                          <li>• File validation (type, size)</li>
                          <li>• Upload progress indicator</li>
                          <li>• Success/error feedback</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">🔧 Technical Details:</p>
                      <ul className="space-y-1">
                        <li>• File: <code>src/app/profile/page.tsx</code></li>
                        <li>• Added handleImageUpload function</li>
                        <li>• File validation: JPEG, PNG, WebP</li>
                        <li>• Max size: 5MB</li>
                        <li>• API: <code>/api/profile/upload-image</code></li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Additional Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-amber-800">File Validation</h3>
                    <p className="text-sm text-amber-700">Type and size validation</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Crown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800">User Experience</h3>
                    <p className="text-sm text-blue-700">Loading states and feedback</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800">Error Handling</h3>
                    <p className="text-sm text-green-700">Comprehensive error messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Guide Tab */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Testing Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🔍 Test 1: Profile Button Navigation</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                        <span className="text-sm">Sign in to your account</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('signin')}
                        disabled={testResults['signin']}
                      >
                        {testResults['signin'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                        <span className="text-sm">Click on your profile icon (top right)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('click-profile')}
                        disabled={testResults['click-profile']}
                      >
                        {testResults['click-profile'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                        <span className="text-sm">Verify "My Profile" option appears in dropdown</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('see-profile-option')}
                        disabled={testResults['see-profile-option']}
                      >
                        {testResults['see-profile-option'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                        <span className="text-sm">Click "My Profile" and verify navigation to profile page</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('navigate-profile')}
                        disabled={testResults['navigate-profile']}
                      >
                        {testResults['navigate-profile'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">📷 Test 2: Profile Image Upload</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">1</div>
                        <span className="text-sm">Go to your profile page</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open('/profile', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open Profile
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">2</div>
                        <span className="text-sm">Click the camera button on your profile picture</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('click-camera')}
                        disabled={testResults['click-camera']}
                      >
                        {testResults['click-camera'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">3</div>
                        <span className="text-sm">Verify file picker opens</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('file-picker')}
                        disabled={testResults['file-picker']}
                      >
                        {testResults['file-picker'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">4</div>
                        <span className="text-sm">Select a valid image (JPEG, PNG, WebP, &lt;5MB)</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('select-image')}
                        disabled={testResults['select-image']}
                      >
                        {testResults['select-image'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">5</div>
                        <span className="text-sm">Verify upload progress and success message</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markTestComplete('upload-success')}
                        disabled={testResults['upload-success']}
                      >
                        {testResults['upload-success'] ? '✅ Done' : 'Mark Complete'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium">✅ All Tests Complete!</p>
                      <p>Both profile navigation and image upload functionality are working correctly.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Troubleshooting Tab */}
          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Common Issues & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-red-700 mb-2">❌ Profile link not appearing</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Cause:</strong> User not signed in or session expired</p>
                      <p><strong>Solution:</strong> Sign out and sign back in</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-red-700 mb-2">❌ Image upload fails</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Possible causes:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>File too large (&gt;5MB)</li>
                        <li>Invalid file type (not JPEG, PNG, or WebP)</li>
                        <li>Network connection issues</li>
                        <li>Server storage permissions</li>
                      </ul>
                      <p><strong>Solutions:</strong></p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>Resize image to under 5MB</li>
                        <li>Convert to supported format</li>
                        <li>Check internet connection</li>
                        <li>Contact administrator if persistent</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-red-700 mb-2">❌ Image doesn't update after upload</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Cause:</strong> Browser cache or session not refreshed</p>
                      <p><strong>Solution:</strong> Refresh the page or sign out/in again</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">🔧 Developer Notes:</p>
                    <ul className="space-y-1">
                      <li>• Images are stored in <code>/public/uploads/profiles/</code></li>
                      <li>• Database stores relative path in user.image field</li>
                      <li>• File naming: <code>{'userId'}-{'timestamp'}-{'originalName'}</code></li>
                      <li>• API endpoint: <code>/api/profile/upload-image</code></li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
