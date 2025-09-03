"use client";

import { Review, User } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { toast } from "react-hot-toast";
import { Star, ThumbsUp, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

// Types for different review contexts
type ReviewWithUser = Review & {
  user: Pick<User, "name" | "image">;
};

type UserReview = {
  id: string;
  title: string;
  comment: string;
  rating: number;
  helpful: number;
  verified: boolean;
  createdAt: string;
  dahabiya: {
    id: string;
    name: string;
  };
  photos: string[];
  response?: string;
};

interface UnifiedReviewComponentProps {
  // For dahabiya-specific reviews
  reviews?: ReviewWithUser[];
  dahabiyaId?: string;
  
  // For user's own reviews
  mode?: 'dahabiya' | 'user';
  
  // Common props
  title?: string;
  showAddReview?: boolean;
  showManageActions?: boolean;
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  title: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function UnifiedReviewComponent({
  reviews: initialReviews = [],
  dahabiyaId,
  mode = 'dahabiya',
  title,
  showAddReview = true,
  showManageActions = false
}: UnifiedReviewComponentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<(ReviewWithUser | UserReview)[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(mode === 'user');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  // Fetch user reviews if in user mode
  useEffect(() => {
    if (mode === 'user') {
      fetchUserReviews();
    }
  }, [mode]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!session || !dahabiyaId) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          dahabiyaId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      setReviews(prev => [newReview, ...prev]);
      reset();
      setShowForm(false);
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/user/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">
          {title || (mode === 'user' ? 'My Reviews' : 'Reviews')}
        </h2>
        {mode === 'dahabiya' && showAddReview && session && (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90"
          >
            {showForm ? "Cancel" : "Write Review"}
          </Button>
        )}
      </div>

      {/* Add Review Form */}
      {mode === 'dahabiya' && showForm && session && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Rating
                </label>
                <select
                  {...register("rating", { valueAsNumber: true })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Comment
                </label>
                <textarea
                  {...register("comment")}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Share your experience..."
                />
                {errors.comment && (
                  <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-text-secondary">
                {mode === 'user' ? "You haven't written any reviews yet." : "No reviews yet. Be the first to review!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {mode === 'dahabiya' && 'user' in review && (
                      <>
                        {review.user.image && (
                          <Image
                            src={review.user.image}
                            alt={review.user.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <p className="font-medium text-text-primary">
                            {review.user.name || "Anonymous"}
                          </p>
                          <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-text-secondary">
                              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {mode === 'user' && 'dahabiya' in review && (
                      <div>
                        <CardTitle className="text-lg">{(review as UserReview).title || (review as UserReview).dahabiya.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span className="text-sm text-text-secondary">
                            {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                          </span>
                          {(review as UserReview).verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {showManageActions && mode === 'user' && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-text-primary">{review.comment}</p>
                
                {mode === 'user' && 'helpful' in review && (
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{(review as UserReview).helpful} helpful</span>
                    </div>
                  </div>
                )}
                
                {mode === 'user' && 'response' in review && (review as UserReview).response && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-text-primary mb-1">Response from Cleopatra Dahabiya:</p>
                    <p className="text-sm text-text-secondary">{(review as UserReview).response}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
