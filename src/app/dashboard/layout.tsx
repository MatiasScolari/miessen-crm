import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sessionUser = session.user as { id?: string; name?: string; email?: string; role?: string };

  let avatar: string | null = null;
  if (sessionUser.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { avatar: true },
    });
    avatar = dbUser?.avatar ?? null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        userName={sessionUser.name || "Usuario"}
        userEmail={sessionUser.email || ""}
        role={sessionUser.role}
        userAvatar={avatar}
      />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
