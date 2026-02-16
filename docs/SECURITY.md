# Security Considerations

## Authentication & Authorization Security

### Overview
This document outlines the security model for the Inexss CRM application and important considerations for production deployment.

## Current Security Model

### Client-Side Protection (Current Implementation)
The current implementation provides **UI-level** security through:
- Protected routes that redirect unauthenticated users
- Role-based navigation filtering
- Permission checks in components

**⚠️ Important**: This is NOT sufficient for production security. It only controls what users see in the UI, not what they can access via API calls.

### Database-Level Protection (Required for Production)

#### Row Level Security (RLS)
The Supabase database includes RLS policies, but they need to be enhanced for production:

**Current State**:
- ✅ Users can only view/edit their own profile
- ✅ Authenticated users can access most tables
- ⚠️ No role-based filtering at database level yet

**Required Enhancements**:
```sql
-- Example: Staff can only see projects in their location
CREATE POLICY "Staff can view regional projects" ON projects
  FOR SELECT 
  USING (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE role = 'admin'
    )
    OR
    (
      auth.uid() IN (
        SELECT id FROM users 
        WHERE role = 'staff' AND location = projects.location_province
      )
    )
  );

-- Example: Contractors can only see their own projects
CREATE POLICY "Contractors can view own projects" ON projects
  FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email = (SELECT email FROM users WHERE id = auth.uid())
    )
  );
```

## Known Security Risks & Mitigations

### 1. Self-Service Role Assignment

**Risk**: Users can select any role during signup, including 'admin'.

**Current Mitigation**: 
- UI defaults to 'staff' role
- Documentation warns about the risk

**Production Solutions** (choose one):
1. **Default Role Only**: Remove role selection from signup
   ```javascript
   role: ROLES.STAFF, // Always staff
   ```

2. **Invitation System**: Admins send invitations with pre-assigned roles
   ```javascript
   // Only allow signup with valid invitation token
   const invitation = await validateInvitationToken(token);
   role: invitation.role
   ```

3. **Approval Workflow**: New accounts start inactive until admin approves
   ```javascript
   is_active: false, // Require admin activation
   ```

4. **Email Domain Verification**: Auto-assign roles based on email domain
   ```javascript
   role: email.endsWith('@inexss.co.za') ? ROLES.STAFF : ROLES.CONTRACTOR
   ```

### 2. Frontend-Only Authorization

**Risk**: Role checks in frontend can be bypassed with browser dev tools.

**Mitigation Required**:
- Implement RLS policies for all sensitive tables
- Add role checks in Supabase Edge Functions
- Use service_role key only on backend

**Example Edge Function**:
```javascript
// Secure API endpoint
export async function handler(req) {
  const user = await getUser(req);
  
  // Server-side role check
  if (user.role !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }
  
  // Safe to proceed
  return adminOperation();
}
```

### 3. Password Security

**Current State**: ✅ Handled by Supabase Auth
- Passwords are hashed with bcrypt
- Never stored in plain text
- Minimum 6 characters enforced

**Recommendations**:
- Increase minimum to 8+ characters
- Add password strength requirements
- Implement 2FA for admin accounts

### 4. Session Management

**Current State**: ✅ Handled by Supabase Auth
- JWT tokens stored in httpOnly cookies
- Automatic token refresh
- Secure session handling

**Recommendations**:
- Implement session timeout (e.g., 7 days)
- Add "remember me" with longer expiry
- Force re-authentication for sensitive operations

## Production Deployment Checklist

### Before Going Live:

#### Environment Variables
- [ ] Use production Supabase project
- [ ] Rotate all API keys
- [ ] Never commit .env files
- [ ] Use proper secrets management (Vercel, etc.)

#### Database Security
- [ ] Implement RLS policies for all tables
- [ ] Test RLS policies with different roles
- [ ] Enable SSL for all database connections
- [ ] Set up database backups
- [ ] Review and minimize service_role key usage

#### Authentication
- [ ] Remove or restrict role selection on signup
- [ ] Implement email verification
- [ ] Set up password reset flow
- [ ] Configure proper redirect URLs
- [ ] Add rate limiting on auth endpoints

#### Authorization
- [ ] Add role checks to all Edge Functions
- [ ] Implement audit logging
- [ ] Test permission boundaries
- [ ] Document role requirements for each endpoint

#### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor failed auth attempts
- [ ] Log security events
- [ ] Set up alerts for suspicious activity

## Security Testing

### Test Cases:

1. **Unauthenticated Access**
   - Try accessing protected routes without login
   - Verify redirect to login page
   - Check API calls are blocked

2. **Role Escalation**
   - Create staff account
   - Try accessing admin-only features
   - Verify proper rejection

3. **Data Isolation**
   - Staff A (JHB) tries to access Staff B (CPT) data
   - Verify regional filtering works
   - Test with direct API calls

4. **Session Security**
   - Test token expiration
   - Try reusing old tokens
   - Check logout properly invalidates tokens

## Incident Response

### If Security Breach Detected:

1. **Immediate Actions**:
   - Revoke all active sessions
   - Rotate API keys
   - Review access logs
   - Notify affected users

2. **Investigation**:
   - Identify attack vector
   - Assess data exposure
   - Document timeline

3. **Remediation**:
   - Patch vulnerability
   - Update security policies
   - Improve monitoring

4. **Prevention**:
   - Conduct security audit
   - Update documentation
   - Train team on security

## Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/security-practices)

## Contact

For security concerns or to report vulnerabilities, contact:
- Security team: security@inexss.co.za
- Emergency: Use private disclosure channel

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update security measures as the application evolves.
