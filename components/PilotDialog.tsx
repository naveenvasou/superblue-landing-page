import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface PilotDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const PilotDialog: React.FC<PilotDialogProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [monthlyCallVolume, setMonthlyCallVolume] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailError, setEmailError] = useState('');
    const [volumeError, setVolumeError] = useState('');

    // Reset form when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setEmail('');
                setMonthlyCallVolume('');
                setSubmitStatus('idle');
                setEmailError('');
                setVolumeError('');
                setErrorMessage('');
            }, 200);
        }
    }, [isOpen]);

    // ESC key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const validateEmail = (value: string): boolean => {
        if (!value.trim()) {
            setEmailError('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validateVolume = (value: string): boolean => {
        if (!value) {
            setVolumeError('Please select your call volume');
            return false;
        }
        setVolumeError('');
        return true;
    };

    const handleEmailBlur = () => {
        validateEmail(email);
    };

    const handleVolumeBlur = () => {
        validateVolume(monthlyCallVolume);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isEmailValid = validateEmail(email);
        const isVolumeValid = validateVolume(monthlyCallVolume);

        if (!isEmailValid || !isVolumeValid) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const formData = {
                access_key: import.meta.env.VITE_WEB3FORMS_KEY,
                email: email,
                monthly_calls: monthlyCallVolume,
                subject: 'New Pilot Application - SuperBlue'
            };

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSubmitStatus('success');
                // Auto-close after 2 seconds
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setSubmitStatus('error');
                setErrorMessage('Something went wrong. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const callVolumeOptions = [
        { value: '0-1000', label: '0-1,000 calls/month' },
        { value: '1000-5000', label: '1,000-5,000 calls/month' },
        { value: '5000-10000', label: '5,000-10,000 calls/month' },
        { value: '10000+', label: 'More than 10,000 calls/month' }
    ];

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                            aria-label="Close dialog"
                        >
                            <X size={20} />
                        </button>

                        {/* Content */}
                        {submitStatus === 'success' ? (
                            <div className="text-center py-8">
                                <div className="mb-4 text-5xl">🎉</div>
                                <h3 className="text-2xl font-heading font-semibold text-slate-900 mb-2">
                                    Thank you!
                                </h3>
                                <p className="text-slate-600">
                                    We'll be in touch soon to discuss your pilot.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-heading font-semibold text-slate-900 mb-2">
                                        Start a pilot
                                    </h2>
                                    <p className="text-slate-600">
                                        Tell us about your needs and we'll get you set up.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (emailError) setEmailError('');
                                            }}
                                            onBlur={handleEmailBlur}
                                            placeholder="you@company.com"
                                            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent ${emailError ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            disabled={isSubmitting}
                                        />
                                        {emailError && (
                                            <p className="mt-1 text-sm text-red-500">{emailError}</p>
                                        )}
                                    </div>

                                    {/* Call Volume Field */}
                                    <div>
                                        <label htmlFor="callVolume" className="block text-sm font-medium text-slate-700 mb-2">
                                            Monthly call volume <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="callVolume"
                                            value={monthlyCallVolume}
                                            onChange={(e) => {
                                                setMonthlyCallVolume(e.target.value);
                                                if (volumeError) setVolumeError('');
                                            }}
                                            onBlur={handleVolumeBlur}
                                            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent appearance-none bg-white ${volumeError ? 'border-red-500' : 'border-slate-300'
                                                }`}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select your call volume</option>
                                            {callVolumeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {volumeError && (
                                            <p className="mt-1 text-sm text-red-500">{volumeError}</p>
                                        )}
                                    </div>

                                    {/* Error Message */}
                                    {submitStatus === 'error' && errorMessage && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-700">{errorMessage}</p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !email || !monthlyCallVolume}
                                        className="w-full px-6 py-3 bg-slate-950 text-white rounded-full font-medium hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-950"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default PilotDialog;
