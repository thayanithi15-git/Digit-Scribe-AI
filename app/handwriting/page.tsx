'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Pencil, Trash2, Download, AlertCircle } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WaterDropButton from '@/components/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HandwritingResult {
  text: string;
  confidence: number;
  method: string;
  status: string;
  word_count?: number;
}

export default function HandwritingRecognizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [result, setResult] = useState<HandwritingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = '#1e293b';
        context.lineWidth = 4;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        setCtx(context);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    if (ctx && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setResult(null);
      setError('');
    }
  };

  const recognizeText = async () => {
    if (!canvasRef.current) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const imageData = canvasRef.current.toDataURL('image/png');

      const response = await fetch(`${API_BASE_URL}/handwriting/recognize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Recognition failed');
      }
    } catch (err) {
      setError('Failed to connect to backend. Make sure it\'s running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handwriting-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium text-sm">
              <Pencil className="w-4 h-4" />
              Handwriting Recognition
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-gray-700 text-4xl">Recognize Your</span>
              <br />
              <span className="text-gray-900">Handwritten Text</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Draw or write directly on the canvas. Our AI will instantly recognize your handwriting with high accuracy.
            </p>
          </motion.div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Canvas section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-smooth p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Pencil className="w-6 h-6 text-purple-600" />
                Draw Your Text
              </h2>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ boxShadow: '0 0 20px rgba(147, 51, 234, 0.2)' }}
                  className="border-4 border-purple-200 rounded-xl overflow-hidden bg-white cursor-crosshair transition-shadow"
                >
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full cursor-crosshair"
                  />
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <WaterDropButton
                    variant="secondary"
                    size="md"
                    onClick={clearCanvas}
                    icon={<Trash2 className="w-5 h-5" />}
                  >
                    Clear
                  </WaterDropButton>
                  <WaterDropButton
                    variant="primary"
                    size="md"
                    onClick={recognizeText}
                    disabled={loading}
                    icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Pencil className="w-5 h-5" />}
                  >
                    {loading ? 'Processing...' : 'Recognize'}
                  </WaterDropButton>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-purple-50 p-4 rounded-lg border border-purple-200"
                >
                  <p className="text-sm text-purple-900">
                    <strong>💡 Tip:</strong> Write clearly in block letters. Try words like "smile", "hello", or "test".
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Results section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-smooth p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recognition Result</h2>
                {result && (
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

              {!result && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <Pencil className="w-20 h-20 mb-4 opacity-50" />
                  <p className="text-lg">Draw text and click Recognize</p>
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-800 mb-3">Recognized Text</h3>
                    <p className="text-4xl font-bold text-purple-900 break-words">
                      {result.text || 'No text detected'}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-50 p-4 rounded-lg cursor-pointer border border-green-200"
                    >
                      <p className="text-sm text-gray-600 mb-1">Confidence</p>
                      <p className="text-3xl font-bold text-green-600">
                        {(result.confidence * 100).toFixed(1)}%
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-50 p-4 rounded-lg cursor-pointer border border-blue-200"
                    >
                      <p className="text-sm text-gray-600 mb-1">Words</p>
                      <p className="text-3xl font-bold text-blue-600">{result.word_count || 0}</p>
                    </motion.div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Method:</strong> {result.method}
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Status:</strong> {result.status}
                    </p>
                  </div>
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