# Inexss CRM

A premium Apple-style CRM system built with React, featuring frosted glass effects, smooth animations, and beautiful gradients.

![Dashboard Preview](https://github.com/user-attachments/assets/33155727-6f4d-43d1-8d31-ccba738b6240)

## ✨ Features

### 🎨 Apple-style Design Language
- **Frosted Glass Effects** - Translucent components with backdrop blur
- **Soft Gradients** - Beautiful gradient backgrounds and buttons
- **Depth Shadows** - Multi-layered shadows for depth perception
- **Rounded Corners** - Consistent border radius (xl, 2xl, 3xl)
- **Smooth Animations** - Powered by Framer Motion
- **Clean Typography** - Inter font family
- **Vibrant Colors** - Apple-inspired accent colors

### 🏗️ Complete CRM Structure
- **Dashboard** - KPIs, charts, and activity timeline
- **Contacts** - Full CRUD operations with search and sorting
- **Leads** - Track and convert sales leads (placeholder)
- **Projects** - Manage deliverables (placeholder)
- **Tasks** - Stay organized (placeholder)
- **Events** - Track important events (placeholder)
- **Calendar** - Schedule appointments (placeholder)
- **Settings** - Configure preferences (placeholder)

### 🛠️ Technical Features
- React Router for navigation
- React Query for data management
- Supabase for backend
- Recharts for data visualization
- Lucide React for icons
- Fully responsive mobile layout

## 🚀 Project Structure

```
├── src/
│   ├── lib/          # Supabase client and utilities
│   ├── layout/       # Sidebar, Topbar, MainLayout
│   ├── components/   # Reusable UI components
│   │   ├── Card.jsx           # Card with gradient variants
│   │   ├── Button.jsx         # Button with multiple styles
│   │   ├── Input.jsx          # Input, Select, Textarea
│   │   ├── Modal.jsx          # Modal with backdrop blur
│   │   ├── Table.jsx          # Sortable table
│   │   └── Loading.jsx        # Loading spinner
│   ├── services/     # API services for CRUD operations
│   ├── hooks/        # React Query hooks
│   ├── pages/        # Page components
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Contacts.jsx       # Contacts module
│   │   └── ...                # Other modules
│   ├── App.jsx       # Main application with routing
│   ├── main.jsx      # Application entry point
│   └── index.css     # Global styles with Tailwind
├── tailwind.config.js # Custom Tailwind configuration
├── vite.config.js    # Vite configuration
└── vercel.json       # Vercel deployment configuration
```

## 📦 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm or yarn
- A Supabase account and project

### Quick Setup

⚠️ **Important**: Before running the application, you must set up Supabase authentication and database.

**👉 See [supabase/SETUP_GUIDE.md](supabase/SETUP_GUIDE.md) for complete setup instructions.**

The setup guide covers:
- Creating and configuring Supabase project
- Setting up database schema and migrations
- Creating admin user (craig@zerobitone.co.za)
- Fixing login and registration issues
- Troubleshooting common problems

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
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**📖 For detailed setup instructions, see [supabase/SETUP_GUIDE.md](supabase/SETUP_GUIDE.md)**

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

### Linting

Run ESLint:

```bash
npm run lint
```

## 🎯 Usage

### Dashboard
View your CRM metrics at a glance with KPI cards, revenue trends, weekly leads, project status, and recent activity.

### Contacts Management
- **Add New Contacts** - Click the "Add Contact" button
- **Search & Filter** - Use the search bar to find contacts
- **Sort** - Click column headers to sort
- **Edit** - Click the edit icon on any contact
- **Delete** - Click the trash icon to remove

### Styling Guidelines

The application uses a consistent Apple-style design language:

```jsx
// Frosted glass card
<Card gradient hover>
  {/* Content */}
</Card>

// Primary button with gradient
<Button variant="primary">
  Save Changes
</Button>

// Input with focus states
<Input 
  label="Email"
  placeholder="john@example.com"
/>

// Modal with backdrop blur
<Modal isOpen={isOpen} onClose={onClose} title="Add Contact">
  {/* Modal content */}
</Modal>
```

## 🗄️ Database Schema

Create the following table in your Supabase project:

```sql
create table contacts (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text,
  company text,
  position text,
  address text
);
```

## 🚢 Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **Supabase** - Backend as a Service

## 📸 Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/33155727-6f4d-43d1-8d31-ccba738b6240)

### Contacts Page
![Contacts](https://github.com/user-attachments/assets/9919bcc1-0d77-49ef-a323-c3aeeda85c9d)

### Add Contact Modal
![Modal](https://github.com/user-attachments/assets/4783a0f4-f643-4f85-b885-c2c4c9613f91)

### Placeholder Module
![Leads](https://github.com/user-attachments/assets/745f8570-5d89-40ee-bc9b-644b4f14e351)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Craig Felt
