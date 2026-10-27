import { redirect } from "next/navigation";

// Customer accounts are no longer used; the only logged-in area is /admin.
export default function DashboardPage() {
  redirect("/admin");
}
