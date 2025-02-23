
import React, { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File, acquisitionCost: number) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [dragging, setDragging] = useState(false);
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragging(true);
    } else if (e.type === 'dragleave') {
      setDragging(false);
    }
  }, []);

  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files[0];
      processFile(imageFile);
    },
    [toast]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        processFile(files[0]);
      }
    },
    []
  );

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "Missing image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    const cost = parseFloat(acquisitionCost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: "Invalid cost",
        description: "Please enter a valid acquisition cost",
        variant: "destructive",
      });
      return;
    }

    onImageUpload(selectedFile, cost);
  };

  return (
    <div className="space-y-6">
      <Card
        className={`p-8 border-2 border-dashed transition-all duration-300 ${
          dragging ? 'border-primary bg-secondary/20' : 'border-border'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center animate-fadeIn">
          <Upload className="w-12 h-12 text-muted-foreground animate-float" />
          <div>
            <p className="text-lg font-medium">
              {selectedFile ? selectedFile.name : "Drop your image here or"}
            </p>
            <p className="text-sm text-muted-foreground">
              {selectedFile ? "Image selected" : "Supports: JPG, PNG, GIF"}
            </p>
          </div>
          {!selectedFile && (
            <label className="cursor-pointer">
              <Button variant="secondary">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
              </Button>
            </label>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="acquisitionCost" className="text-sm font-medium">
            Acquisition Cost ($)
          </label>
          <Input
            id="acquisitionCost"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter your purchase cost"
            value={acquisitionCost}
            onChange={(e) => setAcquisitionCost(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!selectedFile || !acquisitionCost}
        >
          Analyze Item
        </Button>
      </div>
    </div>
  );
};
