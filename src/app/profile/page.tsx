'use client'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Car } from "lucide-react";
import type { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAppContext } from "../AppProvvider";
import { IUser } from "@/server/models/User.model";
''
const formSchema = z.object({
    username: z.string().min(3).max(20),
});

const Page: NextPage = () => {
    const { currentUser, setCurrentUser } = useAppContext();
    const [avatarChangeUrl, setAvatarChangeUrl] = useState<string | null | undefined>(currentUser?.profileImage);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: currentUser?.username || "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const { username } = values;
        const profileImage = avatarChangeUrl;
        const payload = { username, profileImage };
        console.log(currentUser)

        axios.put(`/api/users/${currentUser?._id}/update`, payload)
            .then((res) => {
                const {user}:{user:IUser} = res.data;
                console.log(user);
                setCurrentUser(user);
                toast("Cập nhật thông tin thành công");
                window.location.reload();
            }).catch((err) => {
                toast("Lỗi cập nhật thông tin", {
                    description: err.response.data.error,
                });
            });
    }

    const handleChoseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formdata = new FormData();
            formdata.append('file', file);
            axios.post('/api/images', formdata)
                .then((res) => {
                    toast("Tải ảnh lên thành công");
                    setAvatarChangeUrl(res.data.url);
                }
                ).catch((err) => {
                    toast("Lỗi tải ảnh lên", {
                        description: err.response.data.error,
                    })
                });
        }
    }

    return (
        <>
            <Card className="m-auto w-[30rem]">
                <CardHeader>
                    <CardTitle>Edit Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="username" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="h-32 flex items-center space-x-8  ">
                                <Avatar className="size-40" >
                                    <AvatarImage src={avatarChangeUrl || "/images/commons/persion.webp"} alt="avatar" />
                                    <AvatarFallback>
                                    </AvatarFallback>
                                </Avatar>
                                <label className="border px-4 py-2 rounded-md" htmlFor="imageChange"> chose image </label>
                                <input
                                    id="imageChange"
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => { handleChoseImage(e) }}
                                />
                            </div>
                            <Button className="w-full" type="submit">Save changes</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

export default Page