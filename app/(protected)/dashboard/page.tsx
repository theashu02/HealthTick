import { Scheduler } from '@/app/components/dashboard/Schaduler';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Select a date to view and schedule your meetings.
        </p>
      </header>
      <Scheduler />
    </div>
  );
}
