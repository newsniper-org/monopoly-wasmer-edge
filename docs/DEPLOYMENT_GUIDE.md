# Deployment Guide

## 🚀 Wasmer Edge Deployment

### Prerequisites
- Wasmer CLI installed
- Node.js 18+
- Matrix homeserver access

### Build and Deploy

1. **Install Wasmer CLI**:
```bash
curl https://get.wasmer.io -sSfL | sh
```

2. **Build the application**:
```bash
npm run build
```

3. **Deploy to Wasmer Edge**:
```bash
wasmer deploy
```

4. **Configure environment variables**:
```bash
wasmer config set MATRIX_HOMESERVER https://matrix.org
wasmer config set CORS_ORIGIN https://your-domain.com
```

### Environment Configuration

Create a `.env.production` file:
```env
VITE_MATRIX_HOMESERVER=https://matrix.org
VITE_GAME_SERVER_URL=https://your-api.wasmer.app
NODE_ENV=production
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose ports
EXPOSE 3000 3001

# Start both frontend and backend
CMD ["npm", "run", "start:prod"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  monopoly-app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - VITE_MATRIX_HOMESERVER=https://matrix.org
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

## ☁️ Cloud Platform Deployment

### Vercel (Frontend)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend.herokuapp.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Railway (Full-stack)
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm run start:prod"

[[services]]
name = "monopoly-game"

[services.variables]
VITE_MATRIX_HOMESERVER = "https://matrix.org"
NODE_ENV = "production"
```

### Heroku
```json
{
  "name": "multiplayer-monopoly",
  "description": "Real-time multiplayer Monopoly game",
  "repository": "https://github.com/your-username/multiplayer-monopoly",
  "logo": "https://your-logo-url.com/logo.png",
  "keywords": ["monopoly", "game", "matrix", "real-time"],
  "env": {
    "VITE_MATRIX_HOMESERVER": {
      "description": "Matrix homeserver URL",
      "value": "https://matrix.org"
    },
    "NODE_ENV": {
      "description": "Node environment",
      "value": "production"
    }
  },
  "formation": {
    "web": {
      "quantity": 1,
      "size": "hobby"
    }
  },
  "addons": [
    "heroku-redis:hobby-dev"
  ],
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ]
}
```

## 🔧 Production Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /var/www/monopoly/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE
    location /sse/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # SSE specific headers
        proxy_set_header Cache-Control no-cache;
        proxy_buffering off;
    }
}
```

### PM2 Configuration
```json
{
  "apps": [
    {
      "name": "monopoly-game",
      "script": "server/index.js",
      "instances": "max",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3001
      },
      "error_file": "./logs/err.log",
      "out_file": "./logs/out.log",
      "log_file": "./logs/combined.log",
      "time": true
    }
  ]
}
```

## 📊 Monitoring and Logging

### Health Check Endpoint
```javascript
// server/health.js
app.get('/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    checks: {
      memory: process.memoryUsage(),
      activeGames: games.size,
      activeConnections: sseClients.size
    }
  };
  
  res.status(200).json(health);
});
```

### Logging Configuration
```javascript
// server/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'monopoly-game' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## 🔒 Security Configuration

### CORS Setup
```javascript
// server/cors.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### Rate Limiting
```javascript
// server/rateLimiting.js
import rateLimit from 'express-rate-limit';

const gameActionLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many game actions, please slow down'
});

app.use('/api/games/:gameId/actions', gameActionLimiter);
```

### SSL/TLS Configuration
```javascript
// server/ssl.js
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
```

## 📈 Performance Optimization

### Redis Configuration
```javascript
// server/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null
});

// Game state caching
async function cacheGameState(gameId, state) {
  await redis.setex(`game:${gameId}`, 3600, JSON.stringify(state));
}

async function getCachedGameState(gameId) {
  const cached = await redis.get(`game:${gameId}`);
  return cached ? JSON.parse(cached) : null;
}
```

### Database Optimization
```javascript
// server/database.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Connection pooling for better performance
export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (duration > 1000) {
    console.warn('Slow query detected:', { text, duration });
  }
  
  return res;
}
```

## 🚨 Troubleshooting

### Common Issues

1. **SSE Connection Drops**:
   - Check proxy configuration
   - Verify keep-alive settings
   - Monitor connection timeouts

2. **Matrix Authentication Fails**:
   - Verify homeserver URL
   - Check CORS configuration
   - Validate credentials format

3. **High Memory Usage**:
   - Implement game state cleanup
   - Add memory monitoring
   - Use Redis for session storage

4. **Slow Performance**:
   - Enable gzip compression
   - Implement caching strategies
   - Optimize database queries

### Debug Commands
```bash
# Check application logs
pm2 logs monopoly-game

# Monitor resource usage
pm2 monit

# Restart application
pm2 restart monopoly-game

# Check Redis connection
redis-cli ping

# Test health endpoint
curl https://your-domain.com/health
```
