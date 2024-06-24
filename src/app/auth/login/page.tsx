"use client";

import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LoginData, loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  const form = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const { run, loading } = useRequest(
    async () => {
      if (await form.trigger()) {
        const res = await login(form.getValues());
        if (!res.success) {
          toast.error(res.error);
          return;
        }
        toast.success("登录成功");
        router.replace("/");
      }
    },
    {
      manual: true,
    }
  );

  return (
    <div className="w-full md:max-w-md mx-auto h-screen flex items-center px-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ai Chat</CardTitle>
          <CardDescription>登录进去享受世界</CardDescription>
        </CardHeader>
        <Separator></Separator>
        <CardContent className="pt-2">
          <Form {...form}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem className="mb-2">
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input {...field} type="password"></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            ></FormField>
          </Form>
        </CardContent>
        <CardFooter className="block space-y-2">
          <Button className="w-full" onClick={run} disabled={loading}>
            登录
          </Button>
          <Link href={"/auth/register"} className="block" replace>
            <Button className="w-full" variant={"ghost"}>
              注册
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
