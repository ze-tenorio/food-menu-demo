import React, { useState } from 'react';
import { X, Star, Send, CheckCircle } from 'lucide-react';

interface CsatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
  planId?: string;
}

const CsatModal: React.FC<CsatModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  planId 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(rating, feedback);
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Fechar modal após mostrar confirmação
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const getRatingLabel = (value: number): string => {
    switch (value) {
      case 1: return 'Muito insatisfeito';
      case 2: return 'Insatisfeito';
      case 3: return 'Neutro';
      case 4: return 'Satisfeito';
      case 5: return 'Muito satisfeito';
      default: return 'Selecione uma nota';
    }
  };

  const getRatingEmoji = (value: number): string => {
    switch (value) {
      case 1: return '😞';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '🤩';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 pb-8">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              {isSubmitted ? (
                <CheckCircle size={32} className="text-white" />
              ) : (
                <Star size={32} className="text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isSubmitted ? 'Obrigado!' : 'Sua opinião importa!'}
            </h2>
            <p className="text-white/90 text-sm">
              {isSubmitted 
                ? 'Seu feedback foi enviado com sucesso.' 
                : 'Como você avalia sua experiência com o Menu Alimentar?'
              }
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <div className="p-6">
            {/* Star Rating */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-200 transform hover:scale-110 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    <Star
                      size={40}
                      className={`transition-colors duration-200 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              {/* Rating Label */}
              <div className="h-8 flex items-center justify-center gap-2">
                {(hoveredRating || rating) > 0 && (
                  <>
                    <span className="text-2xl">{getRatingEmoji(hoveredRating || rating)}</span>
                    <span className="text-gray-600 font-medium">
                      {getRatingLabel(hoveredRating || rating)}
                    </span>
                  </>
                )}
                {(hoveredRating || rating) === 0 && (
                  <span className="text-gray-400 text-sm">
                    Toque nas estrelas para avaliar
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conte-nos mais (opcional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="O que você achou do seu menu alimentar? Alguma sugestão de melhoria?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                rating === 0 || isSubmitting
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Avaliação
                </>
              )}
            </button>

            {/* Skip Button */}
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full mt-3 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
            >
              Pular avaliação
            </button>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="py-4">
              <p className="text-gray-600 mb-4">
                Sua avaliação nos ajuda a melhorar constantemente!
              </p>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Você avaliou: {getRatingLabel(rating)} {getRatingEmoji(rating)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsatModal;

