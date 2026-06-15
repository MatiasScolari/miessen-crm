import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, email, password, inviteToken } = await req.json();

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

    if (inviteToken) {
      const invite = await prisma.invite.findUnique({
        where: { token: inviteToken },
      });
      if (!invite || invite.used) {
        return NextResponse.json(
          { error: "Invitación inválida o ya usada" },
          { status: 400 }
        );
      }
      if (invite.email !== email) {
        return NextResponse.json(
          { error: "Esta invitación no corresponde a tu email" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: inviteToken ? "user" : "admin",
      },
    });

    if (inviteToken) {
      await prisma.invite.update({
        where: { token: inviteToken },
        data: { used: true },
      });
    }

    return NextResponse.json(
      { message: "Usuario creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear usuario" },
      { status: 500 }
    );
  }
}
