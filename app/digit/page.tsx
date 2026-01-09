'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Hash, Trash2, Download, AlertCircle } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WaterDropButton from '@/components/button';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DigitResult {
  digit: number;
  confidence: number;
  probabilities: { [key: string]: number };
  status: string;
}

export default function DigitRecognizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [result, setResult] = useState<DigitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        context.strokeStyle = '#000000';
        context.lineWidth = 20;
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

  const recognizeDigit = async () => {
    if (!canvasRef.current) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const imageData = canvasRef.current.toDataURL('image/png');

      const response = await fetch(`${API_BASE_URL}/digit/canvas`, {
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
    a.download = `digit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm">
              <Hash className="w-4 h-4" />
              Digit Recognition
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-gray-700 text-4xl">Recognize Handwritten</span>
              <br />
              <span className="text-gray-900">Digits (0-9)</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Draw a single digit on the canvas and let our AI instantly identify it with 99%+ accuracy.
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
                <Hash className="w-6 h-6 text-green-600" />
                Draw a Digit (0-9)
              </h2>

              <div className="space-y-4">
                <motion.div
                  whileHover={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)' }}
                  className="border-4 border-green-200 rounded-xl overflow-hidden bg-white cursor-crosshair transition-shadow"
                >
                  <canvas
                    ref={canvasRef}
                    width={400}
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
                    onClick={recognizeDigit}
                    disabled={loading}
                    icon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Hash className="w-5 h-5" />}
                  >
                    {loading ? 'Processing...' : 'Recognize'}
                  </WaterDropButton>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-green-50 p-4 rounded-lg border border-green-200"
                >
                  <p className="text-sm text-green-900">
                    <strong>💡 Tip:</strong> Draw a single digit (0-9) clearly in the center of the canvas.
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
                <h2 className="text-2xl font-bold text-gray-800">Prediction</h2>
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
                  <Hash className="w-20 h-20 mb-4 opacity-50" />
                  <p className="text-lg">Draw a digit and click Recognize</p>
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
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200 text-center cursor-pointer"
                  >
                    <h3 className="font-semibold text-gray-800 mb-3">Predicted Digit</h3>
                    <motion.p
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="text-9xl font-bold text-green-700"
                    >
                      {result.digit}
                    </motion.p>
                    <p className="text-xl text-green-600 mt-6 font-semibold">
                      Confidence: {(result.confidence * 100).toFixed(2)}%
                    </p>
                  </motion.div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-4">All Probabilities</h3>
                    <div className="space-y-3">
                      {Object.entries(result.probabilities)
                        .sort(([, a], [, b]) => b - a)
                        .map(([digit, prob], index) => (
                          <motion.div
                            key={digit}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3"
                          >
                            <span className="font-bold text-lg w-8 text-center">{digit}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${prob * 100}%` }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`h-full ${
                                  digit === String(result.digit)
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                                }`}
                              />
                            </div>
                            <span className="text-sm font-semibold w-14 text-right">
                              {(prob * 100).toFixed(1)}%
                            </span>
                          </motion.div>
                        ))}
                    </div>
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