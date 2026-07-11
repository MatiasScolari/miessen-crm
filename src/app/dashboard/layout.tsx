import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
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

  const user = session.user as { name?: string; email?: string; role?: string };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        userName={user.name || "Usuario"}
        userEmail={user.email || ""}
        role={user.role}
      />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
