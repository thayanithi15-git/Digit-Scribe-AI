'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FastForward, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import WaterDropButton from '../button';

export default function CTA() {
  return (
    <section className="relative py-20 px-6 bg-white overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-effect rounded-3xl border border-white/40 p-12 md:p-16 text-center space-y-8"
        >
          {/* Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Ready to Transform Your
              <br />
              <span className="gradient-text">Text Recognition?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start using DigitScribe AI today and experience the power of advanced AI-driven text recognition. No credit card required.
            </p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/ocr">
              <WaterDropButton
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Now
              </WaterDropButton>
            </Link>
            <a href="#" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
              View Documentation
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-white/20"
          >
            {[
              { label: 'Secure', icon: Lock },
              { label: 'Fast', icon: FastForward },
              { label: 'Accurate', icon: Sparkles },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center justify-center gap-2 text-gray-700">
                <div className="text-2xl"><badge.icon className="w-6 h-6" /></div>
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}