export interface PromptVariable {
  name: string;
  value: string;
}

export interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  variables: PromptVariable[];
}

export interface ApiResponse {
  // Define based on OpenAI API response structure
  // This is a simplified example, adjust according to actual API response
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
    index: number;
  }[];
  created: number;
  model: string;
  system_fingerprint: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface PromptEditorProps {
  // Add any props the component might accept, e.g., initial prompt or API key
  initialPrompt?: string;
  openAIApiKey: string; // API key is required
} 