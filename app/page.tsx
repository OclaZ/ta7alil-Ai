"use client";
import React, { useState, useEffect } from "react";
import { ModeToggle } from "@/components/modetoogle";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Settings, Github, Linkedin } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import ReportComponent from "@/components/reportComponent";
import { useToast } from "@/hooks/use-toast";
import ChatComponent from "@/components/ChatComponent";
import Link from "next/link";

const Dashboard = () => {
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
      description: "Report updated successfully!",
      className: "bg-green-500 text-white",
    });
  };

  return (
    <div className="flex flex-col fixed top-0 left-0 w-full h-full overflow-hidden bg-background text-foreground">
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
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 h-full">
          <div className="grid gap-6 h-full md:grid-cols-2 lg:grid-cols-3">
            <div className="hidden md:block md:col-span-1 bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 h-full overflow-auto">
                <ReportComponent onReportComfirmation={onReportComfirmation} />
              </div>
            </div>
            <div className="md:col-span-1 lg:col-span-2 overflow-hidden">
              <div className="h-full flex flex-col">
                <ChatComponent reportData={reportData} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4">
              <Link
                href="https://github.com/Oclaz"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link
                href="https://linkedin.com/in/hamza-aslikh/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="icon">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
            </div>
            <div>© 2024 Ta7alil Ai </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
