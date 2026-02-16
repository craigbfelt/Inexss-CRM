import { useAuth } from '../contexts/AuthContext';

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  BRAND_REP: 'brand_representative',
  CONTRACTOR: 'contractor',
  SUPPLIER: 'supplier',
};

// Location definitions
export const LOCATIONS = {
  JHB: 'JHB',
  CAPE_TOWN: 'Cape Town',
  DURBAN: 'Durban',
  OTHER: 'Other',
};

export function usePermissions() {
  const { userProfile } = useAuth();

  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(userProfile?.role);
  };

  const hasLocation = (location) => {
    return userProfile?.location === location;
  };

  const isAdmin = () => hasRole(ROLES.ADMIN);
  const isStaff = () => hasRole(ROLES.STAFF);
  const isBrandRep = () => hasRole(ROLES.BRAND_REP);
  const isContractor = () => hasRole(ROLES.CONTRACTOR);
  const isSupplier = () => hasRole(ROLES.SUPPLIER);

  const canAccessAllProjects = () => isAdmin();
  
  const canAccessRegionalProjects = (location) => {
    return isAdmin() || (isStaff() && hasLocation(location));
  };

  const canManageUsers = () => isAdmin();
  
  const canManageBrands = () => {
    return isAdmin() || isStaff();
  };

  const canViewBrands = () => {
    return hasAnyRole([ROLES.ADMIN, ROLES.STAFF, ROLES.BRAND_REP, ROLES.SUPPLIER]);
  };

  const canManageProjects = () => {
    return hasAnyRole([ROLES.ADMIN, ROLES.STAFF]);
  };

  const canViewOwnProjects = () => {
    return hasAnyRole([ROLES.CONTRACTOR, ROLES.BRAND_REP]);
  };

  return {
    hasRole,
    hasAnyRole,
    hasLocation,
    isAdmin,
    isStaff,
    isBrandRep,
    isContractor,
    isSupplier,
    canAccessAllProjects,
    canAccessRegionalProjects,
    canManageUsers,
    canManageBrands,
    canViewBrands,
    canManageProjects,
    canViewOwnProjects,
    userProfile,
  };
}
