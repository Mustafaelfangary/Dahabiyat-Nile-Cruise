"use client";
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useContent } from '@/hooks/useContent';

interface Setting {
  settingKey: string;
  settingValue: string;
}

export default function FAQPage() {
  const { getContent, loading, error } = useContent({ page: 'faq' });
  const t = useTranslation();

  const get = (key: string, fallback: string = '') => getContent(key, fallback);

  const faqs = [1, 2, 3, 4, 5].map(i => ({
    question: get(`faq_${i}_question`),
    answer: get(`faq_${i}_answer`),
  }));

  return (
    <main>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          bgcolor: 'primary.main',
        }}
      >
        <Container maxWidth="lg">
          {/* Hieroglyphic Egypt at top */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-white mb-2">
              𓎢𓃭𓅂𓅱𓊪𓄿𓏏𓂋𓄿
            </div>
          </div>

          <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
            {get('faq_hero_title', 'Frequently Asked Questions')}
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            {get('faq_hero_subtitle', 'Find answers to common questions about our cruises')}
          </Typography>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ mb: 6, textAlign: 'center' }}>
          {t('faq')}
        </Typography>
        {faqs.map((faq, index) => faq.question && faq.answer && (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </main>
  );
} 