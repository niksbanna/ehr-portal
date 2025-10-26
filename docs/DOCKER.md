# Docker Setup Guide

This guide explains how to use Docker and Docker Compose with the EHR Portal.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher (included with Docker Desktop)

## Quick Start

### 1. Using Docker Compose (Recommended)

Start the application with a single command:

```bash
docker-compose up -d
```

Access the application at `http://localhost:3000`

### 2. Using Docker CLI

Build and run manually:

```bash
# Build the image
docker build -t ehr-portal:latest .

# Run the container
docker run -d -p 3000:80 --name ehr-portal ehr-portal:latest
```

## Docker Configuration

### Dockerfile Explanation

The Dockerfile uses a multi-stage build:

1. **Builder Stage**: Compiles the application
   - Uses Node.js 18 Alpine image
   - Installs dependencies
   - Builds the production bundle

2. **Production Stage**: Serves the application
   - Uses lightweight nginx Alpine image
   - Copies built files from builder
   - Configures nginx for SPA routing

### Docker Compose Configuration

The `docker-compose.yml` includes:

- **ehr-portal**: Main web application
- Health checks for monitoring
- Automatic restart policy
- Network configuration

Optional services (commented out):

- **fhir-server**: HAPI FHIR server
- **postgres**: PostgreSQL database

## Building Images

### Production Build

```bash
docker build -t ehr-portal:latest .
```

### Development Build with Cache

```bash
docker build \
  --cache-from ehr-portal:latest \
  -t ehr-portal:dev .
```

### Build with Arguments

Pass environment variables during build:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  -t ehr-portal:latest .
```

## Running Containers

### Start Services

```bash
# Start in detached mode
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up ehr-portal
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Restart Services

```bash
docker-compose restart
```

## Managing Containers

### View Running Containers

```bash
docker-compose ps
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ehr-portal

# Last 100 lines
docker-compose logs --tail=100 ehr-portal
```

### Execute Commands in Container

```bash
# Open shell
docker-compose exec ehr-portal sh

# Run specific command
docker-compose exec ehr-portal nginx -t
```

### Health Checks

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' ehr-portal

# Health check endpoint
curl http://localhost:3000/health
```

## Volumes and Data Persistence

### Named Volumes

Uncomment in `docker-compose.yml` for persistence:

```yaml
volumes:
  postgres-data:
    driver: local
```

### Backup Volumes

```bash
# Backup
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore
docker run --rm \
  -v postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz
```

## Networking

### Default Network

Docker Compose creates a network automatically:

```bash
# List networks
docker network ls

# Inspect network
docker network inspect ehr-portal_ehr-network
```

### Custom Network Configuration

Edit `docker-compose.yml`:

```yaml
networks:
  ehr-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.28.0.0/16
```

## Environment Variables

### Method 1: Environment File

Create `.env` file:

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_MSW=false
```

Docker Compose will automatically load it.

### Method 2: Inline in docker-compose.yml

```yaml
services:
  ehr-portal:
    environment:
      - VITE_API_BASE_URL=https://api.example.com
      - VITE_ENABLE_MSW=false
```

### Method 3: Docker Run

```bash
docker run -d \
  -e VITE_API_BASE_URL=https://api.example.com \
  -e VITE_ENABLE_MSW=false \
  -p 3000:80 \
  ehr-portal:latest
```

## Production Deployment

### 1. Build Production Image

```bash
docker build -t ehr-portal:1.0.0 .
docker tag ehr-portal:1.0.0 ehr-portal:latest
```

### 2. Push to Registry

```bash
# Docker Hub
docker tag ehr-portal:latest username/ehr-portal:latest
docker push username/ehr-portal:latest

# AWS ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag ehr-portal:latest <account>.dkr.ecr.<region>.amazonaws.com/ehr-portal:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/ehr-portal:latest
```

### 3. Deploy to Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Resource Limits

### Set Memory and CPU Limits

Edit `docker-compose.yml`:

```yaml
services:
  ehr-portal:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Monitor Resource Usage

```bash
docker stats ehr-portal
```

## Scaling

### Scale Services

```bash
# Scale to 3 replicas
docker-compose up -d --scale ehr-portal=3

# With load balancer
docker-compose -f docker-compose.yml -f docker-compose.scale.yml up -d
```

### Load Balancing

Add nginx load balancer in separate compose file.

## Troubleshooting

### Container Won't Start

1. Check logs:

```bash
docker-compose logs ehr-portal
```

2. Inspect container:

```bash
docker inspect ehr-portal
```

3. Check health:

```bash
docker-compose ps
```

### Port Already in Use

Change port in `docker-compose.yml`:

```yaml
ports:
  - '8080:80' # Change 3000 to 8080
```

### Build Issues

Clear cache and rebuild:

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Permission Issues

```bash
# Check file permissions
docker-compose exec ehr-portal ls -la /usr/share/nginx/html

# Fix permissions
docker-compose exec ehr-portal chown -R nginx:nginx /usr/share/nginx/html
```

### Network Issues

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

## Security Best Practices

1. **Use non-root user** in Dockerfile (nginx already does this)
2. **Scan images** for vulnerabilities:
   ```bash
   docker scan ehr-portal:latest
   ```
3. **Use specific versions** instead of `latest`
4. **Minimize image size** using Alpine base
5. **Don't include secrets** in images
6. **Update base images** regularly

## Advanced Configuration

### Custom nginx Configuration

Mount custom config:

```yaml
services:
  ehr-portal:
    volumes:
      - ./custom-nginx.conf:/etc/nginx/conf.d/default.conf
```

### Using FHIR Server

Uncomment FHIR server in `docker-compose.yml`:

```yaml
services:
  fhir-server:
    image: hapiproject/hapi:latest
    # ... configuration
```

### Database Integration

Uncomment PostgreSQL in `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    # ... configuration
```

## Monitoring and Logging

### Centralized Logging

Use logging driver:

```yaml
services:
  ehr-portal:
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
```

### Health Monitoring

Use Docker healthcheck:

```yaml
healthcheck:
  test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost/health']
  interval: 30s
  timeout: 10s
  retries: 3
```

## Useful Commands

```bash
# Remove all stopped containers
docker-compose down

# Remove all images
docker image prune -a

# Remove all volumes
docker volume prune

# Full cleanup
docker system prune -a --volumes

# Export container
docker export ehr-portal > ehr-portal.tar

# Import image
docker import ehr-portal.tar ehr-portal:imported

# Save image to file
docker save ehr-portal:latest > ehr-portal-image.tar

# Load image from file
docker load < ehr-portal-image.tar
```

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [HAPI FHIR Documentation](https://hapifhir.io/)
