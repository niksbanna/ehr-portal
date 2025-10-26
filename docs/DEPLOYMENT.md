# Deployment Guide

This guide covers deploying the EHR Portal to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build for Production](#build-for-production)
- [Deployment Methods](#deployment-methods)
  - [Docker Deployment](#docker-deployment)
  - [Static Hosting](#static-hosting)
  - [Cloud Platforms](#cloud-platforms)
- [Environment Configuration](#environment-configuration)
- [Health Checks](#health-checks)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed (for building)
- Docker and Docker Compose (for containerized deployment)
- Access to your deployment target (cloud provider, server, etc.)
- Environment variables configured properly

## Build for Production

### 1. Install Dependencies

```bash
npm ci
```

### 2. Configure Environment

Create a `.env.production` file with production settings:

```bash
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=error
```

### 3. Build the Application

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### 4. Test the Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to verify the production build.

## Deployment Methods

### Docker Deployment

#### Option 1: Using Docker Compose (Recommended)

1. **Build and start the container:**

```bash
docker-compose up -d
```

2. **Verify the deployment:**

```bash
docker-compose ps
curl http://localhost:3000/health
```

3. **View logs:**

```bash
docker-compose logs -f ehr-portal
```

4. **Stop the container:**

```bash
docker-compose down
```

#### Option 2: Using Docker CLI

1. **Build the image:**

```bash
docker build -t ehr-portal:latest .
```

2. **Run the container:**

```bash
docker run -d \
  --name ehr-portal \
  -p 3000:80 \
  --restart unless-stopped \
  ehr-portal:latest
```

3. **Verify:**

```bash
docker ps
curl http://localhost:3000/health
```

#### Docker Environment Variables

Pass environment variables during build:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t ehr-portal:latest .
```

### Static Hosting

#### Netlify

1. **Install Netlify CLI:**

```bash
npm install -g netlify-cli
```

2. **Deploy:**

```bash
npm run build
netlify deploy --prod --dir=dist
```

3. **Configure redirects** by adding `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Deploy:**

```bash
vercel --prod
```

3. **Configure** using `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

#### GitHub Pages

1. **Install gh-pages:**

```bash
npm install --save-dev gh-pages
```

2. **Add deploy script** to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Deploy:**

```bash
npm run deploy
```

### Cloud Platforms

#### AWS S3 + CloudFront

1. **Build the application:**

```bash
npm run build
```

2. **Install AWS CLI** and configure credentials

3. **Create S3 bucket:**

```bash
aws s3 mb s3://your-bucket-name
```

4. **Upload files:**

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

5. **Configure CloudFront** for CDN and HTTPS

#### Google Cloud Platform

1. **Build the application:**

```bash
npm run build
```

2. **Install gcloud CLI** and configure

3. **Deploy to Cloud Storage:**

```bash
gsutil -m rsync -r -d dist gs://your-bucket-name
```

4. **Set up Cloud CDN** for better performance

#### Azure Static Web Apps

1. **Create Azure Static Web App** in Azure Portal

2. **Configure GitHub Actions** (automatically created)

3. **Deploy** via git push to your repository

#### DigitalOcean App Platform

1. **Create app** in DigitalOcean dashboard

2. **Connect repository**

3. **Configure build:**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy** automatically on push

## Environment Configuration

### Production Environment Variables

Create `.env.production` with these minimum settings:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.production.com
VITE_ENABLE_MSW=false

# Security
VITE_ENCRYPTION_KEY=<secure-random-key>
VITE_CSP_ENABLED=true

# Analytics (optional)
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Logging
VITE_LOG_LEVEL=error
VITE_ENABLE_AUDIT_LOG=true

# FHIR Server
VITE_FHIR_SERVER_URL=https://fhir.production.com
```

### Security Checklist

- [ ] Environment variables properly configured
- [ ] Secrets not exposed in client bundle
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Security headers set (X-Frame-Options, etc.)
- [ ] Rate limiting configured
- [ ] Authentication tokens secured
- [ ] CORS properly configured

## Health Checks

### Application Health Endpoint

The nginx configuration includes a `/health` endpoint:

```bash
curl http://your-domain.com/health
# Response: healthy
```

### Docker Health Check

Docker automatically monitors container health:

```bash
docker inspect --format='{{.State.Health.Status}}' ehr-portal
```

### Kubernetes Health Probes

Example liveness and readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Monitoring

### Logging

Application logs can be viewed:

**Docker:**

```bash
docker logs -f ehr-portal
```

**Docker Compose:**

```bash
docker-compose logs -f
```

### Performance Monitoring

Enable performance monitoring in `.env.production`:

```bash
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Error Tracking

Configure Sentry for error tracking:

```bash
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
VITE_SENTRY_ENVIRONMENT=production
```

### Analytics

Configure Google Analytics:

```bash
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_ENABLE_ANALYTICS=true
```

## SSL/TLS Configuration

### Let's Encrypt with Certbot

For servers running nginx directly:

```bash
certbot --nginx -d yourdomain.com
```

### Cloudflare SSL

Use Cloudflare for automatic SSL and CDN benefits.

## Scaling

### Horizontal Scaling

Deploy multiple instances behind a load balancer:

```bash
docker-compose up --scale ehr-portal=3
```

### Container Orchestration

#### Kubernetes Deployment

Example `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ehr-portal
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ehr-portal
  template:
    metadata:
      labels:
        app: ehr-portal
    spec:
      containers:
        - name: ehr-portal
          image: ehr-portal:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: '128Mi'
              cpu: '100m'
            limits:
              memory: '256Mi'
              cpu: '200m'
```

## Backup and Recovery

### Configuration Backup

Regularly backup:

- Environment configuration files
- Docker volumes (if using databases)
- SSL certificates
- Application secrets

### Database Backup (if applicable)

```bash
# PostgreSQL backup
docker exec ehr-postgres pg_dump -U fhir fhir > backup.sql

# Restore
docker exec -i ehr-postgres psql -U fhir fhir < backup.sql
```

## Troubleshooting

### Common Issues

1. **Container won't start:**
   - Check logs: `docker logs ehr-portal`
   - Verify port availability
   - Check environment variables

2. **Static files not loading:**
   - Verify nginx configuration
   - Check file permissions
   - Ensure correct base path in build

3. **API connection fails:**
   - Verify `VITE_API_BASE_URL` is correct
   - Check CORS configuration
   - Ensure API is accessible from deployment

4. **Build failures:**
   - Check Node.js version
   - Clear npm cache: `npm cache clean --force`
   - Remove and reinstall dependencies

### Performance Issues

- Enable gzip compression in nginx
- Configure CDN (CloudFront, Cloudflare)
- Enable browser caching
- Optimize bundle size
- Use lazy loading for routes

## Rollback Procedure

### Docker Deployment

```bash
# Tag current version
docker tag ehr-portal:latest ehr-portal:backup

# Pull previous version
docker pull ehr-portal:previous

# Restart with previous version
docker-compose down
docker-compose up -d
```

### Cloud Platforms

Most platforms support instant rollback to previous deployment through their dashboard.

## Post-Deployment Checklist

- [ ] Application is accessible
- [ ] Health check endpoint responds
- [ ] All pages load correctly
- [ ] API connections work
- [ ] Authentication functions properly
- [ ] SSL certificate is valid
- [ ] Monitoring is active
- [ ] Logs are being collected
- [ ] Backup system is configured
- [ ] Performance is acceptable

## Support

For deployment issues:

1. Check application logs
2. Review [Environment Configuration](./ENVIRONMENT.md)
3. Consult [Setup Guide](./SETUP.md)
4. Create an issue on GitHub
