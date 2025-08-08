"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Container, Typography, Box } from "@mui/material";
import ReviewsManager from "@/components/admin/ReviewsManager";

export default function AdminReviewsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom className="text-hieroglyph-brown">
            <span className="text-egyptian-gold mr-2">⭐</span>
            Reviews Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Review and approve user-submitted reviews for dahabiyas
          </Typography>
        </Box>
        
        <ReviewsManager />
      </Container>
    </div>
  );
}
