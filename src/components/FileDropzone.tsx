import { Code, FolderOpen } from "lucide-react";
import React, { useCallback, useState } from "react";
import { FileUpload } from "../types";

interface FileDropzoneProps {
  files: FileUpload[];
  isTemplate: boolean;
  onFilesAdded: (files: FileUpload[]) => void;
  onFileRemove: (fileName: string) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  files,
  isTemplate,
  onFilesAdded,
  onFileRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (items: DataTransferItemList) => {
      const entries = Array.from(items)
        .filter((item) => item.kind === "file")
        .map((item) => item.webkitGetAsEntry());

      const readEntry = async (
        entry: FileSystemEntry
      ): Promise<FileUpload[]> => {
        if (!entry) return [];

        if (entry.isFile) {
          return new Promise((resolve) => {
            (entry as FileSystemFileEntry).file((file: File) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                resolve([
                  {
                    name: entry.fullPath.slice(1),
                    content: e.target?.result as string,
                  },
                ]);
              };
              reader.readAsText(file);
            });
          });
        }

        if (entry.isDirectory) {
          const dirReader = (entry as FileSystemDirectoryEntry).createReader();
          return new Promise((resolve) => {
            dirReader.readEntries(async (entries: FileSystemEntry[]) => {
              const files = await Promise.all(
                entries.map((e) => readEntry(e as FileSystemEntry))
              );
              resolve(files.flat());
            });
          });
        }

        return [];
      };

      const newFiles = await Promise.all(
        entries.map((entry) => readEntry(entry as FileSystemEntry))
      );
      onFilesAdded(newFiles.flat());
    },
    [onFilesAdded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.items);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const title = isTemplate
    ? "Assignment Template Files"
    : "Student Submission Files";
  const emptyText = isTemplate
    ? "Drop template files here"
    : "Drop student files here";

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">{title}</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400"
        }`}
      >
        {files.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">{emptyText}</p>
            <p className="mt-1 text-xs text-gray-400">
              Drag and drop files or folders here
            </p>
          </div>
        ) : (
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Code className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => onFileRemove(file.name)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
