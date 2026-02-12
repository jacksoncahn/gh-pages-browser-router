import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ModeToggle } from "./mode-toggle";

export function NavBar() {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6 z-10">
      <h1 className="text-lg font-semibold">MD GOOEY</h1>
      <div className="space-x-2 flex items-center">
        <ModeToggle />
        <Button
          size="lg"
          onClick={() => {
            console.log("clicked new sim");
          }}
        >
          <Plus />
          new simulation
        </Button>
      </div>
    </header>
  );
}
