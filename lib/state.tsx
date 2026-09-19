"use client";
import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LearningGoal = {
  id: string;
  title: string;
  level?: "beginner" | "intermediate" | "advanced";
  objective?: string;
};

export type LearningResource = {
  id: string;
  topicId: string;
  type: "youtube" | "pdf" | "excel" | "file";
  title: string;
  url?: string;
  duration?: string;
  timestamp?: string;
  source?: string;
};

type Ctx = {
  mastery: number;
  setMastery: (n: number) => void;
  showTutor: boolean;
  setShowTutor: (v: boolean) => void;
  recommendation: string;
  addResource: (
    resource: Omit<LearningResource, "id"> | string,
    topicId?: string,
  ) => LearningResource;
  resources: LearningResource[];
  getResourcesForTopic: (topicId: string) => LearningResource[];
  isResourcesLoading: boolean;
  goal: LearningGoal | null;
  goals: LearningGoal[];
  isStateLoading: boolean;
  saveGoal: (goal: Omit<LearningGoal, "id">) => void;
  updateGoal: (goal: LearningGoal) => void;
};
const StateContext = createContext<Ctx | null>(null);
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [mastery, setMastery] = useState(42);
  const [showTutor, setShowTutor] = useState(true);
  const [recommendation, setRecommendation] = useState(
    "Review Gradient Descent — 7 min",
  );
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [isStateLoading, setIsStateLoading] = useState(true);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("learnwise-resources");
      if (stored) {
        startTransition(() =>
          setResources(JSON.parse(stored) as LearningResource[]),
        );
      }
    } catch {
      window.localStorage.removeItem("learnwise-resources");
    } finally {
      startTransition(() => setIsResourcesLoading(false));
    }
  }, []);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("learnwise-goals");
      if (stored) {
        startTransition(() => setGoals(JSON.parse(stored) as LearningGoal[]));
      }
    } catch {
      window.localStorage.removeItem("learnwise-goals");
    } finally {
      startTransition(() => setIsStateLoading(false));
    }
  }, []);
  useEffect(() => {
    if (!isStateLoading) {
      window.localStorage.setItem("learnwise-goals", JSON.stringify(goals));
    }
  }, [goals, isStateLoading]);
  useEffect(() => {
    window.localStorage.setItem("learnwise-resources", JSON.stringify(resources));
  }, [resources]);
  const saveGoal = (input: Omit<LearningGoal, "id">) => {
    setGoals((current) => [...current, { ...input, id: crypto.randomUUID() }]);
  };
  const updateGoal = (updated: LearningGoal) => {
    setGoals((current) =>
      current.map((goal) => (goal.id === updated.id ? updated : goal)),
    );
  };
  const addResource = (
    input: Omit<LearningResource, "id"> | string,
    topicId = "general",
  ) => {
    const resource: LearningResource =
      typeof input === "string"
        ? {
            id: crypto.randomUUID(),
            topicId,
            type: "youtube",
            title: input.trim(),
            url: input.trim(),
          }
        : { ...input, id: crypto.randomUUID() };
    if (!resource.title.trim()) return resource;
    setResources((current) => [resource, ...current]);
    setRecommendation("Continue with your newly added resource");
    return resource;
  };
  const getResourcesForTopic = useCallback(
    (topicId: string) => resources.filter((resource) => resource.topicId === topicId),
    [resources],
  );
  const value = useMemo(
    () => ({
      mastery,
      setMastery,
      showTutor,
      setShowTutor,
      recommendation,
      addResource,
      resources,
      getResourcesForTopic,
      isResourcesLoading,
      goal: goals[0] ?? null,
      goals,
      isStateLoading,
      saveGoal,
      updateGoal,
    }),
    [mastery, showTutor, recommendation, resources, goals, isStateLoading, isResourcesLoading, getResourcesForTopic],
  );
  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
}
export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be inside AppStateProvider");
  return ctx;
}
