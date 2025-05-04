import { redirect } from "next/navigation";

import { getAppConfig } from "@/actions/config/get-app-config";
import { auth } from "@/auth";
import { AuthLinkLogoAuth, ResendVerificationForm } from "@/components";

export default async function ResendVerificationPage() {
  const session = await auth();
  if (session?.user.emailVerified) redirect("/");
  const { siteDisplayName, logoUrl } = await getAppConfig();
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <AuthLinkLogoAuth siteDisplayName={siteDisplayName} logoUrl={logoUrl} />

        <ResendVerificationForm />
      </div>
    </main>
  );
}
