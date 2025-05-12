import Image from "next/image";
import Link from "next/link";

interface Props {
  logoUrl: string | null;
  siteDisplayName: string;
}
export const AuthLinkLogoAuth = ({ logoUrl, siteDisplayName }: Props) => {
  return (
    <Link href="/" className="flex items-center gap-2 self-center font-medium">
      <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
        {logoUrl && <Image src={logoUrl} alt={siteDisplayName} width={20} height={20} />}
      </div>
      {siteDisplayName}
    </Link>
  );
};
