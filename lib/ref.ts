import { cookies } from "next/headers";

const REF_COOKIE = "nix_ref";

export async function getAffiliateRefCookie(): Promise<string | null> {
  const raw = (await cookies()).get(REF_COOKIE)?.value?.trim().toUpperCase();
  return raw && /^[A-Z0-9_-]{4,24}$/.test(raw) ? raw : null;
}
