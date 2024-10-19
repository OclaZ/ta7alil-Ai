import React, { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle } from "lucide-react";

type Props = {
  onReportComfirmation: (data: string) => void;
};

const ReportComponent = ({ onReportComfirmation }: Props) => {
  const { toast } = useToast();
  const [base64Data, setBase64Data] = useState("");
  const [reportData, setReportData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
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
          setBase64Data(fileContent);
        };
        reader.readAsDataURL(file);
      }

      if (isValidImage) {
        compressImage(file, (compressedFile: File) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileContent = reader.result as string;
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
    try {
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
      } else {
        throw new Error("Failed to extract report details");
      }
    } catch (error) {
      toast({
        description: "Error extracting report details",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="relative grid gap-6 rounded-lg border border-border/40 p-6 shadow-sm">
        <legend className="px-2 text-sm font-medium text-muted-foreground">
          Report
        </legend>
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="file-upload" className="text-sm font-medium">
            Upload Report
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleReportSelection}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {fileName || "Choose file"}
            </Button>
            <Button
              onClick={extractDetails}
              disabled={!base64Data || isLoading}
            >
              Extract Details
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-summary" className="text-sm font-medium">
            Report Summary
          </Label>
          <Textarea
            id="report-summary"
            placeholder="Extracted details from the report will appear here. Get better recommendations by providing additional patient history and symptoms..."
            className="min-h-[200px] resize-none p-3"
            value={reportData}
            onChange={(e) => setReportData(e.target.value)}
          />
        </div>

        <Button
          onClick={() => onReportComfirmation(reportData)}
          variant="default"
          className="bg-primary hover:bg-primary/90"
          disabled={!reportData}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Confirm Report
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
