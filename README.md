# Prompt Editor Component

## Overview

This repository contains a modular and reusable React + TypeScript component for creating and managing AI prompts. It provides a user interface similar to platforms like OpenAI Playground or PromptFlow, allowing users to:

- Write and edit prompts with variable placeholders (e.g., `{topic}`).
- Input values for the defined variables.
- Select an AI model (currently supports OpenAI models).
- Run the prompt by calling the OpenAI API.
- View the AI model's response.
- Optionally save and load prompt templates locally using `localStorage`.

This component is designed to be easily integrated into various React applications and serves as a good candidate for contribution to an open-source AI UI library.

## Features

- **Variable Parsing:** Automatically detects variables in the prompt string (format: `{variableName}`).
- **Dynamic Inputs:** Generates input fields for each detected variable.
- **Prompt Merging:** Replaces variable placeholders with user-provided values before sending the prompt to the API.
- **OpenAI API Integration:** Calls the OpenAI Chat Completions API (`gpt-4o`, `gpt-4`, `gpt-3.5-turbo` by default).
- **Response Display:** Shows the AI model's response in a formatted, scrollable block.
- **Local Storage:** Save and load prompt templates and their variable values locally.
- **Modular Design:** Organized into components, utilities, and API handlers.
- **TypeScript:** Provides strong typing for better code maintainability.
- **TailwindCSS (planned/integrated):** Utilizes TailwindCSS for flexible and rapid styling.

## Installation

Assuming you have a React project set up, install the necessary dependencies:

```bash
npm install react react-dom typescript axios openai uuid
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure TailwindCSS in your `tailwind.config.js` and include its directives in your main CSS file (e.g., `src/index.css` or `src/styles/tailwind.css`). Refer to the [TailwindCSS documentation](https://tailwindcss.com/docs/installation) for detailed setup instructions.

Copy the component, utility, and API files into your project according to the recommended structure:

```
your-project/
├── src/
│   ├── components/
│   │   ├── PromptEditor/
│   │   │   ├── PromptEditor.tsx
│   │   │   ├── PromptEditor.types.ts
│   │   │   └── index.ts
│   │   ├── ui/ (Your basic UI components or integrate ShadCN/another library)
│   │   └── index.ts
│   ├── utils/
│   │   ├── promptUtils.ts
│   │   ├── localStorageUtils.ts
│   │   └── index.ts
│   ├── api/
│   │   ├── openaiApi.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── tailwind.css
├── README.md
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Usage

Import and use the `PromptEditor` component in your React application:

```typescript
import PromptEditor from './components/PromptEditor';

function App() {
  // Replace with your actual OpenAI API key (consider using environment variables)
  const openAIApiKey = process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_API_KEY';

  if (!openAIApiKey || openAIApiKey === 'YOUR_API_KEY') {
    return <div>Please provide your OpenAI API key.</div>;
  }

  return (
    <div className="App">
      <h1>My Prompt Editor</h1>
      <PromptEditor
        openAIApiKey={openAIApiKey}
        initialPrompt="Write a short story about a {animal} in a {setting}."
      />
    </div>
  );
}

export default App;
```

### Props

- `openAIApiKey`: Your OpenAI API key (required).
- `initialPrompt`: An optional initial prompt string to load when the component mounts.

## OpenAI API Key Configuration

It is **highly recommended** to use environment variables to manage your OpenAI API key instead of hardcoding it. For example, using a `.env` file:

```
REACT_APP_OPENAI_API_KEY=sk-...
```

Make sure to configure your build process (e.g., Create React App, Vite) to load environment variables.

## Contributing to Open Source

This component is designed with open-source contributions in mind. If you plan to contribute this to a library:

- **Review Code:** Ensure the code adheres to the target library's coding standards and guidelines.
- **Testing:** Add comprehensive unit and integration tests.
- **Documentation:** Expand on this README and add specific documentation for the component within the library's documentation framework.
- **Accessibility:** Ensure the component is accessible.
- **Styling:** Adapt the styling to the library's preferred method (e.g., CSS modules, styled-components, different utility class patterns).
- **Build Process:** Integrate the component into the library's build and bundling process.

Replace the placeholder UI components in `src/components/ui` with the library's existing UI components or a chosen UI library (like ShadCN if not using raw Tailwind classes directly within the component).

## License
https://github.com/Ramakrishnabootla
https://github.com/Ramakrishnabootla
