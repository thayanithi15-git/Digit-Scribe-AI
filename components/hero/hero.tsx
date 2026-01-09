'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import WaterDropButton from '../button';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Animated background */}
      <div className="absolute inset-0 animated-gradient opacity-40 -z-10" />
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-5xl mx-auto px-6 z-10 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI & Deep Learning
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-gray-700">Intelligent Text</span>
              <br />
              <span className="text-gray-900">Recognition System</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Unlock the power of AI-driven text recognition. Process documents, recognize handwriting, and identify digits with unprecedented accuracy.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/ocr">
              <WaterDropButton
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start Recognizing
              </WaterDropButton>
            </Link>
            <Link href="#features">
              <WaterDropButton variant="secondary" size="lg">
                Learn More
              </WaterDropButton>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 md:gap-8 pt-12"
          >
            {[
              { label: 'Accuracy', value: '99.2%' },
              { label: 'Supported Languages', value: '100+' },
              { label: 'Processing Speed', value: '<1s' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-xl glass-effect hover:shadow-smooth-hover"
              >
                <div className="text-2xl md:text-3xl font-bold text-gray-300">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-700 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              { icon: Brain, title: 'Neural Networks', desc: 'Advanced AI models' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Real-time processing' },
              { icon: Sparkles, title: 'Highly Accurate', desc: '99%+ precision' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={floatingVariants}
                  animate="animate"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  className="p-6 rounded-xl flex flex-col items-center glass-effect border border-white/40 hover:shadow-smooth-hover cursor-pointer"
                >
                  <Icon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}