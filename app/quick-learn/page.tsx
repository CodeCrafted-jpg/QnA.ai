"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  File,
  FileSpreadsheet,
  FileText,
  Link2,
  LoaderCircle,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";
import { useAppState } from "@/lib/state";

type ResourceType = "youtube" | "pdf" | "excel" | "file";

type Stage = "idle" | "loading" | "done";

export default function QuickLearn() {
  const [resourceType, setResourceType] = useState<ResourceType>("youtube");

  const [url, setUrl] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [stage, setStage] = useState<Stage>("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addResource } = useAppState();

  const resourceTypes = [
    {
      id: "youtube" as ResourceType,
      label: "YouTube",
      description: "Learn from a video",
      icon: Upload,
    },
    {
      id: "pdf" as ResourceType,
      label: "PDF",
      description: "Books, notes or documents",
      icon: FileText,
    },
    {
      id: "excel" as ResourceType,
      label: "Excel / CSV",
      description: "Datasets and spreadsheets",
      icon: FileSpreadsheet,
    },
    {
      id: "file" as ResourceType,
      label: "File",
      description: "Other learning resources",
      icon: File,
    },
  ];

  const handleResourceTypeChange = (type: ResourceType) => {
    setResourceType(type);
    setStage("idle");

    // Clear previous input when changing resource type
    setUrl("");
    setTimestamp("");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setStage("idle");
  };

  const analyze = () => {
    if (resourceType === "youtube" && !url.trim()) return;
    if (resourceType !== "youtube" && !selectedFile) return;

    setStage("loading");

    // Prototype analysis simulation
    setTimeout(() => {
      setStage("done");
    }, 900);
  };

  const add = () => {
    if (resourceType === "youtube") {
      if (!url.trim()) return;

      // Keeps compatibility with your existing addResource function.
      // You can later change your state function to accept metadata.
      addResource(url);
      return;
    }

    if (!selectedFile) return;

    // For now we pass the file name.
    // Later your backend/upload function can receive the actual File object.
    addResource(selectedFile.name);
  };

  const canAnalyze =
    resourceType === "youtube" ? Boolean(url.trim()) : Boolean(selectedFile);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
      {/* Header */}
      <div className="eyebrow text-neutral-400">Add resource</div>

      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        What do you want to learn from?
      </h1>

      <p className="mt-2 max-w-2xl text-neutral-500">
        Add a video, document, spreadsheet, or any other learning resource and
        turn it into an interactive learning experience.
      </p>

      {/* Resource Type Selector */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resourceTypes.map((resource) => {
          const Icon = resource.icon;

          const isActive = resourceType === resource.id;

          return (
            <button
              key={resource.id}
              type="button"
              onClick={() => handleResourceTypeChange(resource.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                isActive
                  ? "border-black bg-black text-white"
                  : "border-[var(--line)] bg-white hover:border-neutral-400"
              }`}
            >
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  isActive ? "bg-white/10" : "bg-neutral-100"
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="mt-4 font-semibold">{resource.label}</div>

              <div
                className={`mt-1 text-xs ${
                  isActive ? "text-white/60" : "text-neutral-400"
                }`}
              >
                {resource.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Resource Input */}
      <div className="surface mt-6 p-5">
        {/* YouTube */}
        {resourceType === "youtube" && (
          <div>
            <div className="flex gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neutral-100">
                <Link2 size={18} />
              </div>

              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setStage("idle");
                }}
                placeholder="Paste YouTube URL"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />

              <button
                onClick={analyze}
                disabled={!canAnalyze || stage === "loading"}
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                {stage === "loading" ? (
                  <LoaderCircle className="animate-spin" size={16} />
                ) : (
                  "Analyze"
                )}
              </button>
            </div>

            {/* YouTube Timestamp */}
            <div className="mt-4 border-t border-[var(--line)] pt-4">
              <label className="text-xs font-medium text-neutral-500">
                Start timestamp
              </label>

              <div className="mt-2 flex items-center gap-3">
                <input
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="00:00"
                  className="w-32 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
                />

                <span className="text-xs text-neutral-400">
                  Optional — e.g. 12:45
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PDF / Excel / File */}
        {resourceType !== "youtube" && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept={
                resourceType === "pdf"
                  ? ".pdf,application/pdf"
                  : resourceType === "excel"
                    ? ".xlsx,.xls,.csv"
                    : undefined
              }
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--line)] px-6 py-10 text-center transition hover:border-neutral-400"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-neutral-100">
                <Upload size={20} />
              </div>

              {selectedFile ? (
                <>
                  <div className="mt-4 font-semibold">{selectedFile.name}</div>

                  <div className="mt-1 text-xs text-neutral-400">
                    Click to choose a different file
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4 font-semibold">
                    Upload{" "}
                    {resourceType === "pdf"
                      ? "a PDF"
                      : resourceType === "excel"
                        ? "an Excel or CSV file"
                        : "your file"}
                  </div>

                  <div className="mt-1 text-xs text-neutral-400">
                    Click to browse files from your computer
                  </div>
                </>
              )}
            </button>

            <button
              onClick={analyze}
              disabled={!canAnalyze || stage === "loading"}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {stage === "loading" ? (
                <>
                  <LoaderCircle className="animate-spin" size={16} />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Resource
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {stage === "loading" && (
          <div className="mt-5 rounded-xl bg-neutral-50 p-4 text-sm">
            Analyzing your learning resource…
            <span className="ml-2 text-neutral-400">
              ✓ Resource identified · ✓ Concepts discovered · ● Building
              learning map
            </span>
          </div>
        )}

        {/* Analysis Complete */}
        {stage === "done" && (
          <div className="mt-5 border-t border-[var(--line)] pt-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1f7a5a]">
              <Check size={17} />
              Resource analyzed
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-xs text-neutral-400">Resource</div>

                <div className="mt-1 font-semibold">
                  {resourceType === "youtube"
                    ? "YouTube Video"
                    : selectedFile?.name}
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-400">
                  Concepts identified
                </div>

                <div className="mt-1 font-semibold">27</div>
              </div>

              <div>
                <div className="text-xs text-neutral-400">
                  Estimated learning time
                </div>

                <div className="mt-1 font-semibold">42 minutes</div>
              </div>
            </div>

            {/* YouTube timestamp preview */}
            {resourceType === "youtube" && timestamp.trim() && (
              <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                <div className="text-xs text-neutral-400">Starting point</div>

                <div className="mt-1 text-sm font-semibold">{timestamp}</div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/learn/linear-regression"
                className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white"
              >
                Start Learning
                <ArrowRight size={15} />
              </Link>

              <button
                onClick={add}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold"
              >
                <Plus size={15} />
                Add to Learning Path
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          [
            "Context-aware",
            "Ask questions about the exact moment or section you're studying.",
          ],
          [
            "Micro-assessments",
            "Check understanding before misconceptions stick.",
          ],
          [
            "Adaptive next step",
            "Turn weak concepts into a concrete revision plan.",
          ],
        ].map(([title, description]) => (
          <div key={title} className="surface p-5">
            <Sparkles size={17} />

            <div className="mt-4 font-semibold">{title}</div>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
