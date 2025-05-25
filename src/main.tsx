import React from 'react';
import ReactDOM from 'react-dom/client';
import PromptEditor from './components/PromptEditor/PromptEditor.tsx';
import './styles/tailwind.css'; // Import Tailwind CSS

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY; // Read API key from environment variables

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {!openAIApiKey ? (
      <div>Error: OpenAI API key not found. Please add it to your .env file as VITE_OPENAI_API_KEY.</div>
    ) : (
      <PromptEditor openAIApiKey={openAIApiKey} />
    )}
  </React.StrictMode>
);