import React, { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Props = {
  onReportComfirmation: (data: string) => void;
};

const ReportComponent = ({ onReportComfirmation }: Props) => {
  const { toast } = useToast();
  const [base64Data, setBase64Data] = useState("");
  const [reportData, setReportData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      let isValidImage = false;
      let isValidDoc = false;

      const validImages = ["image/jpeg", "image/png", "image/webp"];

      const validDocs = ["application/pdf"];

      if (validImages.includes(file.type)) {
        isValidImage = true;
      }
      if (validDocs.includes(file.type)) {
        isValidDoc = true;
      }
      if (!(isValidImage || isValidDoc)) {
        toast({
          description: "File type not supported",
          variant: "destructive",
        });
        return;
      }
      if (isValidDoc) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileContent = reader.result as string;
          console.log(fileContent);
          setBase64Data(fileContent);
        };
        reader.readAsDataURL(file);
      }

      if (isValidImage) {
        compressImage(file, (compressedFile: File) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileContent = reader.result as string;
            console.log(fileContent);
            setBase64Data(fileContent);
          };
          reader.readAsDataURL(compressedFile);
        });
      }
    }
  }

  async function extractDetails(): Promise<void> {
    if (!base64Data) {
      toast({
        description: "Please select a valid report",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const response = await fetch("/api/extractreportgemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base64: base64Data }),
    });
    if (response.ok) {
      const reportText = await response.text();
      setReportData(reportText);
      setIsLoading(false);
    }
  }

  return (
    <div className=" grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="relative grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Repport</legend>
        {isLoading && (
          <div className="absolute z-10 h-full w-full bg-card/90 rounded-lg flex items-center justify-center animate-fadeIn animate-pulse">
            Loading...
          </div>
        )}

        <Input type="file" onChange={handleReportSelection} />
        <Button onClick={extractDetails}>1.Upload Report</Button>
        <Label>Repport summary</Label>
        <Textarea
          placeholder="extracted details from report will apear here . Get better recommendations by providing additional patient history and symptoms..."
          className="min-h-72 resize-none border-0 p-3 shadow-none "
          value={reportData}
          onChange={(e) => setReportData(e.target.value)}
        />
        <Button
          onClick={() => onReportComfirmation(reportData)}
          variant={"destructive"}
          className="bg-[#cf1925]"
        >
          2.Looks good
        </Button>
      </fieldset>
    </div>
  );
};

export default ReportComponent;
function compressImage(file: File, callback: (compressedFile: File) => void) {
  const reader = new FileReader();
  reader.onload = (event: ProgressEvent<FileReader>) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > 1920 || height > 1080) {
        const aspectRatio = width / height;
        if (width > height) {
          width = 1920;
          height = Math.round(1920 / aspectRatio);
        } else {
          height = 1080;
          width = Math.round(1080 * aspectRatio);
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            callback(compressedFile);
          }
        },
        "image/jpeg",
        0.7
      );
    };
    img.src = event.target!.result as string;
  };
  reader.readAsDataURL(file);
}
