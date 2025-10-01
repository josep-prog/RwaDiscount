# RwaDiscount - Discount Discovery Platform

A comprehensive discount discovery platform connecting customers with merchants offering deals in Rwanda.

## Features

### For Customers
- Browse and search deals by category, location, and discount percentage
- Save favorite deals for later
- Provide feedback on deals (thumbs up/down)
- Sign up with email/password or Google OAuth
- Track saved deals in personal dashboard

### For Merchants
- Register business account (requires admin approval)
- Create and manage discount deals
- View analytics (views, saves, engagement)
- Track deal performance
- Edit and delete deals

### For Admins
- Review and approve merchant applications
- Moderate deal submissions
- View platform statistics
- Manage users and content

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)
- **Icons**: Lucide React
- **Routing**: React Router

## Database Schema

- **profiles** - User profiles extending Supabase auth.users
- **merchant_profiles** - Additional merchant business information
- **deals** - Discount offers posted by merchants
- **saved_deals** - Customer saved deals
- **deal_feedback** - Thumbs up/down feedback
- **notifications** - System notifications
- **notification_subscriptions** - User notification preferences

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The Supabase database is already configured and migrations have been applied.

3. Start the development server:
```bash
npm run dev
```

### Creating an Admin User

To create an admin user:

1. Sign up for a new account through the web interface at `/signup`
2. After signing up, run this SQL in the Supabase SQL Editor:

```sql
-- Replace 'your-email@example.com' with the email you signed up with
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## User Flow

### Customer Flow
1. Sign up with email/password or Google
2. Browse deals on home page
3. Filter by category, location, or discount
4. Save interesting deals
5. Provide feedback on deals
6. View saved deals in dashboard

### Merchant Flow
1. Sign up as customer
2. Click "Become a Merchant"
3. Fill out business registration form
4. Wait for admin approval
5. Once approved, create deals
6. Monitor deal performance
7. Edit/delete deals as needed

### Admin Flow
1. Admin account must be created via SQL
2. Access admin dashboard
3. Review pending merchant applications
4. Approve or reject with reason
5. Review pending deals
6. Approve or reject deals
7. Monitor platform statistics

## Key Features

### Authentication
- Email/password signup with password visibility toggle
- Google OAuth integration
- Automatic profile creation on signup
- Role-based access control (customer, merchant, admin)

### Deal Management
- Automatic discount percentage calculation
- Deal status workflow (pending → approved/rejected)
- Automatic deal expiry handling
- View and save tracking
- Deal feedback system

### Search & Filtering
- Search by title, description, or merchant
- Filter by category
- Sort by newest, highest discount, or ending soon
- Location-based filtering

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Merchants can only manage their own deals
- Admins have elevated permissions
- Secure authentication flow

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Design Principles

- Clean, modern design with professional color scheme
- Responsive across all devices
- Clear visual hierarchy
- Intuitive navigation
- Accessible and user-friendly
- Fast and performant

## Future Enhancements

- Email/SMS notifications for new deals
- Deal claim tracking
- Advanced analytics for merchants
- Deal categories with icons
- Image upload functionality
- Location-based deal discovery
- Deal sharing functionality
- Merchant verification badges
- Customer reviews and ratings
- Deal recommendations
