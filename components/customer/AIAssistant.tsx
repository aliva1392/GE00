import React, { useState } from 'react';
import { getPrintSuggestion } from '../../services/geminiService';
import { OrderConfig } from '../../types';

interface AIAssistantProps {
    onSuggestion: (suggestion: Partial<OrderConfig>) => void;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AIAssistant: React.FC<AIAssistantProps> = ({ onSuggestion }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const suggestion = await getPrintSuggestion(prompt);
            onSuggestion(suggestion);
        } catch (err) {
            setError('متاسفانه دستیار هوشمند با خطا مواجه شد. لطفا دوباره تلاش کنید.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg border border-teal-700/50 shadow-lg">
            <div className="flex items-center mb-4">
                 <span className="text-teal-400 p-2 bg-gray-700 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707M12 21v-1m-4.243-9.757A4.5 4.5 0 0112 6.5a4.5 4.5 0 014.243 4.243" /></svg>
                 </span>
                 <h3 className="text-lg font-semibold text-gray-100 mr-3">دستیار هوشمند چاپ</h3>
            </div>
             <p className="text-sm text-gray-400 mb-4">
                نیاز خود را به زبان ساده بنویسید تا بهترین تنظیمات برای شما پیشنهاد شود. <br/>
                مثال: «می‌خواهم یک جزوه ۱۰۰ صفحه‌ای، سیاه و سفید و پشت و رو چاپ کنم و فنری بشه.»
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="درخواست خود را اینجا بنویسید..."
                    className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-teal-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? <Spinner /> : 'دریافت پیشنهاد'}
                </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};

export default AIAssistant;