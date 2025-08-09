"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Container from '@/components/ui/container';
import { PharaonicCard } from '@/components/ui/pharaonic-elements';
import { 
  Share2, 
  Heart, 
  MapPin, 
  Calendar, 
  User,
  Camera,
  ChevronRight
} from 'lucide-react';

interface UserMemory {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
  tripDate?: string;
  approvedAt: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
}

export default function ShareYourMemories() {
  const [memories, setMemories] = useState<UserMemory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedMemories();
  }, []);

  const fetchApprovedMemories = async () => {
    try {
      const response = await fetch('/api/user/memories?status=APPROVED');
      if (response.ok) {
        const data = await response.json();
        // Get the latest 6 approved memories
        setMemories(data.memories.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching approved memories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-blue-50 to-ocean-blue-lightest">
        <Container maxWidth="lg">
          <div className="text-center">
            <div className="text-6xl text-ocean-blue animate-pulse mb-4">𓇳</div>
            <div className="text-xl text-deep-blue">Loading memories...</div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-ocean-blue-lightest relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl text-ocean-blue animate-pulse">𓇳</div>
        <div className="absolute top-20 right-20 text-4xl text-blue-300 animate-pulse">𓊪</div>
        <div className="absolute bottom-20 left-20 text-5xl text-ocean-blue animate-pulse">𓈖</div>
        <div className="absolute bottom-10 right-10 text-6xl text-blue-300 animate-pulse">𓂀</div>
      </div>

      <Container maxWidth="lg">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-blue-600 text-5xl animate-pulse">𓎢</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
              Share Your Memories
            </h2>
            <span className="text-blue-600 text-5xl animate-pulse">𓎢</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-blue-600 text-xl">𓎢</span>
            <span className="text-blue-600 text-xl">𓃭</span>
            <span className="text-blue-600 text-xl">𓅂</span>
            <span className="text-blue-600 text-xl">𓅱</span>
            <span className="text-blue-600 text-xl">𓄿</span>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the magical moments captured by our fellow travelers. Each memory tells a story of wonder, 
            adventure, and the timeless beauty of Egypt.
          </p>

          <Link href="/profile">
            <Button className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-3">
              <Share2 className="w-5 h-5 mr-2" />
              Share Your Memory
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Memories Grid */}
        {memories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl text-blue-600 mb-4">𓈖</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Memories Yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your beautiful travel memories with our community!
            </p>
            <Link href="/profile">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                <Camera className="w-4 h-4 mr-2" />
                Share Your First Memory
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {memories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PharaonicCard className="group overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-ocean-blue/30 h-full">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={memory.imageUrl}
                        alt={memory.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean-blue/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                              <Heart className="w-5 h-5" />
                              <Share2 className="w-5 h-5" />
                            </div>
                            <div className="text-2xl">𓇳</div>
                          </div>
                        </div>
                      </div>

                      {/* User Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          {memory.user.image ? (
                            <Image
                              src={memory.user.image}
                              alt={memory.user.name || 'User'}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="w-4 h-4 text-deep-blue" />
                          )}
                          <span className="text-xs font-medium text-deep-blue">
                            {memory.user.name || 'Traveler'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      <h3 className="font-bold text-deep-blue text-lg mb-2 group-hover:text-ocean-blue transition-colors">
                        {memory.title}
                      </h3>
                      
                      {memory.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {memory.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 text-sm text-gray-500">
                        {memory.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-ocean-blue" />
                            <span>{memory.location}</span>
                          </div>
                        )}
                        
                        {memory.tripDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-ocean-blue" />
                            <span>{new Date(memory.tripDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Egyptian Decorative Border */}
                      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-ocean-blue/20">
                        <span className="text-ocean-blue text-sm">𓏏</span>
                        <span className="text-ocean-blue text-sm">𓇯</span>
                        <span className="text-ocean-blue text-sm">𓊃</span>
                      </div>
                    </CardContent>
                  </PharaonicCard>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200/30 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="text-4xl text-blue-600 mb-4">𓎢</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Share Your Egyptian Adventure
                </h3>
                <p className="text-gray-600 mb-6">
                  Have you experienced the magic of Egypt? Share your memories with our community
                  and inspire future travelers to discover the wonders of this ancient land.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/profile">
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Share Your Memory
                    </Button>
                  </Link>
                  <Link href="/gallery-new">
                    <Button variant="outline" className="border-blue-200/30 text-gray-800 hover:bg-blue-50">
                      <span className="mr-2">𓂀</span>
                      View Gallery
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
