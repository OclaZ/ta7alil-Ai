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
    });
  };

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 h-[57px] bg-background flex items-center justify-between gap-1 border-b px-4">
          <Image src={logoSrc} alt="logo" width={300} height={30} />
          <div className="w-full flex flex-row justify-end gap-2">
            <ModeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Settings />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[84vh]">
                <ReportComponent onReportComfirmation={onReportComfirmation} />
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="hidden md:flex flex-col">
            <ReportComponent onReportComfirmation={onReportComfirmation} />
          </div>
          <div className="lg:col-span-2">
            <ChatComponent reportData={reportData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
