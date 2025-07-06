import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white text-4xl transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="text-slate-300 text-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;