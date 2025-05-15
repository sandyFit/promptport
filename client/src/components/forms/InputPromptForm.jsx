import { useState } from 'react';
import SmallBtn from '../buttons/SmallBtn';
import { RotateCcw, Upload} from 'lucide-react';
import PromptTextarea from '../PromptTextarea';
import ImportFileModal from '../modals/ImportFileModal';

const InputPromptForm = ({ prompt, setPrompt }) => {

    const [showImportModal, setShowImportModal] = useState(false);
    const examplePrompt = `Write a detailed analysis of renewable energy trends over the last decade, with a focus on solar and wind power adoption rates globally`;

    // Handle file content from ImportFileModal
    const handleFileContent = (content) => {
        setPrompt(content);
        setShowImportModal(false); // Close modal after successful import
    };

    const loadExample = (e) => {
        e.preventDefault();
        setPrompt(examplePrompt);
    };

    const handleImport = (e) => {
        e.preventDefault();
        setShowImportModal(true);
    };

    const handleReset = e => {
        e.preventDefault();
        setPrompt('');
    }

    return (
        <section>
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
                        htmlFor='sourceModel'
                        className="block text-sm font-medium text-gray-900"
                    >
                        Enter your prompt
                    </label>
                    <p className='text-xs'>(Type a prompt or import a file)</p>
                </header>

                <div className="relative">
                    <PromptTextarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Choose your source model and paste your prompt here...'
                        maxLength={5000}
                    />
                </div>

                <div className="flex gap-2 mt-2">
                    <SmallBtn
                        icon={<Upload size={14} />}
                        legend='Import' 
                        onClick={handleImport}
                    />
                    <SmallBtn
                        legend='Example'
                        onClick={ loadExample }
                        disabled={!prompt} // Disable export if no prompt is available
                    />
                    <SmallBtn
                        icon={<RotateCcw size={14}/>}
                        legend='Reset'
                        onClick={handleReset}                       
                    />
                </div>
            </form>
        </section>
    )
}

export default InputPromptForm;
