import { redirect } from "next/navigation";

// Customers don't need an account: they subscribe and pay straight from the
// plans section. Anyone landing here is sent there instead.
export default function SignupPage() {
  redirect("/#plans");
}
