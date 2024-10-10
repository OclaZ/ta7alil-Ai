"use client";
import React from "react";
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
  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      <Badge
        variant="outline"
        className={`absolute top-2 right-4 ${
          reportData ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {reportData ? "Report added successfully" : "No report added yet"}
      </Badge>
      <div className="flex-1"> </div>
      <div className="flex flex-col gap-4">
        {messages.map((m, i) => {
          return <MessageBox key={i} role={m.role} content={m.content} />;
        })}
      </div>
      <form
        className="relative overflow-hidden rounded-lg border bg-background"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message ..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center pt-0 p-3">
          <Button
            disabled={isLoading}
            className="ml-auto"
            type="submit"
            size={"sm"}
          >
            {isLoading ? "Analyzing..." : "3. Ask"}
            {isLoading ? (
              <Loader2 className="size-3.5 ml-1 animate-spin" />
            ) : (
              <SendHorizontal className="size-3.5 ml-1" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChatComponent;
