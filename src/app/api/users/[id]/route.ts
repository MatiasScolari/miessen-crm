import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function checkAdmin(session: any) {
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }
  return null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const denied = await checkAdmin(session);
  if (denied) return denied;

  try {
    const { name, email, password } = await req.json();

    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) {
      const bcrypt = require("bcryptjs");
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  const denied = await checkAdmin(session);
  if (denied) return denied;

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 });
  }
}
