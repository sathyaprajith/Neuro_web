import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import { validateContactInput } from './contactValidation.mjs';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4300);

app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);
app.use(express.json({ limit: '1mb' }));

let createRateLimitStore = () => undefined;
if (process.env.REDIS_URL) {
  const redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', () => {});
  try {
    await redisClient.connect();
    createRateLimitStore = (prefix) => new RedisStore({
      prefix,
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
  } catch {
    await redisClient.quit().catch(() => {});
    console.warn('Redis unavailable; using process-local rate limiting.');
  }
}

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many contact attempts. Please try again later.' },
  statusCode: 429,
  store: createRateLimitStore('contact:'),
});

const appLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  store: createRateLimitStore('app:'),
});

app.use('/app', appLimiter);
app.use('/api', appLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'neuro-paradigm-api', time: new Date().toISOString() });
});

function buildMailTransport() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS || !process.env.CONTACT_EMAIL || !process.env.FROM_EMAIL) {
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT || 587),
    secure: String(EMAIL_SECURE ?? 'false') === 'true',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  const result = validateContactInput(req.body ?? {});
  if (!result.valid) {
    return res.status(400).json({ message: 'Please correct the form errors.', errors: result.errors });
  }

  const transporter = buildMailTransport();
  if (!transporter) {
    return res.status(503).json({
      message: 'The contact email provider is not configured. Please configure SMTP environment variables to enable submissions.',
    });
  }

  const { name, email, subject, message, affiliation } = result.sanitized;

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[Neuro Paradigm] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject}`,
        `Affiliation: ${affiliation || 'Not provided'}`,
        `Submitted: ${new Date().toISOString()}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    });

    return res.status(200).json({ ok: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact email failure:', error instanceof Error ? error.message : error);
    return res.status(502).json({ message: 'Unable to deliver the message right now. Please try again later.' });
  }
});

app.get(['/app', '/app/login'], (_req, res) => {
  res.type('html').send(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Neuro Paradigm — Team Access</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #f5efe7; color: #1e1a17; margin: 0; display: grid; place-items: center; min-height: 100vh; }
          .card { max-width: 420px; background: white; border-radius: 18px; padding: 32px; box-shadow: 0 18px 40px rgba(0,0,0,.08); }
          h1 { margin-top: 0; }
          p { color: #564d48; }
          .badge { display: inline-block; background: #fae7e1; color: #ae4d38; padding: 6px 10px; border-radius: 999px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <main class="card">
          <span class="badge">Internal access</span>
          <h1>Team login</h1>
          <p>This placeholder internal tracker is intentionally not exposing demo credentials.</p>
          <p>Production authentication is expected to be configured behind this route using PostgreSQL and a secure session layer.</p>
        </main>
      </body>
    </html>
  `);
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Neuro Paradigm API listening on http://localhost:${port}`);
});
