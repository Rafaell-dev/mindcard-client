import Image from "next/image";
import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/user";
import { getCurrentUserId } from "@/app/lib/session";
import { ProfileForm } from "./components/profile-form";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await getUser(userId);

  const userName = user?.nome || "Usuário";
  const userHandle = user?.usuario || "user";
  const memberSince = user?.dataRegistro
    ? new Date(user.dataRegistro).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="relative w-full overflow-hidden rounded-b-[32px] flex flex-col justify-between bg-accent px-6 py-6 sm:px-8 sm:py-8 h-36 lg:44">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="relative flex size-16 shrink-0 items-center justify-center rounded-full ring-4 ring-background/40">
              <Image
                src="/avatars/avatar.svg"
                alt="Avatar"
                className="rounded-full"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black leading-none">{userName}</h1>
              <span className="text-sm text-fox-gray">@{userHandle}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="mt-2 text-sm text-fox-gray">
            Por aqui desde {memberSince}
          </span>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 px-6 py-6 sm:px-8">
        <ProfileForm user={user} userId={userId} />
      </main>
    </div>
  );
}
