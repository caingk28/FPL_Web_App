import { FPLForm } from '@/components/fpl-form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Fantasy Premier League App</h1>
          <p className="text-lg text-gray-600">
            Enter your FPL Team ID or League ID to get started
          </p>
        </div>
        <FPLForm />
      </div>
    </main>
  )
} 