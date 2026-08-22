import "server-only";
import { cookies, headers } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { repo, usingSupabase } from "@/lib/db";
import type { Profile } from "@/lib/types";

const COOKIE = "prepai_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  return process.env.AUTH_SECRET || "prepai-dev-secret-change-me";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function encode(userId: string) {
  const body = Buffer.from(JSON.stringify({ uid: userId, iat: Date.now() })).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string | undefined): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as { uid: string; iat: number };
    if (Date.now() - parsed.iat > MAX_AGE * 1000) return null;
    return parsed.uid;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  const h = await headers();
  // Over HTTPS we must use SameSite=None so the cookie survives being loaded
  // inside an iframe (workspace previews, embedded demos). SameSite=None is
  // only legal together with Secure, so plain-HTTP localhost stays on Lax.
  const isHttps = (h.get("x-forwarded-proto") ?? "http").split(",")[0].trim() === "https";
  jar.set(COOKIE, encode(userId), {
    httpOnly: true,
    sameSite: isHttps ? "none" : "lax",
    secure: isHttps,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Current signed-in user (or null). Cached per request. */
export async function getCurrentUser(): Promise<Profile | null> {
  const jar = await cookies();
  const uid = decode(jar.get(COOKIE)?.value);
  if (!uid) return null;
  const profile = await repo.getProfile(uid);
  if (!profile) return null;
  return normaliseSubscription(profile);
}

/** Flip 'active' → 'expired' once the expiry date has passed. */
function normaliseSubscription(p: Profile): Profile {
  if (
    p.subscription_status === "active" &&
    p.subscription_expires_at &&
    new Date(p.subscription_expires_at).getTime() < Date.now()
  ) {
    void repo.updateProfile(p.id, { subscription_status: "expired" });
    return { ...p, subscription_status: "expired" };
  }
  return p;
}

export function isSubscribed(p: Profile | null): boolean {
  if (!p) return false;
  if (p.role === "admin") return true;
  if (p.subscription_status !== "active") return false;
  if (!p.subscription_expires_at) return false;
  return new Date(p.subscription_expires_at).getTime() > Date.now();
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: Profile;
}

export async function signUp(input: {
  email: string;
  password: string;
  full_name: string;
}): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (input.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  if (!input.full_name.trim()) return { ok: false, error: "Please enter your full name." };

  if (usingSupabase) {
    const { admin } = await import("@/lib/db/supabase");
    const { data, error } = await admin().auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.full_name },
    });
    if (error || !data.user) return { ok: false, error: error?.message ?? "Could not create account." };
    // the handle_new_user trigger creates the profile row
    const profile = await repo.getProfile(data.user.id);
    await setSessionCookie(data.user.id);
    return { ok: true, user: profile ?? undefined };
  }

  const existing = await repo.getUserByEmail(email);
  if (existing) return { ok: false, error: "An account with this email already exists." };
  const user = await repo.createUser({
    email,
    password_hash: bcrypt.hashSync(input.password, 10),
    full_name: input.full_name.trim(),
  });
  await setSessionCookie(user.id);
  const { password_hash: _pw, ...profile } = user;
  void _pw;
  return { ok: true, user: profile };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const mail = email.trim().toLowerCase();

  if (usingSupabase) {
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const { data, error } = await client.auth.signInWithPassword({ email: mail, password });
    if (error || !data.user) return { ok: false, error: "Incorrect email or password." };
    await setSessionCookie(data.user.id);
    const profile = await repo.getProfile(data.user.id);
    return { ok: true, user: profile ?? undefined };
  }

  const user = await repo.getUserByEmail(mail);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return { ok: false, error: "Incorrect email or password." };
  }
  await setSessionCookie(user.id);
  const { password_hash: _pw, ...profile } = user;
  void _pw;
  return { ok: true, user: profile };
}

export async function signOut() {
  await clearSessionCookie();
}
