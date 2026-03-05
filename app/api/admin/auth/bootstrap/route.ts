import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  hashAdminPassword,
  validatePasswordPolicy,
  signAdminSession,
  getSessionCookieName,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "username, email and password are required" },
        { status: 400 },
      );
    }

    if (!validatePasswordPolicy(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 10 characters and include uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      );
    }

    const { data: existingSuperAdmin, error: checkError } = await supabaseServer
      .from("admin_users")
      .select("id")
      .eq("role", "SUPER_ADMIN")
      .limit(1)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingSuperAdmin) {
      return NextResponse.json(
        { error: "SUPER_ADMIN already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await hashAdminPassword(password);

    const { data: created, error: insertError } = await supabaseServer
      .from("admin_users")
      .insert({
        username,
        email: String(email).toLowerCase(),
        password_hash: passwordHash,
        role: "SUPER_ADMIN",
        status: "active",
      })
      .select("id, username, email, role")
      .single();

    if (insertError || !created) {
      throw insertError || new Error("Failed to create SUPER_ADMIN");
    }

    const token = signAdminSession({
      adminId: created.id,
      username: created.username,
      email: created.email,
      role: created.role,
    });

    const response = NextResponse.json({
      success: true,
      admin: created,
      message: "SUPER_ADMIN bootstrapped successfully",
    });

    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error: any) {
    console.error("Error bootstrapping admin:", error);
    return NextResponse.json(
      { error: error.message || "Failed to bootstrap admin" },
      { status: 500 },
    );
  }
}
