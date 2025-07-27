"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DropdownItem {
  href: string;
  label: string;
  hieroglyph: string;
}

interface MobileDropdownProps {
  title: string;
  titleHref: string;
  titleHieroglyph: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: () => void;
}

export default function MobileDropdown({
  title,
  titleHref,
  titleHieroglyph,
  items,
  isOpen,
  onToggle,
  onItemClick
}: MobileDropdownProps) {
  return (
    <div className="space-y-1">
      {/* Main Dropdown Button */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-r from-egyptian-gold/20 to-sunset-orange/20 text-hieroglyph-brown border border-egyptian-gold/30'
            : 'hover:bg-white/70 text-hieroglyph-brown hover:text-egyptian-gold'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-egyptian-gold/10 flex items-center justify-center">
            <span className="text-xl">{titleHieroglyph}</span>
          </div>
          <span className="font-semibold text-lg">{title}</span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 space-y-2 py-2">
              {/* View All Link */}
              <Link
                href={titleHref}
                onClick={onItemClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-egyptian-gold/10 text-hieroglyph-brown transition-colors group"
              >
                <div className="w-8 h-8 rounded bg-egyptian-gold/20 flex items-center justify-center group-hover:bg-egyptian-gold/30 transition-colors">
                  <ChevronRight className="w-4 h-4 text-egyptian-gold" />
                </div>
                <span className="font-medium">View All {title}</span>
              </Link>
              
              {/* Individual Items */}
              {items.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-egyptian-gold/10 text-hieroglyph-brown transition-colors group"
                  >
                    <div className="w-8 h-8 rounded bg-egyptian-gold/20 flex items-center justify-center group-hover:bg-egyptian-gold/30 transition-colors">
                      <span className="text-sm">{item.hieroglyph}</span>
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Show More Link if there are more items */}
              {items.length > 5 && (
                <Link
                  href={titleHref}
                  onClick={onItemClick}
                  className="flex items-center justify-center p-3 rounded-lg border border-egyptian-gold/20 text-egyptian-gold hover:bg-egyptian-gold/10 transition-colors"
                >
                  <span className="text-sm font-medium">
                    View {items.length - 5} More {title}
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
