"use client";
import { useState } from "react";

interface Message {
  id: number;
  username: string;
  content: string;
  translated: string;
  isSelf: boolean;
  showTranslated: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, username: "John", content: "Hola!", translated: "Hello!", isSelf: false, showTranslated: true },
    { id: 2, username: "You", content: "How are you?", translated: "¿Cómo estás?", isSelf: true, showTranslated: false },
    { id: 3, username: "John", content: "Estoy bien, gracias!", translated: "I am fine, thanks!", isSelf: false, showTranslated: true },
  ]);

  const [contacts] = useState(["Mionel Lessi", "Yamine Lamal", "Ristiano Cronaldo"]);

  const toggleMessage = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, showTranslated: !msg.showTranslated } : msg
      )
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left - Contacts List */}
      <div className="w-1/4 bg-gray-800 p-4 overflow-y-auto flex flex-col justify-between">
        <div>
            <h2 className="text-white font-bold mb-4">Contacts</h2>
            <ul className="space-y-4">
            {contacts.map((contact, index) => (
                <li key={index} className="text-gray-300 bg-gray-700 border-md rounded-md p-2 hover:bg-gray-600">
                {contact}
                </li>
            ))}
            </ul>
        </div>
        <button
            className="px-6 py-2 text-white bg-green-700 rounded-md hover:bg-green-600 mt-4 transition ease-in-out 0.6s"
        >
            + Add new friend
        </button>
        </div>


      {/* Right - Chat Panel */}
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

        {/* Input box (optional) */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white"
          />
        </div>
      </div>
    </div>
  );
}
