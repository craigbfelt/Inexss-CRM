# Inexss CRM

A comprehensive, visually stunning CRM system designed specifically for Inexx Specialised Solutions - a building specification company working with architects on construction projects.

## 🌟 Features

### For All Users
- **Beautiful, Modern UI**: Vibrant gradients, smooth animations, and professional design
- **Role-Based Access**: Secure authentication with different permission levels
- **Dashboard Overview**: Real-time statistics and activity tracking
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### For Admin & Staff
- **Client Management**: Track architects, developers, and contractors
- **Brand Management**: Manage 15+ brand/principal relationships
- **Meeting Tracking**: Record meetings with multiple brands discussed per session
- **Project Tracking**: Monitor building projects from lead to completion
- **Monthly Reporting**: Generate detailed reports with filtering and analytics
- **Team Management**: Coordinate teams across JHB, Cape Town, and Durban

### For Brand Representatives
- **Brand-Specific Dashboard**: View only meetings and projects for assigned brands
- **Performance Metrics**: See hit rates and brand requirement statistics
- **Activity Reports**: Filter data specific to their brand

### For Contractors
- **Read-Only Access**: View clients and projects they're involved with
- **Meeting History**: See their own meeting records
- **Project Tracking**: Monitor projects they're working on

### For Suppliers
- **Brand-Filtered View**: Access information for their supplied brands only
- **Project Visibility**: See projects using their products
- **Restricted Access**: Read-only access to maintain data integrity

## 🎨 Design Highlights

- **Vibrant Color Palette**: Eye-catching gradients and color schemes
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Glass Morphism**: Modern UI effects with backdrop blur
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Custom Scrollbars**: Styled scrollbars matching the design theme
- **Gradient Text**: Beautiful text effects with color gradients

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for beautiful icons
- **Recharts** for data visualization
- **Axios** for API communication
- **date-fns** for date handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/craigbfelt/Inexss-CRM.git
   cd Inexss-CRM
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `PORT`: Backend server port (default: 5000)

5. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use a cloud service like MongoDB Atlas

## 🎯 Running the Application

### Development Mode

**Option 1: Run both servers concurrently**
```bash
# Terminal 1 - Start backend
npm run dev

# Terminal 2 - Start frontend
npm run client
```

**Option 2: Quick start**
```bash
# Install all dependencies
npm run install-all

# Start backend
npm run dev
```

Then in another terminal:
```bash
cd client
npm start
```

The application will open at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## 👥 User Roles

### Admin
- Full access to all features
- Can create and manage all entities
- User management capabilities
- Access to all reports and analytics

### Staff
- Create and edit clients, meetings, projects
- Access to all brands
- Generate reports
- Coordinate across locations

### Brand Representative
- View meetings mentioning their assigned brand(s)
- See projects involving their brand(s)
- Generate brand-specific reports
- Limited editing capabilities

### Contractor
- View clients and projects they're involved with
- See their own meeting history
- Read-only access to most data
- Cannot create or delete records

### Supplier
- View information for their supplied brand(s) only
- See projects using their products
- Access brand-specific reports
- Read-only access to maintain data integrity

## 📊 Data Models

### User
- Name, email, password
- Role (admin, staff, brand_representative, contractor, supplier)
- Location (JHB, Cape Town, Durban, Other)
- Brand access (for restricted roles)

### Brand/Principal
- Name, description, category
- Contact information
- Website and notes

### Client
- Name, company, type (Architect, Developer, Contractor)
- Contact details
- Address information

### Meeting
- Client reference
- Meeting date and location
- Multiple brands discussed (with requirement status)
- Summary and action items
- Follow-up dates

### Project
- Name, project number
- Client reference
- Location and description
- Status (Lead, Quoted, In Progress, etc.)
- Brands involved
- Estimated value and dates

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization middleware
- Protected API routes
- Input validation and sanitization
- Secure session management

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Brands
- `GET /api/brands` - List all brands
- `POST /api/brands` - Create brand (admin only)
- `GET /api/brands/:id` - Get brand details
- `PUT /api/brands/:id` - Update brand (admin only)
- `DELETE /api/brands/:id` - Delete brand (admin only)

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Meetings
- `GET /api/meetings` - List meetings (filtered by role)
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `GET /api/meetings/report/monthly` - Generate monthly report

### Projects
- `GET /api/projects` - List projects (filtered by role)
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🎨 Customization

### Colors
Edit `/client/src/index.css` to change the color scheme:
```css
:root {
  --primary: #6366f1;
  --secondary: #ec4899;
  --accent: #f59e0b;
  /* ... more variables */
}
```

### Branding
Update the logo and company name in:
- `/client/src/pages/Login.js`
- `/client/src/pages/Dashboard.js`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### Port Already in Use
- Change the PORT in `.env`
- Or stop the process using the port:
  ```bash
  # Find process
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

### Build Errors
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules client/node_modules
  npm install
  cd client && npm install
  ```

## 📝 License

MIT License - feel free to use this project for your organization.

## 👨‍💻 Author

Craig Felt

## 🙏 Acknowledgments

Built for Janine Course and the Inexx Specialised Solutions team to streamline their business operations and client relationship management.

---

**Note**: This is a custom-built CRM solution tailored specifically for the building specification industry and multi-brand representation business model.

