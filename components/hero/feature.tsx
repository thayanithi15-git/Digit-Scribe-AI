'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PenTool, Hash, Zap, Shield, Microscope } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: 'OCR Scanning',
      description: 'Extract text from images and documents with exceptional accuracy. Support for multiple languages and document types.',
      color: 'from-blue-600 to-blue-400',
      bgColor: 'from-blue-50 to-blue-100/50',
    },
    {
      icon: PenTool,
      title: 'Handwriting Recognition',
      description: 'Recognize handwritten text in real-time. Perfect for digitizing notes, forms, and documents.',
      color: 'from-purple-600 to-purple-400',
      bgColor: 'from-purple-50 to-purple-100/50',
    },
    {
      icon: Hash,
      title: 'Digit Recognition',
      description: 'Identify handwritten digits with 99%+ accuracy. Ideal for postal codes, numbers, and numerical data.',
      color: 'from-green-600 to-green-400',
      bgColor: 'from-green-50 to-green-100/50',
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Get instant results with optimized AI models. Process multiple images simultaneously with high performance.',
      color: 'from-yellow-600 to-yellow-400',
      bgColor: 'from-yellow-50 to-yellow-100/50',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is processed securely. We never store or share your images. Complete privacy guaranteed.',
      color: 'from-red-600 to-red-400',
      bgColor: 'from-red-50 to-red-100/50',
    },
    {
      icon: Microscope,
      title: 'Deep Learning Powered',
      description: 'Utilizing state-of-the-art neural networks and machine learning algorithms for superior accuracy.',
      color: 'from-indigo-600 to-indigo-400',
      bgColor: 'from-indigo-50 to-indigo-100/50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="relative bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
            <Microscope className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Everything You Need for
            <br />
            <span className="gradient-text">Text Recognition</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comprehensive tools for document digitization, handwriting analysis, and digit recognition with unmatched accuracy.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Card content */}
                <div className="relative p-8 rounded-2xl glass-effect border border-white/40 group-hover:border-white/60 shadow-smooth group-hover:shadow-smooth-hover transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="mt-6 flex items-center gap-2 text-blue-600 font-semibold"
                  >
                    Learn more
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}