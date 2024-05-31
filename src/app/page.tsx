import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";

export default function Home() {
  return (
    <div className="flex-1 w-full grid grid-cols-3 gap-8 p-4">
      <div className="col-span-1 h-full">
        <ChatList />
      </div>
      <div className="col-span-2 h-full">
        <ContactList />
      </div>
     </div>
  );
}
