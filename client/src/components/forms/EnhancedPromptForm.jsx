import { useState } from 'react';
import SmallBtn from '../buttons/SmallBtn';
import { Copy } from 'lucide-react';
import models from '../../data/models';
import PromptTextarea from '../PromptTextarea';

const EnhancedPromptForm = ({ model, setModel, prompt, setPrompt }) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
    };

    return (
        <section>
            <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                <header className="flex items-center gap-4 mb-4">
                    <label
                        htmlFor='targetModel'
                        className="block text-sm font-medium text-gray-900"
                    >
                        Pick a technique
                    </label>
                    <select
                        id='targetModel'
                        className="block w-64 rounded border border-gray-300 focus:outline-none focus:ring-2
                            focus:border-purple-500 focus:ring-purple-500 text-sm text-gray-800
                            shadow-sm shadow-gray-200"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    >
                        {models.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                    </select>
                </header>

                <div className="relative">
                    <PromptTextarea
                        value={prompt}
                        onChange={(e) => {}}
                        placeholder='Enhanced prompt will appear here in your target model...'
                        maxLength={5000}
                        readOnly
                    />
                </div>

                <div className="flex gap-2 mt-2">
                    <SmallBtn
                        icon={<Copy size={14} />}
                        legend='Copy'
                        onClick={handleCopy}
                    />
                    <SmallBtn
                        legend='Export'
                        onClick={(e) => { e.preventDefault(); /* Export logic */ }}
                        disabled={!prompt} // Disable export if no prompt is available
                    />
                </div>
            </form>
        </section>
    )
}

export default EnhancedPromptForm;
