import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const layout = async (props: PropsWithChildren<{}>) => {
  const user = await validateRequest();
  if (!user?.session) {
    return redirect("/auth/login");
  }
  return <>{props.children}</>;
};

export default layout;
