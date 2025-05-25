import React, { useState, useEffect } from 'react';
import { PromptEditorProps, PromptVariable, ApiResponse, SavedPrompt } from './PromptEditor.types'; // Import SavedPrompt type
import { parseVariables, mergePrompt } from '../../utils/promptUtils';
import { callOpenAIApi } from '../../api/openaiApi';
import { saveToLocalStorage, loadFromLocalStorage, getAllLocalStorageKeys } from '../../utils/localStorageUtils'; // Import localStorage utilities
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs for saved prompts - need to install uuid

// Import placeholder UI components (will replace with ShadCN/Tailwind later)
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

const LOCAL_STORAGE_PREFIX = 'prompt-editor-save-'; // Prefix for localStorage keys

/**
 * A React component for editing and running AI prompts with variable substitution and API integration.
 * Allows users to write prompts, define variables, select models, run prompts, view responses,
 * and save/load prompt templates locally.
 */
const PromptEditor: React.FC<PromptEditorProps> = ({ initialPrompt = '', openAIApiKey }) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [variables, setVariables] = useState<PromptVariable[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o'); // Default model
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [selectedSavedPromptId, setSelectedSavedPromptId] = useState<string>('');
  const [newPromptName, setNewPromptName] = useState<string>('');

  /**
   * Loads saved prompts from localStorage on component mount.
   */
  useEffect(() => {
    const keys = getAllLocalStorageKeys();
    const loadedPrompts: SavedPrompt[] = [];
    keys.forEach(key => {
      if (key.startsWith(LOCAL_STORAGE_PREFIX)) {
        const saved = loadFromLocalStorage<SavedPrompt>(key);
        if (saved) {
          loadedPrompts.push(saved);
        }
      }
    });
    setSavedPrompts(loadedPrompts);
  }, []); // Run only on mount

  /**
   * Parses variables from the prompt whenever the prompt string changes
   * and updates the variables state and variableValues state.
   */
  useEffect(() => {
    const newVariableNames = parseVariables(prompt);
    const newVariables: PromptVariable[] = newVariableNames.map(name => ({
      name,
      value: variableValues[name] || '', // Keep existing value if variable name persists
    }));
    setVariables(newVariables);

    // Update variable values state to only include newly parsed variables
    const updatedVariableValues: Record<string, string> = {};
    newVariableNames.forEach(name => {
      updatedVariableValues[name] = variableValues[name] || '';
    });
    setVariableValues(updatedVariableValues);

  }, [prompt]); // Re-run effect when prompt changes

  /**
   * Handles running the prompt by merging variables, calling the OpenAI API,
   * and updating the response and loading/error states.
   */
  const handleRunPrompt = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const finalPrompt = mergePrompt(prompt, variableValues);

    try {
      const apiResponse = await callOpenAIApi(finalPrompt, selectedModel, openAIApiKey);
      setResponse(apiResponse);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles changes in the input fields for variables.
   * @param variableName The name of the variable.
   * @param value The new value of the variable.
   */
  const handleVariableInputChange = (variableName: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [variableName]: value }));
  };

  /**
   * Handles saving the current prompt and its variable values to localStorage.
   * Requires a prompt name to be entered.
   */
  const handleSavePrompt = () => {
    if (!newPromptName.trim()) {
      alert('Please enter a name for the prompt.');
      return;
    }

    const newSavedPrompt: SavedPrompt = {
      id: uuidv4(), // Generate unique ID
      name: newPromptName.trim(),
      prompt: prompt,
      variables: variables.map(v => ({ ...v, value: variableValues[v.name] || '' })), // Save current variable values
    };

    const storageKey = `${LOCAL_STORAGE_PREFIX}${newSavedPrompt.id}`;
    saveToLocalStorage(storageKey, newSavedPrompt);
    setSavedPrompts(prev => [...prev, newSavedPrompt]);
    setNewPromptName(''); // Clear the input field
  };

  /**
   * Handles loading a saved prompt from localStorage.
   * Updates the prompt and variable values state with the loaded data.
   * @param savedPromptId The ID of the saved prompt to load.
   */
  const handleLoadPrompt = (savedPromptId: string) => {
    const promptToLoad = savedPrompts.find(p => p.id === savedPromptId);
    if (promptToLoad) {
      setPrompt(promptToLoad.prompt);
      // Load variable values from the saved prompt
      const loadedVariableValues: Record<string, string> = {};
      promptToLoad.variables.forEach(v => {
        loadedVariableValues[v.name] = v.value;
      });
      setVariableValues(loadedVariableValues);
      setSelectedSavedPromptId(savedPromptId);
    } else {
        setSelectedSavedPromptId(''); // Clear selection if not found
    }
  };

  /**
   * Handles exporting the current prompt data (prompt, variables, response) as a JSON file.
   */
  const handleExportJson = () => {
    const exportData = {
      prompt: prompt,
      variableValues: variableValues,
      model: selectedModel,
      response: response,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompt_data.json'; // Default filename
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Prompt Input */}
      <div>
        <label className="block text-sm font-medium mb-1">Prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt, use {variable} for placeholders"
          rows={6}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Variable Inputs */}
      {variables.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Variables</label>
          <div className="space-y-2">
            {variables.map(variable => (
              <div key={variable.name} className="flex items-center space-x-2">
                <label className="w-32 text-sm">{variable.name}</label>
                <Input
                  value={variableValues[variable.name] || ''}
                  onChange={(e) => handleVariableInputChange(variable.name, e.target.value)}
                  className="flex-1 border rounded p-2"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save/Load Section */}
      <div className="flex items-center space-x-4">
        <div>
            <label className="block text-sm font-medium mb-1">Save Prompt</label>
            <div className="flex space-x-2">
                <Input
                    value={newPromptName}
                    onChange={(e) => setNewPromptName(e.target.value)}
                    placeholder="Prompt name"
                    className="border rounded p-2"
                />
                <Button onClick={handleSavePrompt} className="bg-green-500 text-white px-4 py-2 rounded">
                    Save
                </Button>
            </div>
        </div>
        {savedPrompts.length > 0 && (
            <div>
                <label className="block text-sm font-medium mb-1">Load Prompt</label>
                <Select
                    value={selectedSavedPromptId}
                    onChange={(e) => handleLoadPrompt(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="">-- Select a saved prompt --</option>
                    {savedPrompts.map(saved => (
                        <option key={saved.id} value={saved.id}>
                            {saved.name}
                        </option>
                    ))}
                </Select>
            </div>
        )}
      </div>

      {/* Model Selection, Run, and Export Buttons */}
      <div className="flex items-center space-x-4">
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <Select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border rounded p-2"
          >
            {/* TODO: Populate with available models from API or a predefined list */}
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          </Select>
        </div>
        <Button onClick={handleRunPrompt} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? 'Running...' : 'Run'}
        </Button>
        <Button onClick={handleExportJson} disabled={!response} className="bg-gray-500 text-white px-4 py-2 rounded">
          Export JSON
        </Button>
      </div>

      {/* Output View */}
      {error && (
        <div className="text-red-500 text-sm">Error: {error}</div>
      )}
      {response && (
        <div>
          <label className="block text-sm font-medium mb-1">Response</label>
          <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{response.choices[0]?.message?.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptEditor; 