"use client";

import React, { useRef, useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useChat } from "ai/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2, SendHorizontal, AlertCircle, User, Bot } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Card, CardContent } from "./ui/card";
import Markdown from "./Markdown";

type Props = {
  reportData: string;
};

const ChatComponent = ({ reportData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "api/medichatgemini",
    });

  const [localInput, setLocalInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isReportAdded = !!reportData;

  const handleLocalInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLocalInput(e.target.value);
    handleInputChange(e);
  };

  const handleLocalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReportAdded && localInput.trim()) {
      handleSubmit(e, {
        data: {
          reportData: reportData as string,
        },
      });
      setLocalInput(""); // Clear the local input after submission
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-background/80 rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-semibold text-primary animate-wave">
          Welcome to Ta7alil Ai <span className="inline-block wave">👋</span>
        </h2>

        <Badge
          variant="outline"
          className={`mt-2 ${
            isReportAdded
              ? "bg-green-500/20 text-green-700"
              : "bg-red-500/20 text-red-700"
          }`}
        >
          {isReportAdded ? "Report added successfully" : "No report added yet"}
        </Badge>
      </div>
      <ScrollArea className="flex-grow px-4 py-4 overflow-y-auto">
        {!isReportAdded && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Report Added</AlertTitle>
            <AlertDescription>
              Please add a medical report before starting the chat.
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-6">
          {messages.map((m, i) => (
            <Card
              key={i}
              className={`mb-4 ${
                m.role === "user"
                  ? "bg-primary-light/10 text-primary-dark"
                  : "bg-secondary-light/10 text-secondary-dark"
              } border-none shadow-sm`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      m.role === "user"
                        ? "bg-primary-light/20"
                        : "bg-secondary-light/20"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Bot className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div
                      className={`text-sm font-semibold mb-2 ${
                        m.role === "user"
                          ? "text-primary-dark"
                          : "text-secondary-dark"
                      }`}
                    >
                      {m.role === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <Markdown content={m.content} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {isLoading && (
            <Card className="mb-4 bg-muted/5 border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-secondary/20">
                    <Bot className="h-5 w-5 text-secondary animate-pulse" />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <div className="h-4 bg-secondary/20 rounded w-[100px] animate-pulse" />
                    <div className="h-4 bg-secondary/20 rounded w-full animate-pulse" />
                    <div className="h-4 bg-secondary/20 rounded w-[200px] animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <form
        className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        onSubmit={handleLocalSubmit}
      >
        <div className="flex items-end space-x-2">
          <Textarea
            value={localInput}
            onChange={handleLocalInputChange}
            placeholder={
              isReportAdded
                ? "Type your medical question here..."
                : "Please add a report to start chatting"
            }
            className="min-h-[80px] resize-none flex-grow bg-background/50 border-primary/20 focus:border-primary"
            rows={3}
            disabled={!isReportAdded || isLoading}
          />
          <Button
            disabled={isLoading || !isReportAdded || !localInput.trim()}
            type="submit"
            size="icon"
            className="h-[80px] w-[80px] bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <SendHorizontal className="h-6 w-6" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
