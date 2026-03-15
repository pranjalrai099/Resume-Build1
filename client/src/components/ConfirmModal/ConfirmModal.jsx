import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Delete", 
  confirmColor = "bg-red-600 hover:bg-red-700" 
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in duration-200'>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className='absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all'
        >
          <X className='size-5' />
        </button>

        <div className='p-8 text-center'>
          <div className='bg-red-50 size-16 rounded-full flex items-center justify-center mx-auto mb-6'>
            <AlertCircle className='size-8 text-red-600' />
          </div>
          
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>{title}</h2>
          <p className='text-slate-500 text-sm mb-8'>{message}</p>

          <div className='flex gap-3'>
            <button 
              onClick={onClose} 
              className='flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-semibold text-sm'
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }} 
              className={`flex-1 py-3 ${confirmColor} text-white rounded-xl transition-all font-bold text-sm shadow-lg`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
