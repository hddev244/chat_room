import { useAppContext } from "@/app/AppProvvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link";

type Props = {
    chat: any;
}

export function ChatBox({ chat }: Props) {
    const { currentUser } = useAppContext();
    const otherMembers = chat?.members?.filter((member: any) => member._id !== currentUser?._id);
    const messages = chat?.messages;
    return (
        <Link href={`/chats/${chat._id}`} className="h-24 rounded-3xl hover:bg-[#afafaf63] flex items-center px-2 ">
            <div className="flex flex-1 space-x-4">
                {
                    chat?.isGroup ? (
                        <Avatar className="size-20">
                            <AvatarImage src={chat.groupImage || '/images/commons/group.jpg'} alt="avatar" />
                            <AvatarFallback>GR</AvatarFallback>
                        </Avatar>
                    ) : (
                        <>
                            {
                                otherMembers && (
                                    <Avatar className="size-20">
                                        <AvatarImage src={otherMembers[0].profileImage || '/images/commons/person.webp'} alt="avatar" />
                                        <AvatarFallback>MEM</AvatarFallback>
                                    </Avatar>
                                )
                            }
                        </>
                    )
                }
                <div className="flex-1">
                    <div className="text-lg font-semibold flex justify-between">
                        {
                            messages.length !== 0 ? (
                                <>
                                    <span>{chat?.isGroup ? chat.name:otherMembers[0].username}</span>
                                    <span>{formatDate(messages[messages.length - 1]?.createdAt, 7)}</span>
                                </>
                            ) : (
                                <>
                                <span>{chat?.isGroup ? chat.name:otherMembers[0].username}</span>
                                <span>{formatDate(chat.lastMessageAt, 7)}</span>
                                </>
                            )
                            }
                    </div>
                    {
                        messages.length !== 0 ? (
                            <div className="text-sm text-gray-500">
                                <p>{messages[messages.length - 1]?.text}</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-sm text-gray-500">
                                    <p>Chưa có tin nhắn</p>
                                </div>
                            </>
                        )
                    }
                     <div className="text-sm text-gray-500 flex space-x-1">
                        {chat?.isGroup && chat?.members.map((member: any) => {
                            return (
                                <Avatar key={member._id} className="size-6 border border-gray-400 shadow-sm shadow-gray-300">
                                        <AvatarImage src={member.profileImage || '/images/commons/person.webp'} alt="avatar" />
                                        <AvatarFallback>MEM</AvatarFallback>
                                </Avatar>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Link>
    );
}
 
export const formatDate = (date: string, UTC: number) => {
    // Tạo đối tượng Date từ chuỗi thời gian
    const dateObject = new Date(date);

    const thisTime = new Date(dateObject.getTime()+UTC*60*60*1000);

    // Lấy giờ và phút
    const hours = thisTime.getUTCHours();
    const minutes = thisTime.getUTCMinutes();

    // Định dạng giờ và phút
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return formattedTime;
}
