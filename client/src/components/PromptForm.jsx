import { useState } from 'react';
import SmallBtn from './buttons/SmallBtn';
import { Copy, Upload, Download } from 'lucide-react';
import models from '../data/models';
import PromptTextarea from './PromptTextarea';
import ImportFileModal from './modals/ImportFileModal';

const PromptForm = ({ isSourceModel, model, setModel, prompt, setPrompt }) => {
    const [showImportModal, setShowImportModal] = useState(false);

    // Handle file content from ImportFileModal
    const handleFileContent = (content) => {
        setPrompt(content);
        setShowImportModal(false); // Close modal after successful import
    };

    const loadExample = (e) => {
        e.preventDefault();
        setPrompt(`Write a detailed analysis of renewable energy trends over the last decade, with a focus on solar and wind power adoption rates globally`);
    };

    const handleCopyOrImport = (e) => {
        e.preventDefault();

        if (isSourceModel) {
            // Open import modal instead of directly triggering file input
            setShowImportModal(true);
        } else {
            // Copy prompt to clipboard
            navigator.clipboard.writeText(prompt);
        }
    };

    const handleExportOrAction = (e) => {
        e.preventDefault();

        if (isSourceModel) {
            // Load example prompt
            loadExample(e);
        } else {
            // Export functionality for the translated prompt
            // This could be implemented to export as PDF or any other format
            console.log("Export functionality to be implemented");

            // Basic text file export implementation
            if (prompt) {
                const blob = new Blob([prompt], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `translated_prompt_${new Date().toISOString().slice(0, 10)}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }
    };

    return (
        <article>
            {/* Import File Modal */}
            {showImportModal && (
                <ImportFileModal
                    setFileContent={handleFileContent}
                    isModalOpen={showImportModal}
                    onCloseModal={() => setShowImportModal(false)}
                />
            )}

            <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                <header className="flex items-center gap-4 mb-4">
                    <label
                        htmlFor={isSourceModel ? 'sourceModel' : 'targetModel'}
                        className="block text-sm font-medium text-gray-900"
                    >
                        {isSourceModel ? 'Source Model' : 'Target Model'}
                    </label>
                    <select
                        id={isSourceModel ? 'sourceModel' : 'targetModel'}
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
                        onChange={(e) => setPrompt(e.target.value)}
                        readOnly={!isSourceModel}
                        placeholder={isSourceModel ? 'Choose your source model and paste your prompt here...'
                            : 'Translated prompt will appear here in your target model...'}
                        maxLength={5000}
                    />
                </div>

                <div className="flex gap-2 mt-2">
                    <SmallBtn
                        icon={isSourceModel ? <Upload size={14} /> : <Copy size={14} />}
                        legend={isSourceModel ? 'Import' : 'Copy'}
                        onClick={handleCopyOrImport}
                    />
                    <SmallBtn
                        icon={isSourceModel ? <Download size={14} /> : <Download size={14} />}
                        legend={isSourceModel ? 'Example' : 'Export'}
                        onClick={handleExportOrAction}
                        disabled={!isSourceModel && !prompt} // Disable export if no prompt is available
                    />
                </div>
            </form>
        </article>
    );
};

export default PromptForm;
