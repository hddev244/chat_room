"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod"

type formType = {
    type: 'login' | 'register' | 'forgot-password'
}

const formSchema = z.object({
    username: z.string()
        .min(6, { message: "Tên đăng nhập phải có ít nhất 6 kí tự" })
        .max(50, { message: "Tên đăng nhập không được quá 50 kí tự" }),
    email: z.string().email({ message: "Email Không hop lệ!" }),
    password: z.string()
        .min(6, { message: "Mật khẩu phải có ít nhất 6 kí tự" })
        .max(100, { message: "Mật khẩu không được quá 100 kí tự" }),
})

export default function FormRegister() {
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        const payload = {
            username: values.username,
            email: values.email,
            password: values.password
        }
        axios.post("/api/auth/register", payload)
            .then(res => {
                toast("Thành công", {
                    description: res.data.message,
                })
                setTimeout(() => {
                    router.push("/login");
                }, 500)
            })
            .catch(err => {
                toast("Lỗi", {
                    description: err.response.data.message,
                })
            })
    }
    return (
        <>
            <Card className="w-[30rem] !rounded-[2rem] p-6">
                <CardHeader>
                    <CardTitle>Đăng ký tài khoản</CardTitle>
                    <CardDescription>Nhập thông tin đăng ký của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="w-full !mt-6 "
                                type="submit">
                                Đăng ký
                            </Button>
                        </form>
                        <div className="text-center mt-4">
                            <span>Bạn đã có tài khoản? </span>
                            <Link href="/login" className="text-primary underline">
                                Đăng nhập
                            </Link>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}