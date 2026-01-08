import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageDataUrl: string) => void;
}

const ImageUploader = ({ currentImage, onImageChange }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={clearImage}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            h-40 border-2 border-dashed rounded-lg cursor-pointer
            flex flex-col items-center justify-center gap-2 transition-all
            ${isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }
          `}
        >
          <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-primary/20' : 'bg-secondary'}`}>
            <ImageIcon className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <p className="text-sm text-muted-foreground text-center px-4">
            <span className="text-primary font-medium">Click to upload</span>
            <br />
            or drag and drop
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
