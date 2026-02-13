import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function NotFound() {
    const navigate = useNavigate();
    
    return (
        <main className="text-center h-screen flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            <p className="mt-4">Sorry, the page you are looking for does not exist.</p>
            <Button className="mt-6" onClick={() => navigate("/dashboard")}>
                Go Back Home
            </Button>
        </main>
    )
}