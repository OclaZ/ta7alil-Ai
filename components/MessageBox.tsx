"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Markdown from "./Markdown";

type Props = {
  content: string;
  role: string;
};

export default function MessageBox({ content, role }: Props) {
  const isUser = role === "user";

  return (
    <Card className={`mb-4 ${isUser ? "border-primary" : "border-secondary"}`}>
      <CardHeader
        className={`py-3 px-6 ${isUser ? "bg-primary/10" : "bg-secondary/10"}`}
      >
        <h3
          className={`text-sm font-semibold ${
            isUser ? "text-primary" : "text-secondary"
          }`}
        >
          {isUser ? "You" : "AI Assistant"}
        </h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="prose prose-sm max-w-none">
          <Markdown content={content} />
        </div>
      </CardContent>
      {!isUser && (
        <CardFooter className="border-t bg-muted/50 px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p>
              <span className="font-semibold">Disclaimer:</span> This app
              provides AI-generated insights based on the data you provide. It
              is not a substitute for professional medical advice, diagnosis, or
              treatment. Always consult a licensed healthcare provider for
              medical concerns. The app is intended for informational purposes
              only, and we are not liable for any actions taken based on its
              results.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
