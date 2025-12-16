import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import Button from '../common/Button';

const SuccessModal = ({
    isOpen,
    onClose,
    title = 'Success!',
    message
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600">{message}</p>
                </div>

                {/* Action */}
                <Button
                    variant="primary"
                    className="w-full h-11"
                    onClick={onClose}
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

export default SuccessModal;
