# Royal Academy School Management System

## Overview
Royal Academy is a comprehensive school management web application built with React, TypeScript, and Vite. It supports multiple user roles (Principal, Teachers, Students) and offers features for managing admissions, faculty, courses, galleries, announcements, and more. The system utilizes Supabase as its primary backend, with localStorage providing a robust fallback for offline functionality and real-time synchronization across devices. The project aims to provide an efficient, user-friendly platform for educational institutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Frameworks**: React 18.3.1 with TypeScript, Vite for fast development, React Router for client-side routing.
- **UI/Styling**: Tailwind CSS with custom themes, shadcn/ui for accessible components, Framer Motion for animations, next-themes for dark/light mode.
- **State Management**: Component-level state with React hooks; persistence handled by localStorage and Supabase.
- **Design Patterns**: Protected routes, consistent CRUD patterns for manager components, dual persistence strategy (localStorage + Supabase), and Realtime subscriptions for live data updates.

### Backend Architecture
- **Database**: Supabase serves as the primary backend, utilizing a single `app_state` table for key-value JSON storage, enabling a schema-less approach.
- **Data Persistence**: `supaStorage.ts` provides a localStorage shim. Data is written to localStorage first, then asynchronously to Supabase. Reads prioritize localStorage, falling back to Supabase.
- **Authentication**: Simple localStorage-based authentication using boolean flags (`principalAuth`, `teacherAuth`, `studentAuth`) for role-based access.

### Data Architecture
All application data, from homepage content to student reports and audio messages, is stored as key-value pairs within localStorage and synchronized with Supabase. Key data entities include:
- `royal-academy-homepage`
- `royal-academy-about`
- `royal-academy-admissions`
- `royal-academy-teachers`
- `royal-academy-auth-teachers`
- `royal-academy-students`
- `royal-academy-gallery`
- `royal-academy-announcements`
- `royal-academy-courses`
- `royal-academy-top-scorers`
- `royal-academy-pricing`
- `royal-academy-academics`
- `royal-academy-facilities`
- `royal-academy-audio-messages`
- `royal-academy-yearly-books`
- `royal-academy-student-reports`
- `royal-academy-exam-routines`

**Data Flow**: User actions trigger component state updates, which then call persistence methods. Data is written synchronously to localStorage and asynchronously to Supabase. Supabase Realtime then broadcasts changes, ensuring cross-tab and cross-device synchronization.

### Feature Specifications
- **Audio Messaging System**: Allows the Principal to send audio messages to various recipient groups, with recording, upload, playback, and deletion capabilities. Audio is base64-encoded and stored in Supabase.
- **Content Management Systems**: Managers for Academics (departments, achievements) and Facilities (descriptions, statistics) are integrated into the Principal Dashboard with full CRUD capabilities.
- **Book Management System**: Manages yearly book recommendations with CRUD operations, filtering by class and academic year. A public-facing page displays books.
- **Exam Routine Management System**: Manages exam schedules and holidays with advanced filtering options and real-time updates.

### UI/UX Decisions
- **Color Schemes**: Custom royal, crimson, and gold palettes.
- **Animations**: Framer Motion for smooth transitions, optimized for speed and mobile responsiveness.
- **Mobile Responsiveness**: Comprehensive mobile-first design for all dashboards and public pages, ensuring touch-friendly interactions and compact layouts.

## External Dependencies

### Core Libraries
- `@supabase/supabase-js`: Supabase client.
- `framer-motion`: Animation library.
- `react-router-dom`: Client-side routing.
- `lucide-react`: Icon library.

### UI Component Libraries
- `@radix-ui/*`: Headless UI primitives.
- `class-variance-authority` & `clsx`: Utilities for conditional classNames.

### Form & Validation
- `@hookform/resolvers`: Integration with schema validation.
- `react-hook-form`: Form state management.
- `zod`: Schema validation.

### Payment Integrations
- Razorpay, PayPal, Stripe SDKs are declared but currently unconfigured and not actively used.

### Development Tools
- ESLint with TypeScript support.
- Vercel for hosting and deployment.