# Authentication & Role-Based Access Control

This document describes the authentication system and role-based access control implementation in the Inexss CRM application.

## Overview

The authentication system is built on top of Supabase Auth and provides:
- User registration and login
- Role-based access control (RBAC)
- Protected routes
- User profile management
- Session persistence

## User Roles

The system supports five distinct user roles:

### 1. Admin (Owner)
- **Role Code**: `admin`
- **Access**: Full access to all features and data
- **Use Case**: Janine (business owner)
- **Permissions**:
  - Manage all users
  - Access all projects across all locations
  - Manage brands and suppliers
  - Access all CRM modules

### 2. Staff
- **Role Code**: `staff`
- **Access**: Regional access based on location
- **Locations**: JHB, Cape Town, Durban, Other
- **Use Case**: Regional staff members
- **Permissions**:
  - View/edit projects in their assigned location only
  - Manage contacts and leads in their region
  - Access tasks and events
  - Cannot manage users

### 3. Contractor (Architect)
- **Role Code**: `contractor`
- **Access**: Limited to their own projects
- **Use Case**: External architects and contractors
- **Permissions**:
  - View only projects linked to their contact_id
  - Upload drawings and documents
  - Comment on specifications
  - Approve/reject specifications
  - Cannot see other architects' projects

### 4. Brand Representative
- **Role Code**: `brand_representative`
- **Access**: Limited to their assigned brands
- **Use Case**: Brand company representatives
- **Permissions**:
  - View brands they represent
  - Upload brochures and product catalogs
  - View projects using their brands
  - Cannot access other brands' data

### 5. Supplier
- **Role Code**: `supplier`
- **Access**: Limited to their products/brands
- **Use Case**: Product suppliers
- **Permissions**:
  - View their brands and products
  - Upload product documentation
  - View projects using their products
  - Cannot access competitor data

## Architecture

### Components

#### 1. AuthContext (`src/contexts/AuthContext.jsx`)
Manages global authentication state:
- Current user
- User profile (from public.users table)
- Loading state
- Authentication status

#### 2. useAuth Hook (`src/hooks/useAuth.js`)
Provides access to authentication state and methods:
```javascript
const { 
  user,           // Supabase auth user
  userProfile,    // Extended user profile from public.users
  loading,        // Loading state
  isAuthenticated, // Boolean auth status
  signUp,         // Sign up method
  signIn,         // Sign in method
  signOut         // Sign out method
} = useAuth();
```

#### 3. usePermissions Hook (`src/hooks/usePermissions.js`)
Provides role-based permission checking:
```javascript
const {
  isAdmin,
  isStaff,
  isBrandRep,
  isContractor,
  isSupplier,
  canAccessAllProjects,
  canManageUsers,
  canManageBrands,
  // ... more permission methods
} = usePermissions();
```

#### 4. ProtectedRoute Component (`src/components/ProtectedRoute.jsx`)
Wraps routes that require authentication:
```javascript
<ProtectedRoute allowedRoles={['admin', 'staff']}>
  <YourComponent />
</ProtectedRoute>
```

## Authentication Flow

### Sign Up Flow
1. User fills signup form with name, email, password, role, location
2. `authService.signUp()` creates auth.users record
3. Supabase trigger automatically creates public.users record
4. User profile is fetched and stored in AuthContext
5. User is redirected to dashboard

### Sign In Flow
1. User enters email and password
2. `authService.signIn()` authenticates with Supabase
3. Last login timestamp is updated
4. User profile is fetched from public.users
5. User is redirected to intended page (or dashboard)

### Sign Out Flow
1. User clicks "Sign Out" button
2. `authService.signOut()` ends Supabase session
3. Auth state is cleared
4. User is redirected to login page

## Usage Examples

### Check User Role
```javascript
import { usePermissions } from '../hooks';

function MyComponent() {
  const { isAdmin, isStaff } = usePermissions();
  
  return (
    <div>
      {isAdmin() && <AdminPanel />}
      {isStaff() && <StaffPanel />}
    </div>
  );
}
```

### Check Specific Permission
```javascript
import { usePermissions } from '../hooks';

function ProjectList() {
  const { canAccessAllProjects } = usePermissions();
  
  if (canAccessAllProjects()) {
    return <AllProjectsList />;
  }
  
  return <RegionalProjectsList />;
}
```

## Environment Setup

Add these variables to your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Security Best Practices

1. **Never expose service_role key** - Use only anon key in frontend
2. **Validate on backend** - Always verify permissions on Supabase/backend
3. **Use RLS policies** - Database-level security as last line of defense
4. **Secure sensitive data** - Encrypt passwords, use HTTPS
5. **Session management** - Supabase handles session tokens securely

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [React Context API](https://react.dev/reference/react/useContext)
