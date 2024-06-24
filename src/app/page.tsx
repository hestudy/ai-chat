import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div>
      <Button>demo</Button>
    </div>
  );
}
