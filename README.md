# Inexss CRM

A modern CRM system built with React, Vite, Tailwind CSS, and Supabase.

## Project Structure

```
├── src/
│   ├── lib/          # Shared libraries and utilities (e.g., Supabase client)
│   ├── services/     # API services and data fetching logic
│   ├── hooks/        # Custom React hooks
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── layout/       # Layout components
│   ├── App.jsx       # Main application component
│   ├── main.jsx      # Application entry point
│   └── index.css     # Global styles with Tailwind directives
├── supabase/         # Supabase database schemas and migrations
├── index.html        # HTML entry point
├── package.json      # Dependencies and scripts
├── vite.config.js    # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── postcss.config.js # PostCSS configuration
└── vercel.json       # Vercel deployment configuration
```

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Inexss-CRM
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials from https://app.supabase.com

```bash
cp .env.example .env
```

### Development

Run the development server:

```bash
npm run dev
```

The application will open at http://localhost:3000

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

### Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (authentication, database)
- **Vercel** - Deployment platform

## License

MIT
