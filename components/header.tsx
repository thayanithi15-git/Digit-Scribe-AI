'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Sparkles, Code2 } from 'lucide-react';
import WaterDropButton from './button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'OCR Scanner', href: '/ocr' },
    { name: 'Handwriting', href: '/handwriting' },
    { name: 'Digit Recognition', href: '/digit' },
  ];

  return (
    <header className="sticky bg-white top-0 z-50 glass-effect border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">DigitScribe</h1>
            <p className="text-xs text-gray-500">AI Text Recognition</p>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="link-hover text-gray-700 font-medium hover:text-blue-600"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/ocr">
              <WaterDropButton variant="primary" size="md">
                Get Started
              </WaterDropButton>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden border-t border-gray-200/50 overflow-hidden"
      >
        <div className="px-6 py-4 space-y-4">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -10 }}
              animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 font-medium hover:text-blue-600 py-2"
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          <Link href="/ocr" onClick={() => setIsOpen(false)}>
            <WaterDropButton variant="primary" size="md" className="w-full">
              Get Started
            </WaterDropButton>
          </Link>
        </div>
      </motion.div>
    </header>
  );
}