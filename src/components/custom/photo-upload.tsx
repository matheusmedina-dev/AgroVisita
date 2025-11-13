'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({ photos, onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      alert(`Você pode adicionar no máximo ${maxPhotos} fotos`);
      return;
    }

    setIsUploading(true);

    try {
      const newPhotos: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          alert(`Arquivo ${file.name} não é uma imagem válida`);
          continue;
        }

        // Validar tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Arquivo ${file.name} é muito grande. Máximo 5MB`);
          continue;
        }

        // Converter para base64
        const base64 = await fileToBase64(file);
        newPhotos.push(base64);
      }

      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Erro ao processar fotos:', error);
      alert('Erro ao processar fotos. Tente novamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Fotos da Visita
        </label>
        <span className="text-xs text-gray-500">
          {photos.length}/{maxPhotos} fotos
        </span>
      </div>

      {/* Botão de Upload */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading || photos.length >= maxPhotos}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Adicionar Fotos
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Grid de Fotos */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden shadow-md group"
            >
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Botão de Remover */}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Número da foto */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Nenhuma foto adicionada ainda
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Clique no botão acima para adicionar fotos
          </p>
        </div>
      )}

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Dica:</strong> Você pode selecionar múltiplas fotos de uma vez. 
          Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo: 5MB por foto.
        </p>
      </div>
    </div>
  );
}
