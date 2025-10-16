import React from 'react';
interface LanguageSwitcherProps {
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  selectedLanguage,
  onSelectLanguage
}) => {
  const languages = [{
    id: 'javascript',
    name: 'JavaScript'
  }, {
    id: 'python',
    name: 'Python'
  }, {
    id: 'c',
    name: 'C'
  }];
  return <div className="flex items-center space-x-1">
      {languages.map(lang => <button key={lang.id} className={`px-3 py-1.5 rounded-md text-sm transition-colors ${selectedLanguage === lang.id ? 'bg-[#313244] text-white' : 'text-gray-400 hover:bg-[#232634] hover:text-gray-200'}`} onClick={() => onSelectLanguage(lang.id)}>
          {lang.name}
        </button>)}
    </div>;
};
export default LanguageSwitcher;