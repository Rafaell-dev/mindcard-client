import { redirect } from "next/navigation";
import { getMindcardsByUserId } from "@/app/api/v1/mindcard/actions";
import { getCurrentUserId } from "@/app/lib/session";
import { MindcardsList } from "./components/mindcards-list";

export default async function Practice() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const mindcards = await getMindcardsByUserId(userId);

  return <MindcardsList initialMindcards={mindcards} />;
}
