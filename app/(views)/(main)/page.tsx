import { HomeHeader } from "../../components/home/home-header";
import { HomeWeeklySequence } from "../../components/home/home-weekly-sequence";
import { ProgressTracker } from "../../components/home/progress-tracker";
import { FloatingNavbar } from "../../components/common/floating-navbar";
import { UserStats } from "../../components/home/user-stats";

export default function Home() {
  return (
    <div className="bg-background mx-auto flex min-h-screen flex-col">
      <HomeHeader />
      <div className="gap-8 pb-28 px-4 sm:px-6 md:px-10">
        <ProgressTracker streakCount={121} />
          <UserStats />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* <HomeWeeklySequence /> */}
        </div>
      </div>
    </div>
  );
}
