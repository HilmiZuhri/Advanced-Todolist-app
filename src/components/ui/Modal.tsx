// src/components/ui/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react'; // Icon untuk tombol close

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Menutup modal jika tombol Escape ditekan
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Menutup modal jika klik di luar modal content
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Mencegah scroll pada body saat modal terbuka
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      // Mengembalikan scroll pada body saat modal tertutup
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = ''; // Pastikan overflow direset saat komponen unmount
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md p-6 rounded-lg shadow-xl bg-[var(--color-bg)] border border-[var(--color-border)] transform transition-all duration-300 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-bold text-[var(--color-text-h)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--color-text)] hover:bg-[var(--color-border)] transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;