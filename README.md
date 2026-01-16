# Multi-Tenant Sales Dashboard

A modern, clean SaaS dashboard for managing leads and call logs across multiple tenants with dark/light theme support. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Features

- **Multi-Tenant Architecture**: Isolated data per tenant with seamless tenant switching
- **Role-Based Access Control**: Admin and Agent roles with appropriate permissions
- **Dark/Light Theme**: Complete theme support with system preference detection
- **Leads Management**: Create, filter, and track leads by status
- **Call Logs Tracking**: Record and monitor calls with duration and outcomes
- **Real-time Dashboard**: Display key metrics and activity logs
- **Responsive Design**: Mobile-first, fully responsive UI
- **Settings Management**: Admin panel for tenant configuration

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: React Context API
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode
- **Forms**: React Hook Form + Zod validation

## Project Structure

```
app/
├── page.tsx                 # Dashboard home page
├── leads/
│   ├── page.tsx            # Leads management page
│   └── loading.tsx         # Loading skeleton
├── calls/
│   └── page.tsx            # Call logs page
├── settings/
│   └── page.tsx            # Admin settings
├── layout.tsx              # Root layout with providers
└── globals.css             # Global styles & design tokens

components/
├── dashboard-header.tsx    # Top navigation bar
├── sidebar-nav.tsx         # Left sidebar navigation
├── theme-toggle.tsx        # Dark/light mode switcher
├── tenant-switcher.tsx     # Multi-tenant switcher
├── leads-table.tsx         # Leads data table
├── call-logs-table.tsx     # Call logs data table
├── theme-provider.tsx      # Next-themes provider
└── ui/                     # shadcn/ui components

lib/
├── auth-context.tsx        # Authentication context
├── mock-data.ts            # Mock data for development
├── types.ts                # TypeScript interfaces
└── utils.ts                # Utility functions

styles/
└── globals.css             # Additional global styles
```

## Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

### Installation Steps

#### 1. Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd my-v0-project
```

#### 2. Install Dependencies

Install all required packages:
```bash
npm install
# or
yarn install
```

This will install Next.js, React, TypeScript, Tailwind CSS, shadcn/ui components, and all other dependencies listed in `package.json`.

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory (optional for development):
```bash
# .env.local
# Add any environment variables here if needed
NEXT_PUBLIC_APP_NAME=Sales Dashboard
```

#### 4. Run the Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at: **http://localhost:3000**

### Using the Application

#### Default Login Credentials

The app uses mock authentication for demonstration:

**Admin User:**
- Email: `admin@tenant1.com`
- Password: Any value (mock auth)
- Can access all features and settings

**Agent User:**
- Email: `agent@tenant1.com`
- Password: Any value (mock auth)
- Limited to assigned leads and calls

#### Navigation

- **Dashboard**: Main overview with key metrics
- **Leads**: Manage and track all leads, filter by status
- **Calls**: View call logs, duration, and outcomes
- **Settings**: Admin-only panel for tenant management
- **Theme Toggle**: Switch between dark and light modes (top right)
- **Tenant Switcher**: Switch between tenants (top right)

### Build for Production

#### 1. Build the Application

```bash
npm run build
```

This creates an optimized production build.

#### 2. Start Production Server

```bash
npm run start
```

The app will be available at: **http://localhost:3000**

### Deployment Options

#### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and select your repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

#### Deploy to Other Platforms

- **Docker**: Create a Dockerfile for containerization
- **AWS/Google Cloud**: Use their Node.js deployment services
- **DigitalOcean/Heroku**: Standard Node.js deployment process

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Data Model

### User
```typescript
{
  id: string
  name: string
  email: string
  role: "admin" | "agent"
  tenantId: string
}
```

### Tenant
```typescript
{
  id: string
  name: string
  slug: string
}
```

### Lead
```typescript
{
  id: string
  name: string
  phone: string
  email?: string
  status: "new" | "contacted" | "qualified" | "proposal" | "closed"
  tenantId: string
  createdAt: Date
}
```

### CallLog
```typescript
{
  id: string
  leadId: string
  leadName: string
  date: Date
  duration: number // in seconds
  outcome: "completed" | "no-answer" | "voicemail" | "scheduled"
  notes?: string
  tenantId: string
}
```

## Theme Customization

Edit `app/globals.css` to customize colors:

```css
@theme inline {
  --color-background: #ffffff;
  --color-foreground: #000000;
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-muted: #6b7280;
  /* ... more tokens ... */
}
```

## Troubleshooting

### Blank Screen on Load

If you see a blank screen:
1. Check browser console for errors
2. Ensure all dependencies are installed: `npm install`
3. Clear cache and restart: `npm run dev`

### Port 3000 Already in Use

```bash
npm run dev -- -p 3001
```

### Theme Not Changing

- Clear browser localStorage
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Mock Data Not Showing

The mock data is loaded automatically. Check that:
- You're logged in with a valid user
- The current tenant is selected
- Browser console shows no errors

## Development Tips

- **Hot Reload**: Changes to files are reflected instantly during development
- **Inspect Elements**: Use browser DevTools to inspect components
- **Mock Data**: Edit `lib/mock-data.ts` to modify demo data
- **Add Real Auth**: Replace `lib/auth-context.tsx` with your auth provider
- **Database Integration**: Connect to a real database by replacing mock data queries

## Next Steps

1. **Add Backend Database**: Replace mock data with real database queries
2. **Implement Real Authentication**: Integrate Auth0, Supabase, or your auth provider
3. **Add User Input Forms**: Create forms for adding/editing leads and calls
4. **Email Notifications**: Add notifications for important events
5. **Export to CSV**: Add functionality to export reports
6. **Advanced Filtering**: Implement date ranges, custom filters

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com
- **TypeScript**: https://typescriptlang.org

## License

This project is open source and available under the MIT License.
