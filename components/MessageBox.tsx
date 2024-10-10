"use client";
import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";

type Props = {
  content: string;
  role: string;
};

const MessageBox = ({ content, role }: Props) => {
  return (
    <Card>
      <CardContent className="p-6 text-sm">{content}</CardContent>
      {role !== "user" && (
        <CardFooter className="border-t bg-muted/50 px-6 py-3 text-xs text-muted-foreground ">
          Disclaimer: This app provides AI-generated insights based on the data
          you provide. It is not a substitute for professional medical advice,
          diagnosis, or treatment. Always consult a licensed healthcare provider
          for medical concerns. The app is intended for informational purposes
          only, and we are not liable for any actions taken based on its
          results.
        </CardFooter>
      )}
    </Card>
  );
};

export default MessageBox;
