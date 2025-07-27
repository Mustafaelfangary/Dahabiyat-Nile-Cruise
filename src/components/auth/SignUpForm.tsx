"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Upload } from "lucide-react";
import Image from "next/image";
import EmailVerificationForm from "./EmailVerificationForm";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9]+$/, "Phone number can only contain digits and an optional '+' prefix")
    .transform(val => val.startsWith('+') ? val : `+${val}`), // Ensure phone number always starts with +
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      
      // First, upload the image if it exists
      let imageUrl = null;
      if (profileImage) {
        const formData = new FormData();
        formData.append('file', profileImage);
        
        console.log('Uploading image...');
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-profile-image': 'true'
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error('Upload error:', errorData);
          throw new Error(errorData.message || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        console.log('Upload successful:', uploadData);
        imageUrl = uploadData.url;
      }

      // Then create the user account
      console.log('Creating user account with data:', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: imageUrl
      });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup error response:', errorData);
        throw new Error(errorData.message || "Failed to create account");
      }

      const responseData = await response.json();
      console.log('Signup successful:', responseData);

      if (responseData.requiresVerification) {
        // Show email verification form
        setUserEmail(data.email);
        setShowVerification(true);
        toast.success("Account created! Please check your email for verification code.");
      } else {
        // Old flow for backward compatibility
        toast.success("Account created successfully!");

        // Sign in the user automatically after successful registration
        console.log('Attempting to sign in...');
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          console.error('Auto sign-in failed:', result.error);
          toast.error("Account created but failed to sign in automatically");
          router.push("/auth/signin");
          return;
        }

        console.log('Sign-in successful, redirecting to homepage...');
        // Redirect to homepage for regular users
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    // After email verification, sign in the user
    try {
      const result = await signIn("credentials", {
        email: userEmail,
        password: '', // We'll need to handle this differently
        redirect: false,
      });

      if (result?.error) {
        // If auto sign-in fails, redirect to sign-in page
        toast.success("Email verified! Please sign in to continue.");
        router.push("/auth/signin");
        return;
      }

      toast.success("Welcome to Cleopatra Dahabiyat!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error('Post-verification sign-in error:', error);
      toast.success("Email verified! Please sign in to continue.");
      router.push("/auth/signin");
    }
  };

  // Show verification form if needed
  if (showVerification) {
    return (
      <div className="w-full max-w-md mx-auto">
        <EmailVerificationForm
          email={userEmail}
          onVerified={handleVerificationComplete}
        />
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowVerification(false)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to signup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex-col items-center space-y-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <Upload className="w-8 h-8 text-text-primary" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="profileImage" className="cursor-pointer">
                <span className="text-sm text-text-primary hover:text-text-primary">
                  {previewUrl ? "Change photo" : "Add photo (optional)"}
                </span>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              {...register("name")}
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-text-primary text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-text-primary text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              {...register("phone")}
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-text-primary text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-text-primary text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-text-primary text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link 
            href="/auth/signin"
            className="text-primary hover:text-primary-dark"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
} 