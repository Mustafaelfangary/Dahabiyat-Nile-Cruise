import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale prefix if present
    const segments = (pathname ?? '/').split('/');
    // If the first segment is a supported locale, replace it
    if (languages.some(lang => lang.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';
    router.replace(newPath);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{ color: 'white' }}
      >
        {languages.find(lang => lang.code === locale)?.name || 'Language'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={locale === language.code}
          >
            {language.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
} 