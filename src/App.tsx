import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ConfigSidebar } from "./components/ConfigSidebar";
import { FileDropzone } from "./components/FileDropzone";
import { DEFAULT_SYSTEM_PROMPT, STORAGE_KEY } from "./constants";
import { Config, FileUpload, Provider } from "./types";

function App() {
  const [templateFiles, setTemplateFiles] = useState<FileUpload[]>([]);
  const [studentFiles, setStudentFiles] = useState<FileUpload[]>([]);
  const [activeTab, setActiveTab] = useState<"template" | "submission">(
    "template"
  );
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const handleTemplateFilesAdded = (newFiles: FileUpload[]) => {
    setTemplateFiles((prev) => [...prev, ...newFiles]);
  };

  const handleStudentFilesAdded = (newFiles: FileUpload[]) => {
    setStudentFiles((prev) => [...prev, ...newFiles]);
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
          <div className="mb-8">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("template")}
                className={`${
                  activeTab === "template"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                } rounded-md px-3 py-2 text-sm font-medium`}
              >
                Template
              </button>
              <button
                onClick={() => setActiveTab("submission")}
                className={`${
                  activeTab === "submission"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                } rounded-md px-3 py-2 text-sm font-medium`}
              >
                Submission
              </button>
            </nav>
          </div>

          <div className="space-y-8">
            {activeTab === "template" ? (
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
            ) : (
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
            )}
          </div>
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
