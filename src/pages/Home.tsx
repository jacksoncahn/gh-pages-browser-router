import { AppFooter } from '@/components/shared/app-footer'
import { NavBar } from '@/components/shared/nav-bar'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex flex-col py-4">
      <NavBar showButton={false} />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-5xl font-bold mb-4">Welcome to MD Gooey</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Some text that we write about molecular dynamics and the purpose of the website. Get started by creating a
            new simulation, or browsing our selection of pre-run options to see what's posisble.
          </p>
          <div className="flex gap-4 justify-center">
            {/* NOTE: This might have to become a sign in/sign up button eventually */}
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/simulation/new')}>
              Create New Simulation
            </Button>
          </div>
        </div>
      </div>
      <AppFooter />
    </main>
  )
}
