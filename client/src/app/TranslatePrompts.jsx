import { useState } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Sparkles, MessageSquare } from 'lucide-react';
import models from '../data/models';
import PromptForm from '../components/PromptForm';
import ActionBtn from '../components/buttons/ActionBtn';
import InputPromptForm from '../components/forms/InputPromptForm';
import EnhancedPromptForm from '../components/forms/EnhancedPromptForm';

const TranslatePrompts = () => {
    const [sourceModel, setSourceModel] = useState('openai');
    const [targetModel, setTargetModel] = useState('claude');
    const [sourcePrompt, setSourcePrompt] = useState('');
    const [translatedPrompt, setTranslatedPrompt] = useState('');
    const [optimizations, setOptimizations] = useState([]);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [activeTab, setActiveTab] = useState('translate');
    const [reverseOutput, setReverseOutput] = useState('');
    const [inferredPrompt, setInferredPrompt] = useState('');
    const [isInferring, setIsInferring] = useState(false);
    const [responsePreview, setResponsePreview] = useState('');

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const translatePrompt = async () => {
        setIsTranslating(true);
        try {
            const response = await axios.post(`${BASE_URL}/translate`, {
                sourceModel,
                targetModel,
                sourcePrompt
            });

            const { data } = response;
            setTranslatedPrompt(data.translatedPrompt);

            // Generate Optimizations after successful translation
            generateOptimizations();
        } catch (error) {
            console.error('Error translating prompt:', error);
            setTranslatedPrompt('Error translating prompt.');
        } finally {
            setIsTranslating(false);
        }
    };

    const generateOptimizations = async () => {
        setIsOptimizing(true);
        try {
            // Use Amazon Q Developer's knowledge of model differences
            const response = await axios.post(`${BASE_URL}/optimize`, {
                targetModel,
                sourceModel,
                prompt: sourcePrompt,
                translatedPrompt
            });

            setOptimizations(response.data.optimizations || []);
        } catch (error) {
            console.error('Error optimizing prompt:', error);
            setOptimizations([]);
        } finally {
            setIsOptimizing(false);
        }
    };

    const inferPromptFromOutput = async () => {
        setIsInferring(true);
        try {
            const response = await axios.post(`${BASE_URL}/infer-prompt`, {
                model: targetModel,
                output: reverseOutput
            });
            setInferredPrompt(response.data.inferredPrompt);
        } catch (error) {
            console.error('Error inferring prompt:', error);
            setInferredPrompt('Error inferring prompt from output.');
        } finally {
            setIsInferring(false);
        }
    };

    const generateResponsePreview = async () => {
        if (!translatedPrompt.trim()) return;

        try {
            const response = await axios.post(`${BASE_URL}/preview-response`, {
                model: targetModel,
                prompt: translatedPrompt
            });

            setResponsePreview(response.data.preview);
        } catch (error) {
            console.error('Error generating response preview:', error);
            setResponsePreview('Error generating response preview.');
        }
    };

    return (   
        <section className="flex flex-col items-center justify-center text-center py-4">   
            <h3 className="text-xl font-medium text-gray-700 mb-2">Prompt Translation</h3>
            <p className="text-gray-500 mx-auto">
                Translate your prompt from one LLM to another, and get expert advice on how to optimize it
                for maximum performance.
            </p>    
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow-lg shadow-gray-200 
                px-12 pt-8 pb-3 mt-6 flex-grow">

                {activeTab === 'translate' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <InputPromptForm
                            prompt={sourcePrompt}
                            setPrompt={setSourcePrompt}
                        />
                        
                        <EnhancedPromptForm
                            model={targetModel}
                            setModel={setTargetModel}
                            prompt={translatedPrompt}
                            setPrompt={setTranslatedPrompt}
                        />


                        <div className="flex justify-center lg:col-span-2 -mt-7 mb-3">
                            <ActionBtn
                                onClick={translatePrompt}
                                disabled={!sourcePrompt}
                                loading={isTranslating ? "Translating" : false}
                                icon={ArrowRightLeft}
                                label="Translate Prompt"
                            />
                        </div>

                        {optimizations.length > 0 && (
                            <div className="bg-purple-50 p-4 rounded-md border border-purple-100 lg:col-span-2">
                                <h3 className="flex items-center text-purple-800 font-medium mb-2">
                                    <Sparkles size={18} className="mr-2" />
                                    Optimization Suggestions for {models.find(m => m.id === targetModel)?.name}
                                </h3>
                                <ul className="pl-6 space-y-1 list-disc text-purple-700 text-sm">
                                    {optimizations.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {translatedPrompt && (
                            <div className="flex justify-center lg:col-span-2 mt-4">
                                <ActionBtn
                                    onClick={generateResponsePreview}
                                    icon={MessageSquare}
                                    label="Generate Response Preview"
                                />
                            </div>
                        )}

                        {responsePreview && (
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 lg:col-span-2 mt-4">
                                <h3 className="flex items-center text-gray-800 font-medium mb-2">
                                    <MessageSquare size={18} className="mr-2" />
                                    Response Preview
                                </h3>
                                <div className="text-gray-700 text-sm whitespace-pre-line">
                                    {responsePreview}
                                </div>
                            </div>
                        )}
                    </div>           
                )}
            </div>       
        </section>
    );
};

export default TranslatePrompts;
