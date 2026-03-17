import { redirect } from "next/navigation";

export default function LookboardPage() {
  redirect("/dashboard#saved");
}
