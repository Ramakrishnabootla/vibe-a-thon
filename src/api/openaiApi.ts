import axios from 'axios';
import { ApiResponse } from '../components/PromptEditor/PromptEditor.types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Calls the OpenAI Chat Completions API.
 * @param prompt The final prompt string to send to the model.
 * @param model The model to use (e.g., 'gpt-4o', 'gpt-3.5-turbo').
 * @param apiKey Your OpenAI API key.
 * @returns A Promise resolving with the API response.
 */
export const callOpenAIApi = async (prompt: string, model: string, apiKey: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(
      OPENAI_API_URL,
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response Data:', error.response.data);
      console.error('API Error Response Status:', error.response.status);
      console.error('API Error Response Headers:', error.response.headers);
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.error?.message || error.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      throw new Error('API Error: No response received from server.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
      throw new Error(`API Error: ${error.message}`);
    }
  }
}; 