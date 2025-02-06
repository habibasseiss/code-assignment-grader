import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfigSidebar } from "./components/ConfigSidebar";
import { FileDropzone } from "./components/FileDropzone";
import { DEFAULT_SYSTEM_PROMPT, STORAGE_KEY } from "./constants";
import { handleReview } from "./services/reviewService";
import { Config, FileUpload, Provider } from "./types";

function App() {
  const [templateFiles, setTemplateFiles] = useState<FileUpload[]>([]);
  const [studentFiles, setStudentFiles] = useState<FileUpload[]>([]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState<Config>(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    return {
      provider: "openai" as Provider,
      apiKey: "",
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const handleTemplateFilesAdded = (newFiles: FileUpload[]) => {
    setTemplateFiles((prev) => [...prev, ...newFiles]);
  };

  const handleStudentFilesAdded = (newFiles: FileUpload[]) => {
    setStudentFiles((prev) => [...prev, ...newFiles]);
  };

  const onReviewStart = async () => {
    if (!config.apiKey) {
      alert("Please set your API key in the settings");
      return;
    }

    if (templateFiles.length === 0) {
      alert("Please upload template files first");
      return;
    }

    if (studentFiles.length === 0) {
      alert("Please upload submission files");
      return;
    }

    setIsLoading(true);
    setFeedback("");

    try {
      const response = await handleReview(config, templateFiles, studentFiles);
      setFeedback(response);
    } catch (error) {
      console.error("Error during review:", error);
      setFeedback(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Code Reviewer
            </h1>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Settings className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" />
              Settings
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Template</h2>
              <FileDropzone
                files={templateFiles}
                isTemplate={true}
                onFilesAdded={handleTemplateFilesAdded}
                onFileRemove={(fileName) =>
                  setTemplateFiles((prev) =>
                    prev.filter((file) => file.name !== fileName)
                  )
                }
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Submission
              </h2>
              <FileDropzone
                files={studentFiles}
                isTemplate={false}
                onFilesAdded={handleStudentFilesAdded}
                onFileRemove={(fileName) =>
                  setStudentFiles((prev) =>
                    prev.filter((file) => file.name !== fileName)
                  )
                }
              />

              <div className="flex justify-end">
                <button
                  onClick={onReviewStart}
                  disabled={isLoading || studentFiles.length === 0}
                  className={`rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm ${
                    isLoading || studentFiles.length === 0
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                >
                  {isLoading ? "Reviewing..." : "Start Review"}
                </button>

                <button
                  disabled={isLoading || studentFiles.length === 0}
                  onClick={() => {
                    setStudentFiles([]);
                    setFeedback("");
                  }}
                  className={`ml-2 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 ${
                    isLoading || studentFiles.length === 0
                      ? "cursor-not-allowed bg-gray-100 text-gray-500"
                      : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  Clear Submission
                </button>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <pre className="whitespace-pre-wrap">{feedback}</pre>
            </div>
          )}
        </div>
      </main>

      <ConfigSidebar
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onConfigChange={setConfig}
      />
    </div>
  );
}

export default App;
