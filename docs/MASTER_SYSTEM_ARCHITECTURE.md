# 🌌 ZÜHRE PLANET - MASTER SYSTEM ARCHITECTURE

**Versiyon:** 1.0.0
**Tarih:** 26 Nisan 2026
**Durum:** Production-Ready Architecture Plan
**Yazar:** Multi-AI Development Team

---

## 📋 İÇİNDEKİLER

1. [Sistem Özeti](#sistem-özeti)
2. [Mimari Diyagram](#mimari-diyagram)
3. [Bileşenler](#bileşenler)
4. [Docker Infrastructure](#docker-infrastructure)
5. [AI & MCP Entegrasyonları](#ai--mcp-entegrasyonları)
6. [Veri Akışı](#veri-akışı)
7. [Güvenlik](#güvenlik)
8. [Kurulum Rehberi](#kurulum-rehberi)
9. [Operasyonel Prosedürler](#operasyonel-prosedürler)
10. [Troubleshooting](#troubleshooting)
11. [Gelecek Planları](#gelecek-planları)

---

## 🎯 SİSTEM ÖZETİ

### Proje: Zühre Planet

**Nedir:** AI-güçlü premium eskort ve arkadaşlık platformu

**Hedef Kitle:** 18+ yetişkin kullanıcılar, VIP müşteriler

**Temel Özellikler:**
- Eskort profil yönetimi
- Randevu sistemi
- Sadakat programı
- AI chat asistanı
- Forum sistemi
- Ödeme işlemleri (Iyzico)
- Medya yükleme & moderasyon
- Admin dashboard

---

### Teknoloji Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18 + Vite)                │
│  Pages, Components, Hooks, Contexts, Styles, Animations     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    tRPC API Layer                            │
│         Type-safe API calls, Real-time WebSocket            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Node.js + Express)                     │
│   Routers: Auth, Escort, Customer, Appointment, Payment     │
│              Chat, Forum, Loyalty, Media, Admin             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL 15)                   │
│              Drizzle ORM, Migrations, Seeds                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              AI INFRASTRUCTURE (LiteLLM Proxy)               │
│   Gemini, Groq, DashScope, OpenRouter, Ollama, Venice       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           AUTOMATION (n8n Workflows + MCP Servers)          │
│   Webhooks, AI Agents, Email, SMS, Social Media, CRM        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ MİMARİ DİYARAM

### Yüksek Seviye Mimari

```
                                    INTERNET
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
            │   Cloudflare  │  │  Docker Host  │  │  AI Services  │
            │   (Future)    │  │  (Local/VM)   │  │  (External)   │
            └───────────────┘  └───────────────┘  └───────────────┘
                    │                   │                   │
                    │           ┌───────┴───────┐          │
                    │           │               │          │
                    ▼           ▼               ▼          ▼
            ┌─────────────────────────────────────────────────────┐
            │              NGINX Reverse Proxy                     │
            │         (SSL Termination, Load Balancing)           │
            └─────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌───────────┐ ┌───────────┐ ┌───────────┐
        │ Frontend  │ │   API     │ │   n8n     │
        │  :5173    │ │  :4000    │ │  :5678    │
        └───────────┘ └───────────┘ └───────────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    :5432        │
                    └─────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌───────────┐ ┌───────────┐ ┌───────────┐
        │ LiteLLM   │ │Open WebUI │ │   MCP     │
        │  :4000    │ │  :3002    │ │  Gateway  │
        └───────────┘ └───────────┘ └───────────┘
```

---

## 🔧 BİLEŞENLER

### 1. FRONTEND (React 18 + Vite)

**Konum:** `D:\Projeler\Zuhre_Planet\src\`

**Yapı:**
```
src/
├── pages/              # Main pages (Home, Escort, Profile, etc.)
├── components/         # Reusable UI components
├── contexts/           # React contexts (Auth, WebSocket, Theme)
├── hooks/              # Custom hooks (useAuth, useEscort, etc.)
├── lib/                # Utilities (trpc, db, logger, payment)
├── config/             # App configuration
├── styles/             # Global styles
├── animations/         # Framer Motion animations
└── data/               # Mock data (development only)
```

**Özellikler:**
- TypeScript strict mode
- tRPC type-safe API calls
- WebSocket real-time updates
- Framer Motion animations
- Responsive design (mobile-first)
- Dark/Light theme
- Age verification gate

**Komutlar:**
```bash
npm run dev          # Development server (:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
```

---

### 2. BACKEND (Node.js + Express)

**Konum:** `D:\Projeler\Zuhre_Planet\server\`

**Yapı:**
```
server/
├── routers/          # tRPC routers (auth, escort, appointment, etc.)
├── context.ts        # tRPC context (auth, db, user)
├── router.ts         # Main router (combines all routers)
├── server.ts         # Express server + WebSocket
├── monitoring.ts     # Health checks, metrics
└── index.ts          # Entry point
```

**Routers (12 Adet):**
1. `auth.router.ts` - Login, register, JWT, password reset
2. `escort.router.ts` - Escort profile CRUD, search, filter
3. `customer.router.ts` - Customer profile, preferences
4. `appointment.router.ts` - Booking system, calendar
5. `payment.router.ts` - Iyzico integration, invoices
6. `chat.router.ts` - Real-time chat, messages
7. `forum.router.ts` - Forum posts, comments, votes
8. `loyalty.router.ts` - Points, rewards, tiers
9. `media.router.ts` - Photo/video upload, moderation
10. `messaging.router.ts` - Private messages, notifications
11. `moderation.router.ts` - Content moderation, reports
12. `admin.router.ts` - Admin dashboard, analytics

**Özellikler:**
- tRPC for type-safe API
- WebSocket for real-time
- JWT authentication
- Rate limiting
- CORS configuration
- Error handling middleware
- Request logging

**Komutlar:**
```bash
npm run dev:server   # Development server (:4000)
npm run build        # TypeScript build
npm run start        # Production server
```

---

### 3. DATABASE (PostgreSQL 15)

**Konum:** Docker container (`multi-ai-postgres`)

**Schema:** `D:\Projeler\Zuhre_Planet\src\drizzle\schema.ts`

**Tablolar (15+):**
- `users` - All users (escort, customer, admin)
- `escorts` - Escort profiles
- `customers` - Customer profiles
- `appointments` - Booking records
- `payments` - Payment transactions
- `reviews` - Escort reviews
- `messages` - Chat messages
- `forum_posts` - Forum content
- `loyalty_points` - Loyalty program
- `media_files` - Uploaded media
- `notifications` - User notifications
- `reports` - Moderation reports
- `subscriptions` - VIP subscriptions
- `locations` - Cities, districts
- `audit_logs` - System audit trail

**Özellikler:**
- Drizzle ORM for type-safe queries
- Migrations for schema changes
- Seeds for test data
- Indexes for performance
- Foreign key constraints
- Soft deletes
- Timestamps (created_at, updated_at)

**Komutlar:**
```bash
npm run db:migrate   # Run migrations
npm run db:seed      # Seed test data
npm run db:studio    # Open Drizzle Studio
```

---

### 4. AI INFRASTRUCTURE

#### 4.1 LiteLLM Proxy

**Konum:** Docker container (`multi-ai-litellm`)

**Port:** 4000

**Konfigürasyon:** `D:\Projeler\Zuhre_Planet\litellm-config.yaml`

**Modeller:**
```yaml
model_list:
  - model_name: gemini-2.5-flash
    litellm_params:
      model: gemini/gemini-2.5-flash
      api_key: ${GEMINI_API_KEY}

  - model_name: groq-llama-3.3
    litellm_params:
      model: groq/llama-3.3-70b-versatile
      api_key: ${GROQ_API_KEY}

  - model_name: dashscope-qwen
    litellm_params:
      model: dashscope/qwen3.5-plus
      api_key: ${DASHSCOPE_API_KEY}

  - model_name: openrouter-gpt4o
    litellm_params:
      model: openrouter/openai/gpt-4o-mini
      api_key: ${OPENROUTER_API_KEY}

  - model_name: ollama-qwen2.5
    litellm_params:
      model: ollama/qwen2.5:7b
      api_base: http://ollama:11434

  - model_name: venice-uncensored
    litellm_params:
      model: venice/venice-uncensored
      api_key: ${VENICE_API_KEY}
```

**Endpoints:**
```
GET  /health              # Health check
GET  /models              # List models
POST /chat/completions    # Chat API (OpenAI compatible)
GET  /key/info            # API key info
```

---

#### 4.2 Open WebUI

**Konum:** Docker container (`multi-ai-open-webui`)

**Port:** 3002 (regular), 3003 (NSFW)

**URL:** http://localhost:3002

**Özellikler:**
- Chat UI for all AI models
- RAG (Retrieval Augmented Generation)
- Web search integration
- Image generation
- Voice chat
- Model management
- User management

**Konfigürasyon:**
```
Settings → Connections → Add LiteLLM
Base URL: http://litellm:4000
API Key: sk-litellm-master-key
```

---

#### 4.3 Ollama (Local AI)

**Konum:** Docker container (planlanıyor)

**Port:** 11434

**Modeller:**
- qwen2.5:7b (default)
- llama3.2:3b (fast)
- mistral:7b (balanced)
- codellama:7b (coding)

**Kurulum:**
```bash
docker run -d --name ollama \
  -p 11434:11434 \
  -v ollama_data:/root/.ollama \
  ollama/ollama:latest

docker exec ollama ollama pull qwen2.5:7b
```

---

### 5. AUTOMATION (n8n + MCP)

#### 5.1 n8n Workflows

**Konum:** Docker container (`multi-ai-n8n`)

**Port:** 5678

**URL:** http://localhost:5678

**Workflows (Planlanan):**

**1. Eskort Onboarding**
```
Trigger: Webhook (POST /webhook/zuhre-escort-onboarding)
  ↓
Verify Email (AI-generated code)
  ↓
Generate Profile Description (Gemini)
  ↓
Moderate Photos (Venice AI NSFW check)
  ↓
Create Database Record
  ↓
Send Welcome Email (Resend)
  ↓
Notify Admin (Slack)
```

**2. Müşteri Journey**
```
Trigger: New Customer Signup
  ↓
Send Verification SMS
  ↓
Add to CRM (Notion)
  ↓
Track First Login
  ↓
Offer First Booking Discount
  ↓
Send Follow-up Email (3 days)
  ↓
Request Review (after appointment)
```

**3. Ödeme Otomasyonu**
```
Trigger: Iyzico Webhook (payment received)
  ↓
Verify Payment
  ↓
Update Database
  ↓
Generate Invoice (PDF)
  ↓
Send Email to Customer
  ↓
Add Loyalty Points
  ↓
Notify Accountant (Slack)
```

**4. AI İçerik Üretimi**
```
Trigger: Scheduled (daily 9 AM)
  ↓
Fetch New Escorts
  ↓
Generate Social Media Posts (Gemini)
  ↓
Create Images (Leonardo AI)
  ↓
Schedule Posts (Buffer API)
  ↓
Log to Analytics (Google Sheets)
```

---

#### 5.2 MCP Servers

**Konum:** Docker containers + npx

**Gateway:** Port 8080 (planlanıyor)

**Aktif MCP'ler:**

| MCP Server | Port | Kullanım |
|------------|------|----------|
| **filesystem** | - | Dosya okuma/yazma |
| **github** | - | GitHub API (PR, issues, commits) |
| **git** | - | Git operations |
| **memory** | - | AI memory (vector database) |
| **n8n** | 5678 | Workflow triggers |
| **postgres** | - | Database queries |
| **fetch** | - | Web scraping |
| **brave-search** | - | Web search |
| **desktop-commander** | - | Terminal commands |

**Docker MCP'ler (Planlanan):**

| MCP Server | Docker Image | Kullanım |
|------------|--------------|----------|
| **playwright** | mcp/playwright | Browser automation |
| **puppeteer** | mcp/puppeteer | Headless Chrome |
| **dockerhub** | mcp/dockerhub | Docker operations |
| **grafana** | mcp/grafana | Monitoring dashboards |
| **sonarqube** | mcp/sonarqube | Code quality |
| **atlassian** | mcp/atlassian | Jira/Confluence |
| **slack** | mcp/slack | Slack bot |
| **resend** | mcp/resend | Email sending |
| **stripe** | mcp/stripe | Payment processing |
| **elevenlabs** | mcp/elevenlabs | Text-to-speech |

**MCP Config (`mcp.json`):**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "D:\\Projeler\\Zuhre_Planet"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "n8n": {
      "url": "http://localhost:5678",
      "type": "sse"
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://zuhre_user:zuhre_password@localhost:5432/zuhre_planet"
      }
    }
  }
}
```

---

## 🐳 DOCKER INFRASTRUCTURE

### docker-compose.yml (Ana)

```yaml
version: '3.8'

services:
  # Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - api
      - n8n
      - open-webui
    networks:
      - zuhre_network

  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=http://localhost:4000/api
      - VITE_WS_URL=ws://localhost:4000/ws
    depends_on:
      - api
    networks:
      - zuhre_network

  # Backend API
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "4000:4000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://zuhre_user:zuhre_password@postgres:5432/zuhre_planet
      - JWT_SECRET=${JWT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      - postgres
    networks:
      - zuhre_network

  # Database
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    volumes:
      - zuhre_postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=zuhre_planet
      - POSTGRES_USER=zuhre_user
      - POSTGRES_PASSWORD=zuhre_password
    networks:
      - zuhre_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zuhre_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # AI Proxy (LiteLLM)
  litellm:
    image: docker.litellm.ai/berriai/litellm:main-latest
    ports:
      - "4000:4000"
    volumes:
      - ./litellm-config.yaml:/app/config.yaml
    environment:
      - DATABASE_URL=postgresql://zuhre_user:zuhre_password@postgres:5432/litellm
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
    depends_on:
      - postgres
    networks:
      - zuhre_network

  # AI Chat UI (Open WebUI)
  open-webui:
    image: ghcr.io/open-webui/open-webui:v0.6.5
    ports:
      - "3002:8080"
    volumes:
      - open-webui_data:/app/backend/data
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - ENABLE_SIGNUP=false
    depends_on:
      - litellm
    networks:
      - zuhre_network

  # Automation (n8n)
  n8n:
    image: docker.n8n.io/n8nio/n8n
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
    environment:
      - N8N_HOST=http://localhost:5678
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=Europe/Istanbul
    networks:
      - zuhre_network

  # Local AI (Ollama)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    networks:
      - zuhre_network

  # MCP Gateway
  mcp-gateway:
    build: ./mcp-gateway
    ports:
      - "8080:8080"
    volumes:
      - ./mcp.json:/app/mcp.json
    environment:
      - MCP_CONFIG_PATH=/app/mcp.json
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - DATABASE_URL=postgresql://zuhre_user:zuhre_password@postgres:5432/zuhre_planet
    depends_on:
      - n8n
      - postgres
    networks:
      - zuhre_network

volumes:
  zuhre_postgres_data:
  open-webui_data:
  n8n_data:
  ollama_data:

networks:
  zuhre_network:
    driver: bridge
```

---

## 🔄 VERİ AKIŞI

### 1. Müşteri Kayıt Akışı

```
User → Frontend (/register)
  ↓
tRPC Call (auth.register)
  ↓
Backend Validates Input
  ↓
Check Email Exists (PostgreSQL)
  ↓
Hash Password (bcrypt)
  ↓
Create User Record (PostgreSQL)
  ↓
Generate JWT Token
  ↓
Send Verification Email (n8n webhook)
  ↓
Return Token to Client
  ↓
Store in localStorage
  ↓
Redirect to Dashboard
```

---

### 2. Eskort Arama Akışı

```
User → Frontend (/escorts)
  ↓
Apply Filters (city, age, type, etc.)
  ↓
tRPC Call (escort.search)
  ↓
Backend Builds Query (Drizzle ORM)
  ↓
Execute Query (PostgreSQL)
  ↓
Apply AI Ranking (Gemini - relevance score)
  ↓
Cache Results (Redis - future)
  ↓
Return Results
  ↓
Display Cards with Animations
```

---

### 3. Randevu Alma Akışı

```
Customer → Frontend (/escort/:id)
  ↓
Select Date/Time
  ↓
tRPC Call (appointment.create)
  ↓
Backend Checks Availability
  ↓
Calculate Price
  ↓
Create Payment Intent (Iyzico)
  ↓
Return Payment Form
  ↓
Customer Enters Card Details
  ↓
Iyzico Processes Payment
  ↓
Iyzico Webhook → n8n
  ↓
n8n Workflow:
  - Update Appointment Status
  - Send Confirmation Email
  - Notify Escort (SMS)
  - Add Loyalty Points
  - Create Invoice (PDF)
  ↓
Customer Sees Success Page
```

---

### 4. AI Chat Akışı

```
User → Open WebUI (/chat)
  ↓
Select Model (Gemini, Groq, etc.)
  ↓
Type Message
  ↓
Open WebUI → LiteLLM Proxy
  ↓
LiteLLM Routes to Provider
  ↓
Provider Returns Response
  ↓
Store in Conversation History
  ↓
Display to User
  ↓
Optional: Save to Database (for training)
```

---

### 5. MCP Tool Call Akışı

```
User (Qwen Code) → "Check recent commits"
  ↓
AI Recognizes GitHub MCP
  ↓
Call MCP Gateway (/tools/github/commits)
  ↓
MCP Gateway → GitHub API
  ↓
Parse Response
  ↓
Format for AI
  ↓
AI Generates Summary
  ↓
Display to User
```

---

## 🔒 GÜVENLİK

### 1. Authentication

```typescript
// JWT Configuration
{
  secret: process.env.JWT_SECRET, // 64+ chars
  accessExpiry: '15m',
  refreshExpiry: '7d',
  algorithm: 'HS256'
}

// Password Hashing
{
  algorithm: 'bcrypt',
  rounds: 12
}
```

---

### 2. Rate Limiting

```typescript
// API Rate Limits
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests'
}

// Auth Endpoints
{
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 login attempts
  message: 'Too many login attempts'
}
```

---

### 3. CORS Configuration

```typescript
// Development
{
  origin: ['http://localhost:5173', 'http://localhost:3002'],
  credentials: true
}

// Production
{
  origin: ['https://zuhreplanet.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

### 4. Database Security

```sql
-- User Permissions
GRANT SELECT, INSERT, UPDATE ON escorts TO api_user;
GRANT SELECT ON payments TO api_user;
REVOKE DELETE ON users FROM api_user;

-- Row Level Security (future)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY customer_policy ON appointments
  FOR SELECT USING (customer_id = current_user_id());
```

---

### 5. API Key Management

```bash
# Docker Secrets (Production)
echo "sk-..." | docker secret create gemini_api_key -

# docker-compose.yml
services:
  litellm:
    secrets:
      - gemini_api_key

secrets:
  gemini_api_key:
    external: true
```

---

## 📦 KURULUM REHBERİ

### Önkoşullar

```bash
# Required Software
- Node.js 20+
- Docker Desktop
- Git
- PostgreSQL client (psql)

# Optional
- NVIDIA GPU (for Ollama)
- 16GB+ RAM
- 50GB+ SSD
```

---

### Adım 1: Repository Clone

```bash
cd D:\Projeler
git clone https://github.com/zuhreplanet/zuhre-planet.git
cd zuhre-planet
```

---

### Adım 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# Required:
#   JWT_SECRET=your-secret-key-min-64-chars
#   DATABASE_URL=postgresql://zuhre_user:zuhre_password@localhost:5432/zuhre_planet
#   GEMINI_API_KEY=AIzaSy...
#   GROQ_API_KEY=gsk_...
#   DASHSCOPE_API_KEY=sk-...
#   OPENROUTER_API_KEY=sk-or-...
```

---

### Adım 3: Docker Containers Başlat

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

### Adım 4: Database Migration

```bash
# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Verify
npm run db:studio
```

---

### Adım 5: Development Servers

```bash
# Start frontend (terminal 1)
npm run dev

# Start backend (terminal 2)
npm run dev:server

# Access:
#   Frontend: http://localhost:5173
#   Backend:  http://localhost:4000
#   Open WebUI: http://localhost:3002
#   n8n: http://localhost:5678
```

---

### Adım 6: First Login

```bash
# Create admin account
Frontend → /register
  Email: admin@zuhreplanet.local
  Password: Admin123!

# Or use seed data:
  Email: admin@zuhreplanet.com
  Password: admin123
```

---

## 🔧 OPERASYONEL PROSEDÜRLER

### Daily Operations

```bash
# 1. Check container health
docker-compose ps

# 2. Check logs for errors
docker-compose logs --tail 100

# 3. Check disk space
df -h

# 4. Check database size
docker exec multi-ai-postgres psql -U zuhre_user -c "SELECT pg_size_pretty(pg_database_size('zuhre_planet'));"

# 5. Backup database
docker exec multi-ai-postgres pg_dump -U zuhre_user zuhre_planet > backup-$(date +%Y%m%d).sql
```

---

### Weekly Operations

```bash
# 1. Update Docker images
docker-compose pull
docker-compose up -d --force-recreate

# 2. Clean old containers
docker container prune -f

# 3. Clean old images
docker image prune -f

# 4. Review n8n workflows
http://localhost:5678/workflow

# 5. Check AI usage
http://localhost:4000/key/info
```

---

### Monthly Operations

```bash
# 1. Security updates
npm audit fix
npm update

# 2. Database vacuum
docker exec multi-ai-postgres psql -U zuhre_user -c "VACUUM ANALYZE;"

# 3. Log rotation
# Configure logrotate for /var/log/docker

# 4. Review access logs
# Check for suspicious activity

# 5. Update documentation
```

---

## 🐛 TROUBLESHOOTING

### Problem: LiteLLM Unhealthy

```bash
# Check logs
docker logs multi-ai-litellm --tail 100

# Common issues:
# 1. PostgreSQL connection
docker exec multi-ai-postgres psql -U zuhre_user -c "SELECT 1"

# 2. API key issues
curl http://localhost:4000/models -H "Authorization: Bearer sk-..."

# 3. Restart container
docker restart multi-ai-litellm

# 4. Rebuild
docker-compose up -d --build litellm
```

---

### Problem: n8n Workflows Not Triggering

```bash
# 1. Check webhook URL
http://localhost:5678/webhook/zuhre-test

# 2. Check n8n logs
docker logs multi-ai-n8n --tail 50

# 3. Test webhook manually
curl -X POST http://localhost:5678/webhook/zuhre-test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 4. Restart n8n
docker restart multi-ai-n8n
```

---

### Problem: Open WebUI No Models

```bash
# 1. Check LiteLLM connection
curl http://localhost:4000/models

# 2. Configure in Open WebUI
Settings → Connections → Add LiteLLM
Base URL: http://litellm:4000
API Key: sk-litellm-master-key

# 3. Refresh models
Settings → Models → Refresh
```

---

### Problem: MCP Gateway Not Starting

```bash
# 1. Check if container exists
docker ps -a | grep mcp-gateway

# 2. Check logs
docker logs mcp-gateway --tail 50

# 3. Rebuild
docker-compose build mcp-gateway
docker-compose up -d mcp-gateway

# 4. Check MCP config
cat mcp.json | jq
```

---

## 🚀 GELECEK PLANLARI

### Q2 2026 (Nisan-Haziran)

**P1 - Kritik:**
- [ ] Production deployment (AWS/Azure)
- [ ] SSL certificates (Let's Encrypt)
- [ ] CDN integration (Cloudflare)
- [ ] Database backups (automated)
- [ ] Monitoring (Grafana + Prometheus)

**P2 - Önemli:**
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced search (Elasticsearch)
- [ ] Image optimization (Cloudinary)
- [ ] Email templates (custom design)

**P3 - Normal:**
- [ ] Multi-language (i18n)
- [ ] Dark mode improvements
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Analytics dashboard

---

### Q3 2026 (Temmuz-Eylül)

**Features:**
- [ ] Video profiles
- [ ] Live streaming
- [ ] AI matchmaking
- [ ] Virtual gifts
- [ ] Subscription tiers

**Infrastructure:**
- [ ] Kubernetes migration
- [ ] Microservices architecture
- [ ] Event-driven (Kafka)
- [ ] Caching layer (Redis)
- [ ] Load balancing

---

### Q4 2026 (Ekim-Aralık)

**AI Enhancements:**
- [ ] Custom fine-tuned model
- [ ] Image generation (escorts)
- [ ] Voice assistants
- [ ] Chatbot improvements
- [ ] Predictive analytics

**Business:**
- [ ] Multi-city expansion
- [ ] Partner integrations
- [ ] Affiliate program
- [ ] Marketing automation
- [ ] Customer support AI

---

## 📊 MONITORING & ALERTING

### Health Checks

```yaml
# docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

### Metrics to Track

**Application:**
- Request rate (req/min)
- Response time (p50, p95, p99)
- Error rate (%)
- Active users

**Database:**
- Connection pool usage
- Query performance
- Disk usage
- Replication lag

**AI:**
- Token usage (input/output)
- Model latency
- Cost per request
- Cache hit rate

**Infrastructure:**
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth

---

### Alerting Rules

```yaml
# Prometheus alerting rules
groups:
  - name: zuhre-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: DatabaseDown
        expr: pg_up == 0
        for: 1m
        annotations:
          summary: "Database is down"

      - alert: LiteLLMUnhealthy
        expr: up{job="litellm"} == 0
        for: 2m
        annotations:
          summary: "LiteLLM proxy is unhealthy"
```

---

## 📚 DOKÜMANTASYON

### Internal Docs

- `API_STATUS_REPORT.md` - API key status
- `FREE_AI_GUIDE.md` - Free AI providers
- `DOCKER_MCP_ANALYSIS.md` - Docker & MCP analysis
- `memory/` - Auto-generated memories

### External Docs

- API Documentation (future: Swagger)
- User Manual (future: GitBook)
- Admin Guide (future: Notion)
- Developer Onboarding (future: README)

---

## 🎯 SUCCESS METRICS

### Technical KPIs

| Metric | Target | Current |
|--------|--------|---------|
| Uptime | 99.9% | - |
| Response Time (p95) | < 500ms | - |
| Error Rate | < 0.1% | - |
| Database Query Time | < 100ms | - |
| AI Token Cost/Day | < $10 | - |

---

### Business KPIs

| Metric | Target (6 months) |
|--------|-------------------|
| Active Users | 10,000 |
| Active Escorts | 500 |
| Monthly Bookings | 5,000 |
| Revenue | $100,000 |
| Customer Satisfaction | 4.5/5 |

---

## 📞 SUPPORT & CONTACT

### Internal Team

- **Developer:** Qwen Code (AI Assistant)
- **Repository:** github.com/zuhreplanet
- **Documentation:** /docs folder

### External Services

- **Email Support:** support@zuhreplanet.com (future)
- **Live Chat:** Open WebUI (internal)
- **Status Page:** status.zuhreplanet.com (future)

---

**Son Güncelleme:** 26 Nisan 2026
**Sonraki Review:** 3 Mayıs 2026
**Sorumlu:** Development Team

---

*Bu doküman canlıdır ve sürekli güncellenir. Son değişiklikleri git history'den kontrol edin.*
