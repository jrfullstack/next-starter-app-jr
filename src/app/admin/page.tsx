import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1>AdminPage</h1>
      <Link href="/">Back to Home</Link>
      <Link href="/admin/settings">settings</Link>
    </main>
  );
}
