"use client";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const page = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/app/chat/${nanoid()}`);
  }, []);
  return <></>;
};

export default page;
