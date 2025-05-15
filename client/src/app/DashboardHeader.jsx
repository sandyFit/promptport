import { useState } from 'react';
import TabButton from '../components/buttons/TabButton';
import { ArrowRightLeft, FlaskConical, TerminalSquare } from 'lucide-react';

const DashboardHeader = () => {

    const [activeTab, setActiveTab] = useState('translate');

    return (
        <header className='flex flex-col h-20 pt-4 pb-8 '>
            <div className="flex bg-white border-lg border-gray-200 shadow shadow-gray-200 
                rounded-t-lg p-2.5 gap-2">
                <TabButton
                    id="translate"
                    to="/app"
                    icon={ArrowRightLeft}
                    label="Prompt Builder"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('translate')}
                />
                <TabButton
                    id="test"
                    to="/app/test"
                    icon={FlaskConical}
                    label="Test Your Prompt"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('test')}
                />
                <TabButton
                    id="cli"
                    to="/app/cli"
                    icon={TerminalSquare}
                    label="CLI Tool"
                    activeTab={activeTab}
                    onClick={() => setActiveTab('cli')}
                />
            </div>
        </header>
    )
}

export default DashboardHeader;
