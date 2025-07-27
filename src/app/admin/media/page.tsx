import { MediaManager } from '@/components/admin/media-manager';
import { Box, Container, Typography } from '@mui/material';

export default function AdminMediaPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Media Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload and manage your media files here. Supported formats: Images (PNG, JPG, GIF) and Videos (MP4, WebM).
        </Typography>
      </Box>
      
      <MediaManager />
    </Container>
  );
} 