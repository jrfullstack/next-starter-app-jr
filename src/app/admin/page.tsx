import Link from "next/link";

import { ContentLayout } from "@/components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

export default function AdminPage() {
  return (
    <ContentLayout title="Panel Principal">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Panel Principal</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex min-h-dvh flex-col items-center justify-center">
        <h1>AdminPage</h1>
        <Link href="/">Back to Home</Link>
        <Link href="/admin/settings">settings</Link>
      </div>
    </ContentLayout>
  );
}
