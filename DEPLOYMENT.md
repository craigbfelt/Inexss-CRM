# Deployment Guide - Inexss CRM

This guide provides detailed instructions for deploying the Inexss CRM application to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Production Deployment Options](#production-deployment-options)
- [MongoDB Setup](#mongodb-setup)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:
- Node.js v14+ installed
- MongoDB database (local or cloud)
- Git installed
- A hosting platform account (Heroku, DigitalOcean, AWS, etc.)

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/craigbfelt/Inexss-CRM.git
cd Inexss-CRM
npm install
cd client && npm install && cd ..
```

### 2. Configure Environment

Create `.env` file in the root directory:

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inexss-crm
JWT_SECRET=your-super-secret-key-change-this
CLIENT_URL=http://localhost:3000
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Access the application at `http://localhost:3000`

## Production Deployment Options

### Option 1: Vercel Deployment (Frontend Only)

Vercel is a great option for deploying the React frontend. Note that this deploys only the client-side application - you'll need to deploy the backend separately (see other options).

#### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel

#### Configuration

The repository includes a `vercel.json` file that configures Vercel to:
- Build the React app from the `client` directory
- Use `@vercel/static-build` builder
- Output to the `client/build` directory
- Route all requests to `index.html` for client-side routing

#### Deployment Steps

1. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

2. **Configure Environment Variables** (if needed)
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add any required environment variables for the React app
   - Example: `REACT_APP_API_URL=https://your-backend-api.com`

3. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Your app will be available at `https://your-project.vercel.app`

4. **Deploy Backend Separately**
   - The backend (Express server) needs to be deployed to a platform like Heroku, DigitalOcean, or AWS
   - See options below for backend deployment
   - Update the React app's API URL to point to your deployed backend

#### Important Notes

- The `vercel.json` configures Vercel to build the Next.js app from the `client` directory
- Next.js handles routing automatically
- This configuration deploys only the frontend - the backend must be deployed separately

#### Troubleshooting Vercel Deployment

If you encounter issues:
- Ensure the `vercel.json` file is present in the root directory
- Check that the build succeeds locally: `cd client && npm run build`
- Review build logs in the Vercel dashboard
- Verify environment variables are set correctly

### Option 2: Heroku Deployment

#### Step 1: Prepare Application

1. **Create Heroku Account**: Sign up at https://heroku.com

2. **Install Heroku CLI**:
```bash
# Mac
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

3. **Login to Heroku**:
```bash
heroku login
```

#### Step 2: Create Heroku App

```bash
# Create new app
heroku create inexss-crm

# Add MongoDB addon
heroku addons:create mongodb:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
```

#### Step 3: Update package.json

Add to root `package.json`:
```json
{
  "scripts": {
    "start": "node server/index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

#### Step 4: Update server/index.js

Add static file serving:
```javascript
const path = require('path');

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

#### Step 5: Deploy

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

#### Step 6: Open Application

```bash
heroku open
```

### Option 3: DigitalOcean Deployment

#### Step 1: Create Droplet

1. Sign up at https://digitalocean.com
2. Create a new Droplet (Ubuntu 22.04 LTS)
3. Choose at least 2GB RAM
4. Add SSH key

#### Step 2: Connect to Server

```bash
ssh root@your-droplet-ip
```

#### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

#### Step 4: Clone and Setup Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/craigbfelt/Inexss-CRM.git
cd Inexss-CRM

# Install dependencies
npm install
cd client && npm install && npm run build && cd ..

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inexss-crm
JWT_SECRET=$(openssl rand -base64 32)
CLIENT_URL=https://your-domain.com
EOF
```

#### Step 5: Configure PM2

```bash
# Start application with PM2
pm2 start server/index.js --name inexss-crm

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Step 6: Configure Nginx

```bash
cat > /etc/nginx/sites-available/inexss-crm << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/inexss-crm /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 7: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
certbot --nginx -d your-domain.com
```

### Option 4: AWS EC2 Deployment

Similar to DigitalOcean, but:
1. Launch EC2 instance (t2.medium or larger)
2. Configure security groups (ports 22, 80, 443)
3. Follow DigitalOcean steps 2-7
4. Use AWS RDS for MongoDB or MongoDB Atlas

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create Account**: Sign up at https://www.mongodb.com/cloud/atlas

2. **Create Cluster**:
   - Choose free tier (M0) or paid tier
   - Select region closest to your server
   - Create cluster

3. **Configure Access**:
   - Database Access: Create user with read/write permissions
   - Network Access: Add your server's IP (or 0.0.0.0/0 for testing)

4. **Get Connection String**:
   - Click "Connect" > "Connect your application"
   - Copy connection string
   - Replace <password> with your database user password
   - Update MONGODB_URI in .env

### Option 2: Local MongoDB

For development only:

```bash
# Mac
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
# See DigitalOcean deployment steps

# Windows
# Download from https://www.mongodb.com/try/download/community
```

## Environment Configuration

### Required Environment Variables

```bash
# Application
NODE_ENV=production               # or development
PORT=5000                         # Server port

# Database
MONGODB_URI=mongodb://...         # MongoDB connection string

# Security
JWT_SECRET=your-secret-key        # Generate with: openssl rand -base64 32

# Frontend
CLIENT_URL=https://your-domain    # Your frontend URL
```

### Generating Secure JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Post-Deployment Steps

### 1. Create Admin User

Use MongoDB Compass or mongo shell:

```javascript
use inexss-crm

db.users.insertOne({
  name: "Janine Course",
  email: "admin@inexss.co.za",
  password: "$2a$10$...", // Use bcrypt to hash password
  role: "admin",
  location: "JHB",
  isActive: true,
  createdAt: new Date()
})
```

Or use the registration endpoint with admin role.

### 2. Initial Brand Setup

Log in and add your 15 brands through the UI.

### 3. Team Setup

Create user accounts for team members in JHB, Cape Town, and Durban.

## Monitoring and Maintenance

### Using PM2

```bash
# View logs
pm2 logs inexss-crm

# Restart application
pm2 restart inexss-crm

# Stop application
pm2 stop inexss-crm

# Monitor
pm2 monit
```

### Database Backups

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/inexss-crm" --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://localhost:27017/inexss-crm" /backups/20240101
```

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs inexss-crm`
2. Verify MongoDB is running: `systemctl status mongod`
3. Check environment variables: `pm2 env`
4. Verify ports are available: `netstat -tulpn | grep :5000`

### Cannot Connect to Database

1. Test MongoDB connection:
   ```bash
   mongo mongodb://localhost:27017/inexss-crm
   ```
2. Check MongoDB logs: `journalctl -u mongod`
3. Verify MONGODB_URI in .env
4. For MongoDB Atlas, check Network Access whitelist

### Frontend Not Loading

1. Rebuild frontend: `cd client && npm run build`
2. Check Nginx configuration: `nginx -t`
3. Review Nginx logs: `tail -f /var/log/nginx/error.log`

### Authentication Issues

1. Verify JWT_SECRET is set
2. Check token expiration (default 7 days)
3. Clear browser local storage
4. Check CORS settings in server/index.js

## Scaling Considerations

For high traffic:

1. **Load Balancing**: Use Nginx or AWS ELB
2. **Database**: Upgrade to MongoDB replica set
3. **Caching**: Implement Redis for sessions
4. **CDN**: Use CloudFlare for static assets
5. **Monitoring**: Set up New Relic or DataDog

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB has authentication enabled
- [ ] SSL/HTTPS is configured
- [ ] Firewall is configured (only ports 80, 443, 22 open)
- [ ] Regular backups are scheduled
- [ ] Environment variables are not in git
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is working

## Support

For issues or questions:
- Email: support@inexss.co.za
- GitHub Issues: https://github.com/craigbfelt/Inexss-CRM/issues

---

Last Updated: January 2026
