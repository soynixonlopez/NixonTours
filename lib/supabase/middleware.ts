import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const REF_PARAM = "ref";
const REF_COOKIE = "nix_ref";

function sanitizeRef(raw: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim().toUpperCase();
  return /^[A-Z0-9_-]{4,24}$/.test(v) ? v : null;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const ref = sanitizeRef(request.nextUrl.searchParams.get(REF_PARAM));
  if (ref) {
    supabaseResponse.cookies.set(REF_COOKIE, ref, {
      path: "/",
      maxAge: 60 * 60 * 24 * 45,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }

  const isCustomerAccount = request.nextUrl.pathname.startsWith("/mi-cuenta");
  if (isCustomerAccount) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set(
        "next",
        `${request.nextUrl.pathname}${request.nextUrl.search}`
      );
      return NextResponse.redirect(login);
    }
  }

  const isAdminArea =
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminArea) {
    if (!user) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set(
        "next",
        `${request.nextUrl.pathname}${request.nextUrl.search}`
      );
      return NextResponse.redirect(login);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      const home = new URL("/", request.url);
      home.searchParams.set("error", "solo_admin");
      return NextResponse.redirect(home);
    }
  }

  return supabaseResponse;
}
