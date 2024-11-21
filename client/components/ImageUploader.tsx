'use client';

import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploaderProps {
    onImageUpload?: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('请上传图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('图片大小不能超过5MB');
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5000/images', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || '上传失败');
            }

            if (!data.image?.url) {
                throw new Error('服务器返回数据格式错误');
            }

            // 直接使用服务器返回的 URL
            setPreview(data.image.url);
            
            if (onImageUpload) {
                onImageUpload(data.image.url);
            }
        } catch (err) {
            console.error('Image upload error:', err);
            setError(err instanceof Error ? err.message : '上传失败，请重试');
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const clearPreview = () => {
        setPreview(null);
        setError(null);
    };

    return (
        <div className="w-full">
            {!preview ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                        hover:border-blue-500 hover:bg-blue-50 transition-colors`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <FiUpload className="mx-auto text-3xl mb-2 text-gray-400" />
                    <p className="text-gray-500">
                        {uploading ? '上传中...' : '点击或拖拽图片到此处上传'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        支持的格式：JPG、PNG、GIF等图片格式<br />
                        最大文件大小：5MB
                    </p>
                    {error && (
                        <p className="text-red-500 mt-2 text-sm">{error}</p>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1
                            hover:bg-red-600 transition-colors z-10"
                        onClick={clearPreview}
                    >
                        <FiX />
                    </button>
                    <div className="relative w-full h-48">
                        <Image
                            src={preview}
                            alt="Uploaded preview"
                            fill
                            className="rounded-lg object-contain"
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
