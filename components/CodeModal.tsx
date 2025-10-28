
import React, { useState } from 'react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeSnippets: { python: string; typescript: string } | undefined;
  algorithmName: string;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, codeSnippets, algorithmName }) => {
  const [lang, setLang] = useState<'python' | 'typescript'>('python');
  if (!isOpen) return null;

  const code = codeSnippets ? codeSnippets[lang] : 'Code not available.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-11/12 md:w-3/4 max-w-4xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{algorithmName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>
        <div className="mb-4 border-b border-gray-600">
            <button onClick={() => setLang('python')} className={`px-4 py-2 text-sm ${lang === 'python' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Python</button>
            <button onClick={() => setLang('typescript')} className={`px-4 py-2 text-sm ${lang === 'typescript' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>TypeScript</button>
        </div>
        <pre className="bg-gray-900 text-white p-4 rounded overflow-auto max-h-[70vh] text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeModal;
