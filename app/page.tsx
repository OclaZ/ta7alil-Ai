"use client";

import { ModeToggle } from "@/components/modetoogle";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import ReportComponent from "@/components/reportComponent";
import { useToast } from "@/hooks/use-toast";
import ChatComponent from "@/components/ChatComponent";

type Props = {};

const Home = (props: Props) => {
  const [reportData, setReportData] = useState("");
  const { theme, resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined
  );
  const { toast } = useToast();

  useEffect(() => {
    setCurrentTheme(resolvedTheme);
  }, [resolvedTheme]);

  const logoSrc = currentTheme === "dark" ? "/logo.svg" : "/logo-red.svg";

  const onReportComfirmation = (data: string) => {
    setReportData(data);
    toast({
      description: "Updated!",
      className: "bg-primary text-primary-foreground",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Image
            src={logoSrc}
            alt="logo"
            width={200}
            height={30}
            className="w-auto h-8"
          />
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Settings className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh]">
                <div className="p-4 bg-background rounded-t-lg">
                  <ReportComponent
                    onReportComfirmation={onReportComfirmation}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 h-full">
          <div className="grid gap-6 h-full md:grid-cols-2 lg:grid-cols-3">
            <div className="hidden md:block md:col-span-1 bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-4 h-full overflow-auto">
                <ReportComponent onReportComfirmation={onReportComfirmation} />
              </div>
            </div>
            <div className="md:col-span-1 lg:col-span-2 bg-card rounded-lg shadow-md overflow-hidden">
              <div className="p-4 h-full overflow-auto">
                <ChatComponent reportData={reportData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
