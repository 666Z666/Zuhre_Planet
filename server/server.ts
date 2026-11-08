import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './context';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import bcrypt from 'bcryptjs';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import logger from '@/lib/logger';
import { captureServerError, initServerMonitoring } from './monitoring';
import { env, validateEnvOnStartup } from '@/config/env';
import { securityHeadersMiddleware } from '@/lib/security/headers';
import { getRateLimitHeaders } from '@/lib/security/rateLimit';
import { csrfProtection, ensureCsrfToken } from './csrf';
import {
  AUTH_COOKIE,
  REFRESH_COOKIE,
  issueSession,
  clearSession,
  verifyAccessToken,
  verifyRefreshToken,
  clientIp,
} from './lib/session';
import { normalizeEmail, isDisposableEmail } from './lib/email';
import { checkLoginRate, checkRegisterRate, TOO_MANY_ATTEMPTS } from './lib/authRateLimit';

validateEnvOnStartup();
initServerMonitoring();

const app = express();
const port = env.port;

// Reverse proxy (nginx/Vercel) arkasında doğru istemci IP'si için
if (env.isProduction) {
  app.set('trust proxy', 1);
}
app.disable('x-powered-by');

// Kullanıcı tarafından tetiklenmeyen sabit bcrypt karşılaştırması (zamanlama ile e-posta keşfini önler)
const DUMMY_HASH = bcrypt.hashSync('timing-equalizer-not-a-real-password', 12);

function publicUser(user: { id: number; email: string; fullName: string | null; role: string | null; isVerified: boolean | null; createdAt: Date | null }) {
  return {
    id: String(user.id),
    email: user.email,
    name: user.fullName,
    role: user.role,
    verified: user.isVerified,
    createdAt: user.createdAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

function parseCookieValue(cookieHeader: string | undefined, key: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(';').map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${key}=`));
  return match ? decodeURIComponent(match.slice(key.length + 1)) : null;
}

async function getActiveUserById(userId: number) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });

  if (!user) {
    return null;
  }

  if (user.isBanned) {
    const isExpired = user.banExpiresAt ? user.banExpiresAt <= new Date() : false;

    if (isExpired) {
      const [updatedUser] = await db.update(schema.users)
        .set({ isBanned: false, banExpiresAt: null })
        .where(eq(schema.users.id, user.id))
        .returning();

      return updatedUser ?? user;
    }

    return 'banned' as const;
  }

  return user;
}

const allowedOrigins = env.corsOrigins;

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// --- SECURITY MIDDLEWARES ---

// 1. Security Headers (CORS, CSP, XSS protection, HSTS, etc.)
const applySecHeaders = securityHeadersMiddleware({
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});
app.use((_req: Request, res: Response, next: NextFunction) => {
  applySecHeaders(res);
  next();
});

// 2. CSRF Protection (double-submit cookie) — REST auth VE tRPC mutation'ları korunur
app.use(csrfProtection({ excludePaths: ['/health'] }));

// --- REST AUTH API ---

// İstemci state değiştiren isteklerden önce buradan CSRF token alır
app.get('/api/auth/csrf', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ csrfToken: ensureCsrfToken(req, res) });
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!email || typeof password !== 'string' || password.length === 0 || password.length > 256) {
      return res.status(400).json({ message: 'E-posta ve şifre gereklidir.' });
    }

    const limit = checkLoginRate(email, clientIp(req));
    Object.entries(getRateLimitHeaders(limit)).forEach(([key, value]) => res.setHeader(key, value));
    if (!limit.allowed) {
      return res.status(429).json({ message: TOO_MANY_ATTEMPTS, retryAfter: limit.retryAfter });
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    const isValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !isValid) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });
    }

    const activeUser = await getActiveUserById(user.id);
    if (activeUser === 'banned') {
      return res.status(403).json({ message: 'Hesabınız askıya alındı.' });
    }
    if (!activeUser) {
      return res.status(401).json({ message: 'E-posta veya şifre hatalı.' });
    }

    issueSession(res, activeUser);
    // Token'lar yalnızca HttpOnly çerezde taşınır; JS tarafına verilmez (XSS ile çalınamaz)
    return res.json({ user: publicUser(activeUser) });
  } catch (err) {
    captureServerError(err, { scope: 'auth', action: 'login' });
    logger.error(`Login error: ${err}`);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { password, name, role, phone, termsAccepted } = req.body ?? {};
    const email = normalizeEmail(req.body?.email);

    const limit = checkRegisterRate(clientIp(req));
    if (!limit.allowed) {
      return res.status(429).json({ message: TOO_MANY_ATTEMPTS, retryAfter: limit.retryAfter });
    }

    if (!email || typeof name !== 'string' || name.trim().length < 2 || name.length > 120) {
      return res.status(400).json({ message: 'Eksik veya geçersiz kayıt bilgileri.' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({ message: 'Geçici e-posta adresleriyle kayıt olunamaz.' });
    }

    if (typeof password !== 'string' || password.length < 8 || password.length > 256) {
      return res.status(400).json({ message: 'Şifre en az 8 karakter olmalıdır.' });
    }

    if (termsAccepted !== true) {
      return res.status(400).json({ message: 'Kullanım koşullarını kabul etmelisiniz.' });
    }

    if (phone !== undefined && phone !== null && phone !== '' && (typeof phone !== 'string' || !/^[+\d\s()-]{10,20}$/.test(phone))) {
      return res.status(400).json({ message: 'Geçerli bir telefon numarası girin.' });
    }

    const normalizedRole = role === 'escort' ? 'escort' : 'customer';

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    if (phone) {
      const existingPhone = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, String(phone)),
      });
      if (existingPhone) {
        return res.status(409).json({ message: 'Bu telefon zaten kayıtlı.' });
      }
    }

    const passwordHash = await bcrypt.hash(String(password), 12);
    const [newUser] = await db.insert(schema.users).values({
      email,
      passwordHash,
      fullName: name.trim(),
      role: normalizedRole,
      phoneNumber: phone ? String(phone) : null,
      provider: 'email',
      hasAcceptedTerms: true,
      termsAcceptedAt: new Date(),
      isProfileComplete: true,
    }).returning();

    if (normalizedRole === 'escort') {
      await db.insert(schema.escortProfiles).values({
        userId: newUser.id,
        stageName: newUser.fullName ?? 'Escort',
        city: 'İstanbul',
        visibilityStatus: 'hidden',
      }).onConflictDoNothing();
    } else {
      await db.insert(schema.customerProfiles).values({
        userId: newUser.id,
      }).onConflictDoNothing();
    }

    issueSession(res, newUser);
    return res.status(201).json({ user: publicUser(newUser) });
  } catch (err) {
    captureServerError(err, { scope: 'auth', action: 'register' });
    logger.error(`Register error: ${err}`);
    return res.status(500).json({ message: 'Kayıt sırasında sunucu hatası.' });
  }
});

app.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const token = req.cookies[AUTH_COOKIE];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyAccessToken(token);
    
    const user = await getActiveUserById(decoded.userId);

    if (user === 'banned') return res.status(403).json({ message: 'Account suspended' });
    if (!user) return res.status(401).json({ message: 'User not found' });

    res.json(publicUser(user));
  } catch (err) {
    captureServerError(err, { scope: 'auth', action: 'me' });
    logger.error(`Auth/me error: ${err}`);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  clearSession(res);
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token bulunamadı.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await getActiveUserById(decoded.userId);

    if (user === 'banned') {
      clearSession(res);
      return res.status(403).json({ message: 'Hesabınız askıya alındı.' });
    }

    if (!user) {
      clearSession(res);
      return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
    }

    issueSession(res, user);
    return res.json({ success: true });
  } catch (err) {
    captureServerError(err, { scope: 'auth', action: 'refresh' });
    logger.error(`Refresh token error: ${err}`);
    return res.status(401).json({ message: 'Refresh token geçersiz.' });
  }
});

app.patch('/api/auth/profile', async (req: Request, res: Response) => {
  try {
    const token = req.cookies[AUTH_COOKIE];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let decoded: { userId: number };
    try {
      decoded = verifyAccessToken(token);
    } catch {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const currentUser = await getActiveUserById(decoded.userId);
    if (currentUser === 'banned') {
      return res.status(403).json({ message: 'Hesabınız askıya alındı.' });
    }
    if (!currentUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const updatePayload: Partial<schema.NewUser> = {};
    const { name, phone } = req.body ?? {};

    if (typeof name === 'string' && name.trim().length >= 2 && name.trim().length <= 120) {
      updatePayload.fullName = name.trim();
    }

    if (typeof phone === 'string' && /^[+\d\s()-]{10,20}$/.test(phone.trim()) && phone.trim() !== currentUser.phoneNumber) {
      const existingPhone = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, phone.trim()),
      });
      if (existingPhone && existingPhone.id !== currentUser.id) {
        return res.status(409).json({ message: 'Bu telefon başka bir hesapta kullanılıyor.' });
      }
      updatePayload.phoneNumber = phone.trim();
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.json(publicUser(currentUser));
    }

    const [updatedUser] = await db.update(schema.users)
      .set(updatePayload)
      .where(eq(schema.users.id, currentUser.id))
      .returning();

    return res.json(publicUser(updatedUser));
  } catch (err) {
    captureServerError(err, { scope: 'auth', action: 'profile_update' });
    logger.error(`Profile update error: ${err}`);
    return res.status(500).json({ message: 'Profil güncellenemedi.' });
  }
});

// tRPC middleware
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/health', async (_req: Request, res: Response) => {
  try {
    await db.select({ id: schema.users.id }).from(schema.users).limit(1);
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    captureServerError(error, { scope: 'health' });
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  captureServerError(error, { scope: 'express' });
  logger.error(error instanceof Error ? error.stack || error.message : String(error));

  res.status(500).json({
    message: 'Sunucu tarafında beklenmeyen bir hata oluştu.',
  });
});

const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });
const activeSockets = new Set<WebSocket>();

// Rate limit tracking
const messageCounts = new Map<WebSocket, { count: number, lastReset: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_MESSAGES_PER_WINDOW = 100;

wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
  // Cross-Site WebSocket Hijacking koruması: çerez tabanlı auth olduğu için Origin zorunlu ve izinli olmalı
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.includes(origin)) {
    ws.close(4003, 'Forbidden origin');
    return;
  }

  // Token yalnızca HttpOnly çerezden okunur — URL query string'de JWT kabul edilmez (log/referer sızıntısı)
  const token = parseCookieValue(req.headers.cookie, AUTH_COOKIE);
  let authenticatedUserId: number | null = null;

  if (token) {
    try {
      authenticatedUserId = verifyAccessToken(token).userId;
    } catch {
      ws.close(4001, 'Unauthorized: Invalid Token');
      return;
    }
  } else {
    ws.close(4001, 'Unauthorized: Missing Token');
    return;
  }

  logger.info('Client connected to WebSocket');
  activeSockets.add(ws);
  messageCounts.set(ws, { count: 0, lastReset: Date.now() });

  if (authenticatedUserId !== null) {
    const presencePayload = JSON.stringify({
      type: 'presence',
      data: {
        userId: String(authenticatedUserId),
        status: 'online',
        isOnline: true,
        lastSeen: new Date().toISOString(),
      },
    });

    activeSockets.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(presencePayload);
      }
    });
  }

  ws.on('message', (message) => {
    // Message size limit (1MB)
    if (Buffer.byteLength(message as any) > 1024 * 1024) {
      logger.warn('Message too large, dropping connection');
      ws.close(1009, 'Message too large');
      return;
    }

    // Basic Rate Limiting
    const now = Date.now();
    const stats = messageCounts.get(ws);
    if (stats) {
      if (now - stats.lastReset > RATE_LIMIT_WINDOW) {
        stats.count = 0;
        stats.lastReset = now;
      }
      stats.count++;
      if (stats.count > MAX_MESSAGES_PER_WINDOW) {
        logger.warn('Rate limit exceeded for client');
        ws.send(JSON.stringify({ type: 'error', message: 'Rate limit exceeded' }));
        return;
      }
    }

    try {
      const parsed = JSON.parse(message.toString()) as { type?: string; data?: Record<string, unknown> };

      if (parsed.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', data: { timestamp: new Date().toISOString() } }));
        return;
      }

      if (parsed.type === 'presence' && authenticatedUserId !== null) {
        const presencePayload = JSON.stringify({
          type: 'presence',
          data: {
            userId: String(authenticatedUserId),
            status: typeof parsed.data?.status === 'string' ? parsed.data.status : 'online',
            isOnline: true,
            lastSeen: new Date().toISOString(),
          },
        });

        activeSockets.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(presencePayload);
          }
        });
      }
    } catch {
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Geçersiz WebSocket mesaj formatı.' },
      }));
    }
  });

  ws.on('close', () => {
    activeSockets.delete(ws);
    messageCounts.delete(ws);

    if (authenticatedUserId !== null) {
      const presencePayload = JSON.stringify({
        type: 'presence',
        data: {
          userId: String(authenticatedUserId),
          status: 'offline',
          isOnline: false,
          lastSeen: new Date().toISOString(),
        },
      });

      activeSockets.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(presencePayload);
        }
      });
    }

    logger.info('Client disconnected from WebSocket');
  });

  ws.on('error', (error) => {
    captureServerError(error, { scope: 'websocket' });
    logger.error(`WebSocket error: ${error}`);
  });
});

process.on('unhandledRejection', (error) => {
  captureServerError(error, { scope: 'process', type: 'unhandledRejection' });
});

process.on('uncaughtException', (error) => {
  captureServerError(error, { scope: 'process', type: 'uncaughtException' });
});

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
  logger.info(`tRPC endpoint: http://localhost:${port}/api/trpc`);
  logger.info(`WebSocket endpoint: ws://localhost:${port}/ws`);
});
