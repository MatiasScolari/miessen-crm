import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function checkAdmin(session: any) {
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const session = await auth();
  const denied = await checkAdmin(session);
  if (denied) return denied;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: { select: { clients: true } },
    },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await auth();
  const denied = await checkAdmin(session);
  if (denied) return denied;

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "user" },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
