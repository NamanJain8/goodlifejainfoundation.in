import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';
import Button from './Button';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Share Your Feedback" 
}) => {
  const [state, handleSubmit] = useForm("mgvlddkl"); // Replace with your Formspree form ID
  const [rating, setRating] = useState(0);


  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  // Handle form submission with Formspree
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Add rating to form data before submission
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    
    // Track feedback submission
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'feedback_submitted', {
        event_category: 'engagement',
        event_label: 'feedback_form',
        value: rating
      });
    }
    
    // Let Formspree handle the submission
    handleSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-200 rounded-xl shadow-2xl border border-surface-100 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <MessageSquare size={20} className="text-dark-950" />
            </div>
            <h2 className="text-xl font-serif font-bold gradient-text">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {state.succeeded ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Thank You!</h3>
              <p className="text-gray-400">
                Your feedback has been submitted successfully. We appreciate your input!
              </p>
              <div className="mt-6">
                <Button
                  onClick={onClose}
                  variant="primary"
                  className="px-6"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Description */}
              <div className="text-center mb-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Help us improve the Brahmi learning experience. Your feedback is valuable to us.
                </p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  How would you rate your experience?
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`w-8 h-8 rounded-full transition-colors duration-200 ${
                        star <= rating
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  placeholder="Your name"
                />
                <ValidationError 
                  prefix="Name" 
                  field="name"
                  errors={state.errors}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                  placeholder="your.email@example.com"
                />
                <ValidationError 
                  prefix="Email" 
                  field="email"
                  errors={state.errors}
                />
              </div>

              {/* Feedback */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 resize-none"
                  placeholder="Please share your thoughts, suggestions, or report any issues..."
                />
                <ValidationError 
                  prefix="Message" 
                  field="message"
                  errors={state.errors}
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={state.submitting}
                  className="flex-1"
                >
                  {state.submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send size={16} />
                      <span>Submit Feedback</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
