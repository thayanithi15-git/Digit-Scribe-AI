'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, AlertCircle, Loader2, FileText, Trash2 } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WaterDropButton from '@/components/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface OCRResult {
  full_text: string;
  lines: Array<{ line_number: number; text: string }>;
  words: Array<{
    id: number;
    text: string;
    confidence: number;
    position: { x: number; y: number; width: number; height: number };
  }>;
  confidence_score: number;
  word_count: number;
}

export default function OCRScanner() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setOcrResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/ocr/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOcrResult(data.data);
      } else {
        setError(data.error || 'OCR failed');
      }
    } catch (err) {
      setError('Failed to connect to backend. Make sure it\'s running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!ocrResult) return;
    const blob = new Blob([JSON.stringify(ocrResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setUploadedImage(null);
    setOcrResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
              <FileText className="w-4 h-4" />
              OCR Document Recognition
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-gray-700 text-4xl">Extract Text from</span>
              <br />
              <span className="text-gray-900">Documents & Images</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload any image or document to extract text with precision. Our AI handles multiple languages and document types.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-smooth p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Upload Image
              </h2>

              {!uploadedImage ? (
                <label className="flex flex-col items-center justify-center h-96 border-3 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Upload className="w-16 h-16 text-gray-400 group-hover:text-blue-500 transition-colors mb-4" />
                  </motion.div>
                  <span className="text-lg text-gray-600 font-medium">Click to upload image</span>
                  <span className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG, GIF (max 16MB)</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 h-96">
                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-contain bg-gray-50" />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={reset}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Clear
                    </button>
                    <label className="flex-1">
                      <div className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-5 h-5" />
                        New Image
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex items-center justify-center gap-3 text-blue-600"
                >
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-medium">Processing your image...</span>
                </motion.div>
              )}
            </motion.div>

            {/* Results section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-smooth p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Extracted Text</h2>
                {ocrResult && (
                  <WaterDropButton
                    variant="accent"
                    size="sm"
                    onClick={downloadJSON}
                    icon={<Download className="w-4 h-4" />}
                  >
                    JSON
                  </WaterDropButton>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 mb-4"
                >
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {!uploadedImage && !loading && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <FileText className="w-20 h-20 mb-4 opacity-50" />
                  <p className="text-lg">Upload an image to extract text</p>
                </div>
              )}

              {ocrResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 max-h-[600px] overflow-y-auto"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-50 p-4 rounded-lg cursor-pointer"
                    >
                      <p className="text-sm text-gray-600 mb-1">Confidence</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {(ocrResult.confidence_score * 100).toFixed(1)}%
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-50 p-4 rounded-lg cursor-pointer"
                    >
                      <p className="text-sm text-gray-600 mb-1">Words</p>
                      <p className="text-3xl font-bold text-purple-600">{ocrResult.word_count}</p>
                    </motion.div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Full Text</h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                      {ocrResult.full_text || 'No text detected'}
                    </p>
                  </div>

                  {ocrResult.words.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-3">Words with Confidence</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {ocrResult.words.map((word) => (
                          <motion.div
                            key={word.id}
                            whileHover={{ x: 5 }}
                            className="bg-white p-3 rounded border flex justify-between items-center"
                          >
                            <span className="font-medium text-sm">{word.text}</span>
                            <span className="text-xs text-green-600 font-semibold">
                              {(word.confidence * 100).toFixed(1)}%
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}