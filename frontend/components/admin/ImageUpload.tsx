import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useUploadImageMutation } from '../../shared/services/upload.service';
import { toast } from 'sonner';
import { resolveImageUrl } from '@/shared/utils/imageUrl';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Загрузить изображение',
  aspectRatio,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    try {
      const result = await uploadImage(file).unwrap();
      // API возвращает { url: string, filename: string, size: number }
      let imageUrl = result.url;

      // Если URL относительный (начинается с /), добавляем базовый URL
      if (imageUrl && imageUrl.startsWith('/')) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        // Убираем /api из конца, если есть
        const baseUrl = API_BASE_URL.replace(/\/api$/, '');
        imageUrl = `${baseUrl}${imageUrl}`;
      }

      if (imageUrl) {
        onChange(imageUrl);
        toast.success('Изображение успешно загружено');
      } else {
        toast.error('Не удалось получить URL изображения');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Ошибка при загрузке изображения');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm">{label}</label>

      {value ? (
        <div className="relative group">
          <ImageWithFallback
            src={resolveImageUrl(value)}
            alt="Preview"
            className="w-full rounded-lg object-cover"
            style={aspectRatio ? { aspectRatio } : { maxHeight: '300px' }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <X className="w-4 h-4 mr-1" />
            Удалить
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Загрузка...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="text-primary">Выберите файл</span> или перетащите сюда
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG до 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
