import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface BookingModificationFormProps {
  bookingId: string;
  initialData: {
    startDate: Date;
    endDate: Date;
    guests: number;
    specialRequests?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingModificationForm({
  bookingId,
  initialData,
  onSuccess,
  onCancel,
}: BookingModificationFormProps) {
  const [startDate, setStartDate] = useState<Date>(initialData.startDate);
  const [endDate, setEndDate] = useState<Date>(initialData.endDate);
  const [guests, setGuests] = useState(initialData.guests);
  const [specialRequests, setSpecialRequests] = useState(
    initialData.specialRequests || ''
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          guests,
          specialRequests,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to modify booking');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Modify Booking</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="Check-in Date"
                value={startDate}
                onChange={(date) => date && setStartDate(date)}
                minDate={new Date()}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <DatePicker
                label="Check-out Date"
                value={endDate}
                onChange={(date) => date && setEndDate(date)}
                minDate={startDate}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            label="Number of Guests"
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label="Special Requests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 