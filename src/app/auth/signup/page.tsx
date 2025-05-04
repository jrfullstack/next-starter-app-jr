import { redirect } from "next/navigation";

import { getAppConfig } from "@/actions/config/get-app-config";
import { auth } from "@/auth";
import { AuthLinkLogoAuth, SignUpDisable, SignUpForm } from "@/components";

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  const appConfig = await getAppConfig();

  const { isEmailConfigured, emailUser } = appConfig;
  return (
    <main className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <AuthLinkLogoAuth siteDisplayName={appConfig.siteDisplayName} logoUrl={appConfig.logoUrl} />

        {appConfig.isUserSignUpEnabled ? (
          <SignUpForm appConfig={appConfig} />
        ) : (
          <SignUpDisable isEmailConfigured={isEmailConfigured} emailUser={emailUser} />
        )}
      </div>
    </main>
  );
}
