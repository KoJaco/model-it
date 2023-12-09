import { ModeToggle } from "~/app/_components/theme/mode-toggle";

export default function Dashboard() {
  return (
    <>
      <header className="top0 absolute flex w-full justify-between px-4 py-8">
        {/* theme toggle */}
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-200 text-neutral-900 dark:from-neutral-800 dark:to-neutral-900 dark:text-white"></main>
    </>
  );
}
