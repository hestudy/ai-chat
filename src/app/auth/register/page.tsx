"use client";

import { RegisterData, registerSchema } from "@/app/actions/register";
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
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const page = () => {
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="w-full md:max-w-md mx-auto h-screen flex items-center px-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ai Chat</CardTitle>
          <CardDescription>登录进去享受世界</CardDescription>
        </CardHeader>
        <Separator></Separator>
        <CardContent className="pt-2 space-y-2">
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              control={form.control}
              name="email"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input type="password"></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            ></FormField>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input type="password"></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                );
              }}
            ></FormField>
          </Form>
        </CardContent>
        <CardFooter className="block space-y-2">
          <Button className="w-full">注册</Button>
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
