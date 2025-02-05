import { X } from "lucide-react";
import React from "react";
import { Config, Provider } from "../types";

interface ConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  config: Config;
  onConfigChange: (config: Config) => void;
}

export const ConfigSidebar: React.FC<ConfigSidebarProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                Configuration
              </h2>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative flex-1 px-4 sm:px-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Provider
                  </label>
                  <select
                    value={config.provider}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        provider: e.target.value as Provider,
                        apiKey: "",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) =>
                      onConfigChange({ ...config, apiKey: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    System Prompt
                  </label>
                  <textarea
                    rows={4}
                    value={config.systemPrompt}
                    onChange={(e) =>
                      onConfigChange({
                        ...config,
                        systemPrompt: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
