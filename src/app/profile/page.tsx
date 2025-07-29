"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";
import { BookingsList } from '@/components/BookingsList';
import { WishlistGrid } from '@/components/WishlistGrid';
import { ReviewsList } from '@/components/ReviewsList';
import UserNotificationCenter from '@/components/profile/UserNotificationCenter';
import MemorySharing from '@/components/profile/MemorySharing';
import ReviewSharing from '@/components/profile/ReviewSharing';
import LoyaltyButtons from '@/components/profile/LoyaltyButtons';
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Settings,
  Calendar,
  Heart,
  Star,
  Bell,
  Shield,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Edit3,
  Save,
  LogOut,
  Crown,
  Ship,
  Package,
  Gift,
  Award,
  Compass,
  Sunset,
  Palmtree
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showBookingHistory: boolean;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'bookings');
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteDestination: '',
    memberSince: '',
    loyaltyPoints: 0
  });

  const handlePointsEarned = (points: number, action: string) => {
    setUserStats(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + points
    }));
  };
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    currency: 'USD',
    notifications: {
      email: true,
      sms: false,
      marketing: true
    },
    privacy: {
      profileVisible: true,
      showBookingHistory: false
    }
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (session) {
      fetchUserStats();
      fetchUserPreferences();
    }
  }, [session]);

  useEffect(() => {
    // Listen for memory sharing events from loyalty buttons
    const handleMemorySharing = () => {
      setActiveTab('memories');
    };

    window.addEventListener('openMemorySharing', handleMemorySharing);
    return () => window.removeEventListener('openMemorySharing', handleMemorySharing);
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats');
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        // Ensure notifications and privacy objects exist
        const completeData = {
          ...data,
          notifications: {
            email: true,
            sms: false,
            marketing: false,
            ...data.notifications
          },
          privacy: {
            profileVisible: true,
            showBookingHistory: false,
            ...data.privacy
          }
        };
        setPreferences(completeData);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      if (response.ok) {
        toast.success('Preferences saved successfully');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-700 font-medium">Loading your royal profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success("You have been signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', session?.user?.id || '');

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      toast.success('Profile image updated successfully!');

      // Refresh the session to get the updated image
      window.location.reload();

    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const getLoyaltyTier = (points: number) => {
    if (points >= 10000) return { name: 'Pharaoh', color: 'text-purple-600', icon: Crown };
    if (points >= 5000) return { name: 'Noble', color: 'text-amber-600', icon: Award };
    if (points >= 1000) return { name: 'Explorer', color: 'text-blue-600', icon: Compass };
    return { name: 'Traveler', color: 'text-green-600', icon: Palmtree };
  };

  const loyaltyTier = getLoyaltyTier(userStats.loyaltyPoints);
  const LoyaltyIcon = loyaltyTier.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-slate-50 relative overflow-hidden">
      {/* Pharaonic Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M50 50l25-25v50z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <Container maxWidth="full" className="relative z-10 py-8">
        <AnimatedSection animation="fade-in">
          {/* Hero Profile Section */}
          <div className="relative mb-12">
            {/* Background Card with Golden Gradient */}
            <Card className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 border-none shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardContent className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Profile Avatar */}
                  <div className="relative">
                    {/* Pharaonic ornamental rings */}
                    <div className="absolute inset-0 w-40 h-40 rounded-full border-4 border-egyptian-gold/30 animate-pulse" />
                    <div className="absolute inset-2 w-36 h-36 rounded-full border-2 border-white/40" />

                    {/* Main avatar container */}
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white/60 shadow-2xl bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                        <AvatarFallback className="text-5xl font-bold text-amber-700 bg-gradient-to-br from-white to-amber-50">
                          {session.user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      {/* Pharaonic symbols overlay */}
                      <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Pharaonic crown symbol */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-egyptian-gold to-egyptian-gold/80 rounded-full flex items-center justify-center text-hieroglyph-brown text-lg font-bold shadow-lg border-2 border-white/50">
                      𓇳
                    </div>

                    {/* Side pharaonic symbols */}
                    <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 text-egyptian-gold/60 text-2xl">
                      𓈖
                    </div>
                    <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-egyptian-gold/60 text-2xl">
                      𓈖
                    </div>

                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-3 -right-3 rounded-full w-12 h-12 p-0 bg-gradient-to-br from-egyptian-gold to-egyptian-gold/80 hover:from-egyptian-gold/90 hover:to-egyptian-gold/70 text-hieroglyph-brown shadow-xl border-2 border-white/50 transition-all duration-300 hover:scale-110"
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-hieroglyph-brown border-t-transparent" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center lg:text-left text-white">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <h1 className="text-4xl lg:text-5xl font-heading font-bold drop-shadow-lg">
                        {session.user.name}
                      </h1>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <LoyaltyIcon className="w-5 h-5" />
                        <span className="font-semibold">{loyaltyTier.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-white/90">{session.user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-white/90">Member since {userStats.memberSince || '2024'}</span>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <Ship className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{userStats.totalBookings}</div>
                        <div className="text-sm text-white/80">Cruises</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <Crown className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{userStats.loyaltyPoints.toLocaleString()}</div>
                        <div className="text-sm text-white/80">Points</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <Gift className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-2xl font-bold">${userStats.totalSpent.toLocaleString()}</div>
                        <div className="text-sm text-white/80">Spent</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                        <MapPin className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-2xl font-bold">{userStats.favoriteDestination || 'Egypt'}</div>
                        <div className="text-sm text-white/80">Favorite</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="profile-action-buttons flex flex-col gap-3">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm w-full justify-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm w-full justify-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile Tabs - Scrollable */}
            <div className="lg:hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <TabsList className="flex w-max min-w-full gap-1 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-1">
                  <TabsTrigger
                    value="bookings"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Journeys</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-xs">Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="wishlist"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">Wishlist</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Star className="w-4 h-4" />
                    <span className="text-xs">Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="loyalty"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-xs">Loyalty</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="memories"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-xs">Memories</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="flex items-center gap-2 whitespace-nowrap px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-xs">Settings</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Desktop Tabs - Grid */}
            <div className="hidden lg:block">
              <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-xl p-1">
                <TabsTrigger
                  value="bookings"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Journeys</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="wishlist"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Star className="w-4 h-4" />
                  <span>Reviews</span>
                </TabsTrigger>
                <TabsTrigger
                  value="loyalty"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Crown className="w-4 h-4" />
                  <span>Loyalty</span>
                </TabsTrigger>
                <TabsTrigger
                  value="memories"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Camera className="w-4 h-4" />
                  <span>Memories</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-400 data-[state=active]:text-white"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* My Journeys Tab */}
            <TabsContent value="bookings" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                      <Ship className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl text-gray-800">My Journeys</CardTitle>
                      <CardDescription className="text-gray-600 text-sm lg:text-base">
                        Your adventures along the eternal Nile
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="min-h-[200px]">
                    <BookingsList />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl text-gray-800">Notifications</CardTitle>
                      <CardDescription className="text-gray-600 text-sm lg:text-base">
                        Stay updated with your journey alerts
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="min-h-[200px]">
                    <UserNotificationCenter />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl text-gray-800">Treasured Desires</CardTitle>
                      <CardDescription className="text-gray-600 text-sm lg:text-base">
                        Cruises and experiences you wish to embark upon
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="min-h-[200px]">
                    <WishlistGrid />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl lg:text-2xl text-gray-800">Royal Testimonials</CardTitle>
                      <CardDescription className="text-gray-600 text-sm lg:text-base">
                        Share your experiences with fellow travelers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 lg:p-6">
                  <div className="min-h-[200px]">
                    <ReviewsList />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">Personal Information</CardTitle>
                        <CardDescription>Update your profile details</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={session.user.name?.split(' ')[0]} />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={session.user.name?.split(' ')[1]} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={session.user.email || ''} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">Preferences</CardTitle>
                        <CardDescription>Customize your experience</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={preferences.currency} onValueChange={(value) => setPreferences({...preferences, currency: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="EGP">EGP (ج.م)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailNotif">Email Notifications</Label>
                          <Switch
                            id="emailNotif"
                            checked={preferences.notifications?.email || false}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              notifications: {...(preferences.notifications || {}), email: checked}
                            })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="smsNotif">SMS Notifications</Label>
                          <Switch
                            id="smsNotif"
                            checked={preferences.notifications?.sms || false}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              notifications: {...(preferences.notifications || {}), sms: checked}
                            })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="marketingNotif">Marketing Updates</Label>
                          <Switch
                            id="marketingNotif"
                            checked={preferences.notifications?.marketing || false}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              notifications: {...(preferences.notifications || {}), marketing: checked}
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Privacy
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="profileVisible">Public Profile</Label>
                          <Switch
                            id="profileVisible"
                            checked={preferences.privacy?.profileVisible || false}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              privacy: {...(preferences.privacy || {}), profileVisible: checked}
                            })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showBookings">Show Booking History</Label>
                          <Switch
                            id="showBookings"
                            checked={preferences.privacy?.showBookingHistory || false}
                            onCheckedChange={(checked) => setPreferences({
                              ...preferences,
                              privacy: {...(preferences.privacy || {}), showBookingHistory: checked}
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={savePreferences}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-800">Royal Loyalty Program</CardTitle>
                      <CardDescription className="text-gray-600">
                        Your journey to pharaonic privileges
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Current Tier */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200">
                      <LoyaltyIcon className={`w-8 h-8 ${loyaltyTier.color}`} />
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{loyaltyTier.name}</div>
                        <div className="text-sm text-gray-600">{userStats.loyaltyPoints.toLocaleString()} points</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Progress to next tier</span>
                      <span className="text-sm text-gray-500">
                        {Math.min(userStats.loyaltyPoints, 10000)}/10000 points
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((userStats.loyaltyPoints / 10000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tier Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-amber-600" />
                        Current Benefits
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Priority booking access
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Exclusive member rates
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Complimentary upgrades
                        </div>
                        {loyaltyTier.name !== 'Traveler' && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Personal concierge service
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <LoyaltyButtons onPointsEarned={handlePointsEarned} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Memories Tab */}
            <TabsContent value="memories" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-egyptian-gold to-sunset-orange rounded-lg">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-800">Share Your Memories</CardTitle>
                      <CardDescription className="text-gray-600">
                        Share your beautiful travel memories with our community
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <MemorySharing />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-egyptian-gold to-sunset-orange rounded-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-800">Share Your Reviews</CardTitle>
                      <CardDescription className="text-gray-600">
                        Share your experience with our dahabiyas and help other travelers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ReviewSharing />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </AnimatedSection>
      </Container>
    </div>
  );
}