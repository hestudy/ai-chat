"use client";

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

const page = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
              render={() => {
                return (
                  <FormItem className="mb-2">
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
          </Form>
        </CardContent>
        <CardFooter className="block space-y-2">
          <Button className="w-full">登录</Button>
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
