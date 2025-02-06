# Code Assignment Grader

A modern web application for comparing and grading code assignments against template solutions using AI. The app supports both OpenAI and Google Gemini models for generating detailed feedback.

## Features

- 📝 Upload and compare template solutions with student submissions
- 🤖 AI-powered code review and feedback generation
- 🔄 Real-time streaming feedback display
- ⚙️ Configurable AI provider (OpenAI/Gemini)
- 🔐 Secure API key management
- 📋 Customizable system prompts for different grading styles

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- OpenAI GPT-4 API integration
- Google Gemini Pro API integration
- Local storage for configuration persistence

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Configuration

The app requires configuration of an AI provider and corresponding API key:

1. Click the "Settings" button in the top-right corner
2. Select your preferred AI provider (OpenAI or Gemini)
3. Enter your API key
4. (Optional) Customize the system prompt to modify the grading style

## Usage

1. Upload template solution files using the "Template" dropzone
2. Upload student submission files using the "Submission" dropzone
3. Click "Start Review" to generate AI feedback
4. View the generated feedback in real-time with Markdown formatting

## Security Note

API keys are stored locally in the browser and are never sent to any server other than the respective AI provider's API endpoints.

## Contributing

Feel free to open issues and pull requests for any improvements or bug fixes.

## License

MIT License - feel free to use this project for your own purposes.
