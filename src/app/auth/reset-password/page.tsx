import { redirect } from "next/navigation";

import { getAppConfig } from "@/actions/config/get-app-config";
import { auth } from "@/auth";
import { AuthLinkLogoAuth, ResetPasswordForm } from "@/components";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Readonly<Props>) {
  const session = await auth();
  if (session) redirect("/");

  // Si no hay token en la URL, redirige a forgot-password
  const params = await searchParams;
  if (!params.token) {
    redirect("/auth/forgot-password");
  }

  const { siteDisplayName, logoUrl } = await getAppConfig();

  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <AuthLinkLogoAuth siteDisplayName={siteDisplayName} logoUrl={logoUrl} />
        <ResetPasswordForm token={params.token} />
      </div>
    </main>
  );
}
