"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Message {
  id: number;
  username: string;
  content: string;
  translated: string;
  isSelf: boolean;
  showTranslated: boolean;
}

type Chats = {
  [key: string]: Message[];
};

const sampleChats: Chats = {
  "Mionel Lessi": [
    { id: 1, username: "Mionel Lessi", content: "Oi!", translated: "Hi!", isSelf: false, showTranslated: true },
    { id: 2, username: "You", content: "How are you?", translated: "Como você está?", isSelf: true, showTranslated: false },
    { id: 3, username: "Mionel Lessi", content: "Estou bem, obrigado!", translated: "I'm fine, thanks!", isSelf: false, showTranslated: true },
  ],
  "Yamine Lamal": [
    { id: 1, username: "Yamine Lamal", content: "Hola!", translated: "Hello!", isSelf: false, showTranslated: true },
    { id: 2, username: "You", content: "How are you?", translated: "¿Cómo estás?", isSelf: true, showTranslated: false },
    { id: 3, username: "Yamine Lamal", content: "Estoy bien, gracias!", translated: "I am fine, thanks!", isSelf: false, showTranslated: true },
  ],
  "Ristiano Cronaldo": [
    { id: 1, username: "Ristiano Cronaldo", content: "¡Hola, amigo!", translated: "Hello, friend!", isSelf: false, showTranslated: true },
    { id: 2, username: "You", content: "Hello! How are you?", translated: "¡Hola! ¿Cómo estás?", isSelf: true, showTranslated: false },
    { id: 3, username: "Ristiano Cronaldo", content: "Estoy muy bien, ¡gracias!", translated: "I'm very well, thanks!", isSelf: false, showTranslated: true },
  ],
};

export default function ChatPage() {
  const [currentContact, setCurrentContact] = useState("Yamine Lamal");
  const [messages, setMessages] = useState<Message[]>(sampleChats[currentContact]);
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState(["Mionel Lessi", "Yamine Lamal", "Ristiano Cronaldo"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFriend, setNewFriend] = useState("");
  const router = useRouter();

  const toggleMessage = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, showTranslated: !msg.showTranslated } : msg
      )
    );
  };

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      username: "You",
      content: newMessage,
      translated: newMessage,
      isSelf: true,
      showTranslated: false,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleContactClick = (contact: string) => {
    if (sampleChats[contact]) {
      setCurrentContact(contact);
      setMessages(sampleChats[contact]);
    }
  };

  const handleAddFriend = () => {
    if (newFriend.trim() && !contacts.includes(newFriend)) {
      setContacts([...contacts, newFriend]);
      sampleChats[newFriend] = [];
    }
    setNewFriend("");
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left - Contacts List */}
      <div className="w-1/4 bg-gray-800 p-4 overflow-y-auto flex flex-col justify-between">
      {/* Contacts List */}
      <div>
        <h2 className="text-white font-bold mb-4">Contacts</h2>
        <ul className="space-y-4">
          {contacts.map((contact, index) => (
            <li
              key={index}
              onClick={() => handleContactClick(contact)}
              className={`text-gray-300 bg-gray-700 border-md rounded-md p-2 hover:bg-gray-600 cursor-pointer ${
                currentContact === contact ? "bg-blue-800" : ""
              }`}
            >
              {contact}
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons at the Bottom */}
      <div className="flex justify-between mt-auto">
        <button
          className="px-6 py-2 text-white bg-green-700 rounded-md hover:bg-green-600 transition ease-in-out 0.6s"
          onClick={() => setIsModalOpen(true)}
        >
          + Add new friend
        </button>
        <button
          className="px-6 py-2 text-white bg-red-700 rounded-md hover:bg-green-600 transition ease-in-out 0.6s"
          onClick={() => router.push("/")}
        >
          Log out
        </button>
      </div>
    </div>

      <div className="flex-grow bg-gray-900 p-6 flex flex-col">
        <div className="flex-grow overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}
            >
              <div
                className={`p-4 rounded-lg max-w-xs ${
                  msg.isSelf ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
                }`}
                onClick={() => toggleMessage(msg.id)}
              >
                <p className="font-bold">{msg.username}</p>
                <p>{msg.showTranslated ? msg.translated : msg.content}</p>
              </div>
              <p className="text-gray-400 mt-1 text-xs">
                {msg.showTranslated ? "Translated" : "Original Message"}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white"
            />
          </form>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-xl font-bold mb-4">Add New Friend</h2>
            <input
              type="text"
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
              placeholder="Enter friend's username"
              className="text-black p-2 border rounded-md w-full"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                onClick={handleAddFriend}
              >
                Add Friend
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
