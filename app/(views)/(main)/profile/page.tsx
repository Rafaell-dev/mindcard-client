import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser } from "@/app/api/v1/user/actions";
import { getCurrentUserId } from "@/app/lib/session";
import { ProfileForm } from "./components/profile-form";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await getUser(userId);

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex flex-col flex-1 px-6 sm:px-8 gap-6">
        <h2 className="text-3xl font-black leading-none">Perfil</h2>
        <ProfileForm user={user} userId={userId} />
      </main>
    </div>
  );
}
