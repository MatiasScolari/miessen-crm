import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Solo administradores" }, { status: 403 });
  }

  try {
    const { status } = await req.json();

    if (!status || !["active", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error al cambiar estado" }, { status: 500 });
  }
}
