# Security Best Practices - Inexss CRM

This document outlines the security measures implemented in the Inexss CRM and additional recommendations for production deployment.

## Implemented Security Features

### 1. Authentication & Authorization

#### JWT Token Security
- ✅ JWT secret validation on application startup (fails in production if not set)
- ✅ Token expiration set to 7 days
- ✅ Tokens stored securely in browser localStorage
- ✅ Authorization header used for API requests

#### Password Security
- ✅ Passwords hashed with bcrypt (salt rounds: 10)
- ✅ Minimum password length: 8 characters
- ✅ Password validation enforced at model and controller level
- ✅ Password change functionality with current password verification
- ⚠️ **TODO**: Add password complexity requirements (uppercase, lowercase, numbers, special chars)

#### Email Validation
- ✅ Email format validation using regex
- ✅ Unique email constraint in database
- ✅ Lowercase normalization

#### Role-Based Access Control
- ✅ Five user roles: admin, staff, brand_representative, contractor, supplier
- ✅ Self-registration restricted to 'staff' role only
- ✅ Protected routes with role-specific middleware
- ✅ Data filtering based on user role and brand access

### 2. API Security

#### CORS Configuration
- ✅ Production: Restricted to CLIENT_URL environment variable
- ✅ Development: Open for local development
- ✅ Configurable per environment

#### Input Validation
- ✅ Required field validation
- ✅ Email format validation
- ✅ Date range validation for reports (year: 2000-2100, month: 1-12)
- ✅ Password strength validation
- ⚠️ **TODO**: Add comprehensive input sanitization
- ⚠️ **TODO**: Implement express-validator for all endpoints

#### Error Handling
- ✅ Sensitive error details hidden in production
- ✅ Generic error messages for users
- ✅ Detailed errors only in development mode
- ✅ All errors logged server-side

### 3. Database Security

#### MongoDB Best Practices
- ✅ Mongoose schema validation
- ✅ Unique constraints on sensitive fields
- ✅ Proper ObjectId handling and comparison
- ✅ Connection string stored in environment variables
- ⚠️ **TODO**: Enable MongoDB authentication
- ⚠️ **TODO**: Use MongoDB Atlas with IP whitelist in production

### 4. Data Protection

#### Sensitive Data Handling
- ✅ Passwords never returned in API responses
- ✅ User lookup excludes password field by default
- ✅ Brand representatives see only their assigned brands
- ✅ Contractors see only their own data
- ✅ Suppliers see only brand-specific data

## Additional Recommendations for Production

### 1. Rate Limiting (Not Yet Implemented)

Add rate limiting to prevent brute-force attacks:

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 2. HTTPS/SSL

- Use HTTPS in production (Let's Encrypt for free SSL)
- Redirect all HTTP traffic to HTTPS
- Set secure cookie flags
- Enable HSTS headers

### 3. Environment Variables

Never commit sensitive data:
```bash
# Required in production
JWT_SECRET=<strong-random-string>
MONGODB_URI=<connection-string-with-auth>
CLIENT_URL=https://your-domain.com
NODE_ENV=production

# Optional but recommended
SESSION_SECRET=<another-random-string>
COOKIE_SECRET=<another-random-string>
```

Generate strong secrets:
```bash
openssl rand -base64 32
```

### 4. MongoDB Security

Enable authentication:
```bash
# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Create app user
use inexss-crm
db.createUser({
  user: "inexss_app",
  pwd: "strong-password",
  roles: ["readWrite"]
})
```

Update connection string:
```
mongodb://inexss_app:password@localhost:27017/inexss-crm?authSource=inexss-crm
```

### 5. Security Headers

Add helmet middleware:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 6. Input Sanitization

Add express-validator:
```javascript
const { body, validationResult } = require('express-validator');

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').trim().escape(),
  authController.register
);
```

### 7. Session Management

Implement refresh tokens for better security:
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Refresh token rotation
- Revocation capability

### 8. Audit Logging

Log security-relevant events:
- Failed login attempts
- Password changes
- Role changes
- Data deletions
- API errors

### 9. Backup Strategy

Automated backups:
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --uri="mongodb://localhost:27017/inexss-crm" --out=/backups/$DATE
# Upload to S3 or secure storage
```

### 10. Dependency Security

Regular security updates:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

## Security Checklist for Production

Before going live:

### Application Security
- [ ] JWT_SECRET is set and strong (32+ random characters)
- [ ] All environment variables are configured
- [ ] HTTPS is enabled
- [ ] CORS is restricted to production domain
- [ ] Error messages don't expose sensitive information
- [ ] Rate limiting is enabled on auth endpoints
- [ ] Helmet.js security headers are enabled
- [ ] Input validation is comprehensive
- [ ] Password complexity requirements are enforced

### Database Security
- [ ] MongoDB authentication is enabled
- [ ] Database user has minimal required permissions
- [ ] Connection string uses authentication
- [ ] MongoDB is not exposed to the internet (or IP whitelisted)
- [ ] Regular backups are configured
- [ ] Backup restoration has been tested

### Infrastructure Security
- [ ] Server firewall is configured (only ports 22, 80, 443 open)
- [ ] SSH key authentication is used (password auth disabled)
- [ ] Server packages are up to date
- [ ] Monitoring and alerting is configured
- [ ] Log rotation is configured
- [ ] Intrusion detection is enabled

### Access Control
- [ ] Default admin account password has been changed
- [ ] User roles are properly assigned
- [ ] Brand representatives have correct brand access
- [ ] Contractors and suppliers have read-only access verified
- [ ] Test accounts have been removed

### Code Security
- [ ] Dependencies are up to date
- [ ] npm audit shows no vulnerabilities
- [ ] Sensitive data is not in git history
- [ ] .env file is in .gitignore
- [ ] API keys are rotated if exposed

## Incident Response Plan

If a security issue is discovered:

1. **Assess**: Determine the scope and severity
2. **Contain**: Temporarily disable affected functionality
3. **Investigate**: Review logs and identify root cause
4. **Fix**: Deploy security patch
5. **Notify**: Inform affected users if necessary
6. **Learn**: Document and prevent future occurrences

## Security Contacts

- Security Issues: security@inexss.co.za
- System Administrator: admin@inexss.co.za
- Emergency: Contact Janine Course directly

## Regular Security Tasks

### Daily
- Monitor error logs for anomalies
- Check for failed login attempts
- Review system resource usage

### Weekly
- Review new user registrations
- Check for outdated dependencies
- Verify backup success

### Monthly
- Update dependencies
- Review user access levels
- Audit system logs
- Test backup restoration
- Review security logs

### Quarterly
- Full security audit
- Penetration testing
- Password rotation for service accounts
- Review and update security policies

## Compliance Notes

While not currently regulated, consider:
- GDPR compliance (if handling EU data)
- POPIA compliance (South African data protection)
- Data retention policies
- User consent for data collection
- Right to be forgotten implementation

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Remember**: Security is an ongoing process, not a one-time task. Regular reviews and updates are essential.

Last Updated: January 2026
