"use client";

import React, { useRef, useEffect } from "react";
import { Badge } from "./ui/badge";
import { useChat } from "ai/react";
import MessageBox from "./MessageBox";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, SendHorizontal } from "lucide-react";

type Props = {
  reportData: string;
};

const ChatComponent = ({ reportData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/medichatgemini",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-4">
        <Badge
          variant="outline"
          className={`sticky top-0 z-10 float-right m-2 ${
            reportData ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {reportData ? "Report added successfully" : "No report added yet"}
        </Badge>
        <div className="space-y-4">
          {messages.map((m, i) => (
            <MessageBox key={i} role={m.role} content={m.content} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        className="sticky bottom-0 bg-background p-4 border-t"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
        }}
      >
        <div className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message ..."
            className="min-h-12 resize-none flex-grow"
            rows={1}
          />
          <Button disabled={isLoading} type="submit" size="icon">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
