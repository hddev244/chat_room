'use client'
import type { NextPage } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { useAppContext } from "@/app/AppProvvider";
import axios from "axios";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "./ui/avatar";
import { IUser } from "@/server/models/User";
import SninperBasic from "./sninpers/sninper-basic";
import { Car } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Radio } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";

const ContactList: NextPage = () => {
  const { currentUser } = useAppContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchContactValue, setSearchContactValue] = useState<string>('');

  const getContacts = async () => {
    try {
      const url = searchContactValue !== "" ? `/api/users/searchContact/${searchContactValue}` : "/api/users";
      axios.get(url)
        .then((res) => {
          console.log(res.data.data);
          const users = res.data.data;
          setContacts(users?.filter((user: IUser) => user._id !== currentUser?._id));
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
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

  return (loading ? <SninperBasic /> :
    <>
      <div className="size-full flex flex-col space-y-4">
        <div className="w-full">
          <Input
            type="text"
            className="h-12"
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
              <ScrollArea className="h-[38rem] p-1">
                {
                  contacts && contacts.map((contact: IUser) => (
                    <div key={contact._id} className="flex items-center space-x-8 p-4 hover:rounded-md hover:border cursor-pointer">
                      <Checkbox 
                        id={contact._id}
                        checked={selectedContact.map((c) => c._id).includes(contact._id)}
                        onClick={() => { handleSelectContact(contact);  
                        }} />
                      <Avatar className="size-20" >
                        <AvatarImage src={contact.profileImage || '/images/commons/persion.webp'} alt="avatar" />
                        <AvatarFallback></AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <label htmlFor={contact._id}>
                          <div className="text-lg font-semibold">{contact.username}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </label>
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
                            key={contact._id} 
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
            <Button className="w-full text-3xl uppercase !py-8">Start a new chat</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactList