import { redirect } from "next/navigation";

import { getAppConfig } from "@/actions/config/get-app-config";
import { auth } from "@/auth";
import { AuthLinkLogoAuth, VerifyUserForm } from "@/components";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyUserPage({ searchParams }: Readonly<Props>) {
  const session = await auth();

  if (session?.user.emailVerified) redirect("/");

  // Si no está logueado y no hay token en la URL, redirige a login
  const params = await searchParams;
  if (!session && !params.token) {
    redirect("/auth/signin");
  }

  const { siteDisplayName, logoUrl } = await getAppConfig();

  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <AuthLinkLogoAuth siteDisplayName={siteDisplayName} logoUrl={logoUrl} />
        <VerifyUserForm />
      </div>
    </main>
  );
}
