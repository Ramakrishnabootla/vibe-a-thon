import { PromptVariable } from "../components/PromptEditor/PromptEditor.types";

/**
 * Parses variables from a prompt string in the format {variableName}.
 * @param prompt The prompt string to parse.
 * @returns An array of unique variable names found in the prompt.
 */
export const parseVariables = (prompt: string): string[] => {
  const variableRegex = /{(\w+)}/g;
  const matches = prompt.match(variableRegex);
  if (!matches) {
    return [];
  }
  // Extract variable names and remove duplicates
  const variables = matches.map(match => match.substring(1, match.length - 1));
  return Array.from(new Set(variables));
};

/**
 * Merges a prompt string with variable values.
 * Replaces {variableName} placeholders with the corresponding values from the variableValues object.
 * @param prompt The prompt string with placeholders.
 * @param variableValues An object containing variable names as keys and their values.
 * @returns The prompt string with placeholders replaced by values.
 */
export const mergePrompt = (prompt: string, variableValues: Record<string, string>): string => {
  let merged = prompt;
  for (const varName in variableValues) {
    if (Object.prototype.hasOwnProperty.call(variableValues, varName)) {
      const value = variableValues[varName];
      const regex = new RegExp(`{${varName}}`, 'g');
      merged = merged.replace(regex, value);
    }
  }
  return merged;
}; 