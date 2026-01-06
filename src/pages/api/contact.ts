export const prerender = false;
import nodemailer from 'nodemailer';
import type { APIRoute } from 'astro';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST,
  port: Number(import.meta.env.SMTP_PORT),
  secure: Number(import.meta.env.SMTP_PORT) === 465, // TLS for port 465
  auth: { user: import.meta.env.SMTP_USER, pass: import.meta.env.SMTP_PASS },
});

// Rate limiter with cleanup
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000;

// Cleanup old entries every 10 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap) {
    if (now > value.resetTime) rateLimitMap.delete(key);
  }
}, 10 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function sanitizeForHeader(value: string): string {
  return value.replace(/[\r\n\t]/g, '').trim();
}

function getClientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Spam detection heuristics
function isLikelySpam(name: string, email: string, subject: string, message: string): boolean {
  const combined = `${name} ${subject} ${message}`.toLowerCase();
  
  // Excessive URLs
  const urlCount = (combined.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) return true;
  
  // Common spam patterns
  const spamPatterns = [
    /\bcrypto\s*(investment|trading|profit)/i,
    /\bmake\s*\$?\d+.*?(day|hour|week)/i,
    /\b(viagra|cialis|casino|lottery|winner)/i,
    /\bdear\s+(sir|madam|friend|beneficiary)/i,
    /\bclick\s+here\s+now/i,
    /\burgent.*?(reply|response|action)/i,
  ];
  
  for (const pattern of spamPatterns) {
    if (pattern.test(combined)) return true;
  }
  
  // Suspicious email patterns (disposable/temporary email services)
  const disposableDomains = ['tempmail', 'guerrillamail', '10minutemail', 'throwaway', 'mailinator'];
  const emailDomain = email.split('@')[1]?.toLowerCase() || '';
  if (disposableDomains.some(d => emailDomain.includes(d))) return true;
  
  // All caps message (often spam)
  if (message.length > 50 && message === message.toUpperCase()) return true;
  
  return false;
}

// Check for honeypot and timing (add hidden field + timestamp to your form)
function validateHoneypot(formData: FormData): boolean {
  const honeypot = formData.get('website'); // Hidden field that should be empty
  if (honeypot) return false; // Bot filled it in
  
  const timestamp = formData.get('_timestamp');
  if (timestamp) {
    const submissionTime = Date.now() - Number(timestamp);
    // Form filled in less than 2 seconds = likely bot
    if (submissionTime < 2000) return false;
    // Form older than 30 minutes = likely stale/replayed
    if (submissionTime > 30 * 60 * 1000) return false;
  }
  
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const ip = getClientIp(request);
    
    // Rate limiting
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate content type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid form data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Honeypot & timing check
    if (!validateHoneypot(formData)) {
      // Silently reject but return success (don't let bots know they failed)
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    // Validation
    if (!email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Email, subject, and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (name.length > 100 || subject.length > 200 || message.length > 10000) {
      return new Response(
        JSON.stringify({ error: 'Input exceeds maximum length' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Minimum message length
    if (message.length < 10) {
      return new Response(
        JSON.stringify({ error: 'Message is too short' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Spam check
    if (isLikelySpam(name, email, subject, message)) {
      // Log for review but don't tell sender
      console.warn(`Spam detected from ${ip}: ${email}`);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Escape for HTML
    const safeName = escapeHtml(name) || 'No name provided';
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const safeIp = escapeHtml(ip);

    await transporter.sendMail({
      from: import.meta.env.MAIL_FROM,
      to: import.meta.env.MAIL_TO,
      replyTo: sanitizeForHeader(email),
      subject: `Contact Form: ${sanitizeForHeader(subject)}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
          <h2 style="color: #2d3748; margin-bottom: 16px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #718096; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #2d3748;"><strong>${safeName}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Email:</td>
              <td style="padding: 8px 0; color: #2d3748;"><a href="mailto:${safeEmail}" style="color: #3182ce; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Subject:</td>
              <td style="padding: 8px 0; color: #2d3748;">${safeSubject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; color: #2d3748; white-space: pre-line;">${safeMessage}</td>
            </tr>
          </table>
          <hr style="margin: 32px 0 16px 0; border: none; border-top: 1px solid #e2e8f0;">
          <div style="font-size: 12px; color: #a0aec0;">
            <p style="margin: 4px 0;">Sender IP: ${safeIp}</p>
            <p style="margin: 4px 0;">Sent from <a href="https://snowdoniastudio.com" style="color: #3182ce; text-decoration: none;">snowdoniastudio.com</a></p>
          </div>
        </div>
      `,
      text: `New Contact Form Submission\n\nName: ${name || 'No name provided'}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSender IP: ${ip}`,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};