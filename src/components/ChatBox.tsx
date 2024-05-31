import { useAppContext } from "@/app/AppProvvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

type Props = {
    chat: any;
}

export function ChatBox({ chat }: Props) {
    const { currentUser } = useAppContext();
    const otherMembers = chat?.members?.filter((member: any) => member._id !== currentUser?._id);
    console.log(otherMembers);
    const messages = chat?.messages;
    return ( 
        <div className="h-24 rounded-3xl hover:bg-[#afafaf63] flex items-center px-2 ">
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
                        <span>{chat.name}</span>
                        <span>{format(chat.lastMessageAt,7)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                        <p>{chat?.members?.map((member: any) => member.username).join(', ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const format = (date: string, UTC: number) => {

    // Tạo đối tượng Date từ chuỗi thời gian
    const dateObject = new Date(date);

    // Lấy giờ và phút
    const hours = dateObject.getUTCHours() + UTC;
    const minutes = dateObject.getUTCMinutes();

    // Định dạng giờ và phút
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return formattedTime;
}
