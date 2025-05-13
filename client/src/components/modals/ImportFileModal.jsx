import { useRef, useState, useEffect } from 'react'

const ImportFileModal = ({ setFileContent, isModalOpen, onCloseModal }) => {
    const fileInputRef = useRef(null);
    const modalRef = useRef(null);

    // Close modal when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onCloseModal();
            }
        };

        // Add event listener when the modal is open
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Clean up event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen, onCloseModal]);

    const triggerFileInput = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        const allowedTypes = ['.txt', '.json'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedTypes.includes(fileExtension)) {
            alert("Please select a file with .txt or .json extension");
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            setFileContent(e.target.result);
            onCloseModal(); // Close modal after successful import
        };
        reader.readAsText(file);
    };

    // If modal is not open, don't render anything
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Import File
                    </h3>
                    <button
                        onClick={onCloseModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <p className="mb-6 text-gray-600">
                    Choose a file to import — we accept .txt and .json only.<br/>
                    Other formats aren’t supported.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
                    <input
                        type="file"
                        accept=".txt,.json"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-purple-400 transition-colors">
                        <p className="mb-2 text-gray-700">Drag and drop your file here, or</p>
                        <button
                            onClick={triggerFileInput}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                            Browse Files
                        </button>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCloseModal}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImportFileModal;
