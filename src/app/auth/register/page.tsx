"use client";

import { register } from "@/actions/register";
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
import { RegisterData, registerSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequest } from "ahooks";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  const { run, loading } = useRequest(
    async () => {
      if (await form.trigger()) {
        const res = await register(form.getValues());
        if (res.success) {
          toast.success("注册成功，请登录");
          router.replace("/auth/login");
        } else {
          toast.error(res.error?.toString() || "注册失败");
        }
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
          <CardDescription>加入我们，开启体验</CardDescription>
        </CardHeader>
        <Separator></Separator>
        <CardContent
          className="pt-2 space-y-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run();
            }
          }}
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
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
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
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
          <Button className="w-full" disabled={loading} onClick={run}>
            注册
          </Button>
          <Link href={"/auth/login"} replace className="block">
            <Button className="w-full" variant={"ghost"}>
              返回登录
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
