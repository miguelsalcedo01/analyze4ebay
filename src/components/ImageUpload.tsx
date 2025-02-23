
import React, { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export const ImageUpload = ({ onImageUpload }: { onImageUpload: (file: File) => void }) => {
  const [dragging, setDragging] = useState(false);
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files[0];

      if (imageFile && imageFile.type.startsWith('image/')) {
        onImageUpload(imageFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
      }
    },
    [onImageUpload, toast]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        onImageUpload(files[0]);
      }
    },
    [onImageUpload]
  );

  return (
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
          <p className="text-lg font-medium">Drop your image here or</p>
          <p className="text-sm text-muted-foreground">Supports: JPG, PNG, GIF</p>
        </div>
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
      </div>
    </Card>
  );
};
