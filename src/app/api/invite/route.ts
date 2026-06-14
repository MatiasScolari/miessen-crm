import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este usuario ya está registrado" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.invite.create({
      data: {
        email,
        token,
        createdBy: session.user.id,
      },
    });

    const inviteUrl = `${process.env.NEXTAUTH_URL}/register?token=${token}&email=${encodeURIComponent(email)}`;

    return NextResponse.json({
      message: "Invitación creada",
      inviteUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear invitación" }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  const invites = await prisma.invite.findMany({
    where: { createdBy: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invites);
}
