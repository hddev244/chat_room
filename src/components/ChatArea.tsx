import { useAppContext } from "@/app/AppProvvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardFooter, CardHeader } from "./ui/card"
import { Textarea } from "./ui/textarea";
import { IoIosSend } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { formatDate } from "./ChatBox";
import { ScrollArea } from "./ui/scroll-area";
import { pusherClient } from "@/lib/pusher";
import SpinperBasic from "./spinpers/spinper-basic";
import  { groupImage, personImage } from "@/lib/system.property";

type Props = {
    chatId: string | string[] | undefined;
}

export const ChatArea = (props: Props) => {
    const { currentUser } = useAppContext();
    const [chat, setChat] = useState<any>({});
    const [otherMembers, setOtherMembers] = useState<any[]>([]);
    
    const [text, setText] = useState<string>('');
    const [photo, setPhoto] = useState<string>('');

    const formRef = useRef<HTMLFormElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                formRef.current?.submit();
            }
        };

        const textarea = textareaRef.current;
        textarea?.addEventListener('keydown', handleKeyDown);

        console.log(textareaRef.current);

        return () => {
            textarea?.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        if (text.trim() === '') return;
        const url = `/api/messages`;

        const body = {
            chatId: props.chatId,
            sender: currentUser?._id,
            text,
            photo,
            seedBy: []
        }

        await axios.post(url, body)
            .then((res) => {
                setChat(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
        setText('');
    }

    // Get chat
   

    useEffect(() => {
        const getChatDetail = async () => {
            await axios.get(`/api/chats/${props.chatId}`)
                .then((res) => {
                    setChat(res.data);
                    const members:any[] = res.data.members;
                    setOtherMembers(members?.filter((member: any) => member._id !== currentUser?._id))
                })
                .catch((error) => {
                });
        }
        getChatDetail();
    }, [currentUser?._id, props.chatId])

    // Scroll to bottom
    const bottomMessageRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (bottomMessageRef.current) {
            bottomMessageRef.current
                            .scrollIntoView(
                                { behavior: 'smooth' }
                            );
        }
    }, [chat.messages]);

    // Subscribe to pusher channel and bind new-message event to update chat messages 
    useEffect(() => {
        pusherClient.subscribe(`chat-${props.chatId}`);
        pusherClient.bind(`new-message`, (message: any) => {
            setChat((prevChat: any) => {
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, message]
                }
            });
        });

        return () => {
            pusherClient.unsubscribe(`chat-${props.chatId}`);
            pusherClient.unbind(`new-message`);
        }
    }, [props.chatId]);

    // handleSendMessage function
   


    return !chat ? <SpinperBasic /> : (
        <>
            <Card className="col-span-2 relative size-full max-h-full m overflow-hidden">
                <CardHeader className=" z-20 absolute top-0 w-full h-24 text-xl flex-row items-center p-4">
                    {chat?.isGroup ? (
                        <Avatar className="size-16 me-4">
                            <AvatarImage src={chat.groupImage || groupImage} alt="avatar" />
                            <AvatarFallback>GR</AvatarFallback>
                        </Avatar>
                    ) : (
                        <>
                            {otherMembers && (
                                <Avatar className="size-16 me-4">
                                    <AvatarImage src={otherMembers[0]?.profileImage || personImage} alt="avatar" />
                                    <AvatarFallback>MEM</AvatarFallback>
                                </Avatar>
                            )}
                        </>
                    )}
                    {(chat && chat?.isGroup) ? chat?.name : chat?.members?.filter((member: any) => member._id !== currentUser?._id)[0].username}
                </CardHeader>
                <ScrollArea className=" !absolute bottom-28 w-full h-[calc(100%-13rem)] max-h-[calc(100%-13rem)] overflow-y-scroll   bg-[#72727225]">
                    <div className="flex flex-col justify-end space-y-2 p-2 ">
                        {chat?.messages?.map((message: any) => (
                            <div key={message._id} className={`flex ${message.sender._id === currentUser?._id ? "justify-end" : "justify-start"}`}>
                                {message.sender._id === currentUser?._id ? (
                                    <div className="flex items-center space-x-4">
                                        <span >
                                            {formatDate(message.createdAt, 7)}
                                        </span>
                                        <div className="bg-blue-500 p-2 rounded-3xl text-white  max-w-[50rem] " >
                                            {message.text}
                                        </div> 
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <div className="h-full">
                                            <Avatar className="size-10 shadow shadow-gray-300">
                                                <AvatarImage src={message.sender.profileImage || personImage} alt="avatar" />
                                                <AvatarFallback>MEM</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="dark:bg-[#7c7c7c7a] bg-white p-2 rounded-3xl  max-w-[50rem] ">
                                            {message.text}
                                        </div>
                                        <span >
                                            {formatDate(message.createdAt, 7)}
                                        </span>

                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={bottomMessageRef} ></div>
                    </div>
                </ScrollArea>
                <CardFooter className="absolute bottom-0 border-t h-28 w-full flex  p-2 pt-2">
                    <form ref={formRef}  className="flex flex-1 space-x-2" onSubmit={handleSendMessage}>
                        <Textarea
                            ref={textareaRef}
                            className="rounded-bl-3xl"
                            placeholder="Type a message"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button >
                            <IoIosSend className=" border-2 rounded-full text-blue-500 p-2 text-[4rem] hover:scale-110 hover:shadow dark:hover:shadow-blue-300 dark:hover:text-blue-300 hover:shadow-blue-600 hover:text-blue-600 transition-transform duration-300 ease-in-out" />
                        </button>
                        </form>
                </CardFooter>
            </Card>
        </>
    )
}