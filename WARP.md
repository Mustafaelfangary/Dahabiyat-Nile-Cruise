# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Start development server (with memory optimizations)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking without compilation
npm run type-check

# Linting
npm run lint

# Clean build artifacts and cache
npm run clean
```

### Database Operations
```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Run database migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Reset database (destructive)
npm run db:reset

# Seed database with data
npm run db:seed

# Seed with minimal data
npm run db:seed:minimal
```

### Database Setup (for new environments)
```bash
# Create PostgreSQL database manually first:
# psql -U postgres -c "CREATE DATABASE cleopatra_db;"

# Then run full setup
npm run db:generate && npm run db:push && npm run db:seed
```

### Content & Data Management
```bash
# Cleanup homepage content
npm run cleanup:homepage

# Complete system cleanup
npm run cleanup:complete

# Reset migrations (destructive)
npm run reset:migrations

# Fresh start (reset + cleanup)
npm run fresh:start

# Sync content across platforms
npm run sync:content

# Sync to mobile platforms
npm run sync:mobile
```

### Platform-Specific Testing
```bash
# Run single test file
npx jest path/to/test.test.ts

# Test database connection
npx prisma db pull

# Check if build works
npm run build && echo "Build successful"
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript with strict configuration
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4 with custom providers
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Mixed Radix UI + Material-UI + custom components
- **State Management**: React Query (@tanstack/react-query)
- **Deployment**: PM2 with ecosystem configuration

### Project Structure

#### Core Application (`/src/app/`)
- **App Router**: All routes use Next.js 13+ app directory structure
- **Admin Panel**: Comprehensive admin system at `/admin/` with role-based access
- **API Routes**: RESTful API endpoints in `/api/` for all data operations
- **Authentication**: Custom auth flow with email verification and role management
- **Internationalization**: next-intl for multi-language support (English default)

#### Key Components (`/src/components/`)
- **Admin**: Full-featured admin interface with booking/content/media management
- **Mobile**: Specialized mobile layouts and PWA components
- **Booking**: Unified booking forms for different travel packages
- **Authentication**: Complete auth flow components with verification
- **UI**: Custom design system components built on Radix UI

#### Database Schema (`/prisma/`)
- **User Management**: Role-based system (USER/ADMIN) with loyalty/rewards
- **Booking System**: Comprehensive booking with modifications and cancellations  
- **Content Management**: Dynamic content system for multi-language pages
- **Media**: Organized media management with galleries and assets
- **Analytics**: Built-in analytics and conversion tracking

### Key Architectural Patterns

#### Database Architecture
- **Prisma ORM**: Type-safe database operations with generated client
- **PostgreSQL**: Production database with complex relations
- **Content System**: Dynamic content keys for internationalization
- **Media Management**: Structured media assets with categorization
- **User Roles**: Admin/User distinction with feature access control

#### Authentication Flow
- **NextAuth.js**: Session-based auth with database adapter
- **Role-Based Access**: Admin panel restricted by user role
- **Email Verification**: Required for new user accounts
- **Password Reset**: Secure token-based password recovery

#### Frontend Architecture
- **Server Components**: Heavy use of Next.js server components for performance
- **Client Interactivity**: Strategic use of client components for forms/interactivity
- **Mobile-First**: Responsive design with dedicated mobile components
- **Performance**: Image optimization, font loading, and web vitals tracking

#### API Design
- **RESTful Routes**: Consistent API structure in `/api/` directory
- **Type Safety**: Full TypeScript integration with Prisma types
- **Error Handling**: Comprehensive error responses and logging
- **Validation**: Zod schemas for input validation

### Development Guidelines

#### Database Development
- Always run `npm run db:generate` after schema changes
- Use `npm run db:push` for development, migrations for production
- Check `DATABASE_SETUP_GUIDE.md` for connection troubleshooting
- Content keys are managed through admin panel, not directly in code

#### Component Development  
- Follow the established pattern of organizing components by feature in subdirectories
- Use TypeScript interfaces for all props and API responses
- Mobile components are separate from desktop (see `/mobile/` directory)
- Admin components have different styling patterns (see admin CSS files)

#### Styling Approach
- **Tailwind CSS**: Primary styling system with custom design tokens
- **CSS Modules**: Additional CSS files for specific overrides
- **Design System**: Custom color palette based on ocean blue theme
- **Typography**: Inter for body text, Playfair Display for headings

#### Performance Considerations
- **Memory Management**: Development uses increased memory allocation (8GB limit)
- **Image Optimization**: WebP/AVIF formats with multiple size variants  
- **Bundle Optimization**: Package imports are optimized for key libraries
- **Analytics**: Custom web vitals tracking in production

### Environment Setup

#### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/cleopatra_db"

# Authentication  
NEXTAUTH_URL="http://localhost:3000" # Update for production
NEXTAUTH_SECRET="your-secret-key"

# Email (for auth verification)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com" 
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="your-email@gmail.com"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-ga-id"
```

#### Multi-Platform Development
- **Main Application**: Next.js web application (this repository)
- **Mobile Apps**: Separate React Native applications in `/mobile-app/`, `/final-android-app/`, `/android-app/`
- **Content Sync**: Use `npm run sync:content` to synchronize content across platforms
- **API Integration**: Mobile apps consume the same API endpoints as the web application

### Common Development Tasks

#### Adding New Features
1. **Database Changes**: Modify `prisma/schema.prisma` and run migrations
2. **API Endpoints**: Create corresponding routes in `/src/app/api/`
3. **Components**: Build reusable components in appropriate feature directory
4. **Admin Interface**: Add management interface if content is admin-manageable
5. **Mobile Support**: Consider mobile-specific implementations

#### Content Management
- **Dynamic Content**: All user-facing text managed through content system
- **Media Assets**: Upload and manage through admin panel
- **Internationalization**: Content keys support multiple languages
- **SEO Optimization**: Meta tags and structured data generated dynamically

#### Troubleshooting Common Issues
- **Database Connection**: Check PostgreSQL service and credentials
- **Build Errors**: Run `npm run clean` then `npm run build`
- **TypeScript Errors**: Run `npm run type-check` to identify issues
- **Authentication Issues**: Verify NEXTAUTH_URL matches your environment
- **Content Missing**: Check database seeding and content key population

The codebase represents a production-ready travel booking platform with comprehensive admin features, mobile support, and enterprise-level architecture patterns.
