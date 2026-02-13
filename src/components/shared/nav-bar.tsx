import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "./mode-toggle";
import { useNavigate } from "react-router";

export function NavBar({ showButton = true } : { showButton?: boolean }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 flex w-full h-16 items-center justify-between border-b bg-background px-4 md:px-6 mb-4">
      <h1 className="text-xl font-semibold" onClick={() => navigate("/dashboard")}>MD GOOEY</h1>
      <div className="space-x-2 flex items-center">
        <ModeToggle />
        {showButton && (
          <Button
          size="lg"
          onClick={() => navigate("/simulation/new/1")}
        >
          <Plus />
          new simulation
        </Button>
        )}
        
      </div>
    </header>
  );
}
