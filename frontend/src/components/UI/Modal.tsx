import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass w-full max-w-lg rounded-3xl border border-white/50 p-6 shadow-xl"
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 16 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-midnight">{title}</h3>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
