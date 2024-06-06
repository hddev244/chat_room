'use client'
import type { NextPage } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useAppContext } from "@/app/AppProvvider";
import axios from "axios";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "./ui/avatar";
import { IUser } from "@/server/models/User.model";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import SpinperBasic from "./spinpers/spinper-basic";
import { useRouter } from "next/navigation";
import { personImage } from "@/lib/system.property";

const ContactList: NextPage = () => {
  const { currentUser } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchContactValue, setSearchContactValue] = useState<string>('');

  

  useEffect(() => {
    const getContacts = async () => {
      try {
        const url = searchContactValue !== "" ? `/api/users/searchContact/${searchContactValue}` : "/api/users";
        axios.get(url)
          .then((res) => {
            const users = res.data;
            if (!users) return;
            setContacts(users?.filter((user: IUser) => user._id !== currentUser?._id));
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
    if (currentUser) getContacts();
  }, [searchContactValue, currentUser]);

  // SELECT CONTACT
  const [selectedContact, setSelectedContact] = useState<IUser[]>([]);
  const isGroup = selectedContact.length > 1;

  const handleSelectContact = (contact: IUser) => {
    if (selectedContact.includes(contact)) {
      setSelectedContact((prev) => prev.filter((c) => c !== contact));
    } else {
      setSelectedContact((prev) => [...prev, contact]);
    }
  }

  /** ADD GROUP CHAT NAME  */
  const [name, setName] = useState<string>('');

  // CREATE GROUP CHAT
  const router = useRouter();
  const createGroupChat = async () => {
    if (isGroup && !name) {
      toast('Please enter a group name', {
        position: 'top-right',
        duration: 5000,
      })
      return;
    }
    const payload = {
      chat: {
        isGroup: isGroup,
        name: isGroup ? name : '',
        members: selectedContact.map((c) => c._id)
      },
      currentUserId: currentUser?._id
    }
    await axios.post('/api/chats', payload)
      .then((res) => {
        window.location.href = `/chats/${res.data._id}`;
      })
      .catch((error) => {
        console.error(error);
      });

  }

  return (loading ? <SpinperBasic /> :
    <>
      <div className="size-full flex flex-col space-y-4">
        <div className="w-full">
          <Input
            type="text"
            className="h-14 rounded-3xl"
            value={searchContactValue}
            onChange={(e) => setSearchContactValue(e.target.value)}
            placeholder="search contacts..." />
        </div>
        <div className="w-full flex-1 grid grid-cols-2 gap-8">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Select or Deselect</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 w-full">
              <ScrollArea className="h-full p-1 scrollbar_hidden">
                {
                  contacts && contacts.map((contact: IUser) => (
                    <div key={contact._id as string} className="h-24 rounded-3xl hover:bg-[#afafaf63] flex items-center px-2 ">

                      <div className="flex items-center space-x-8">
                        <Checkbox
                          id={contact._id as string}
                          checked={selectedContact.map((c) => c._id).includes(contact._id)}
                          onClick={() => {
                            handleSelectContact(contact);
                          }} />
                        <Avatar className="size-20" >
                          <AvatarImage src={contact.profileImage || personImage} alt="avatar" />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <label htmlFor={contact._id as string}>
                            <div className="text-lg font-semibold">{contact.username}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="px-4 space-y-4">
            <Card className="">
              {
                selectedContact.length > 1 && (
                  <>
                    <CardHeader className="space-y-4">
                      <CardTitle>Group Chat {name ? " - " + name : ""}</CardTitle>
                      <CardDescription>
                        <Input
                          type="text"
                          className="h-12"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Group name..." />
                      </CardDescription>
                      <CardContent >
                        {
                          selectedContact.map((contact: IUser) => (
                            <Button
                              onClick={() => handleSelectContact(contact)}
                              key={contact._id as string}
                              variant={"secondary"}
                              className="me-2 mb-2">
                              {contact.username}
                            </Button>
                          ))
                        }
                      </CardContent>
                    </CardHeader>
                  </>
                )
              }
            </Card>
            <Button
              onClick={createGroupChat}
              className="w-full text-3xl uppercase !py-8">Start a new chat</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactList