"use client";
import { createContext, startTransition, useContext, useEffect, useMemo, useState } from "react";

export type LearningGoal = {
  id: string;
  title: string;
  level?: "beginner" | "intermediate" | "advanced";
  objective?: string;
};

type Ctx = {
  mastery: number;
  setMastery: (n: number) => void;
  showTutor: boolean;
  setShowTutor: (v: boolean) => void;
  recommendation: string;
  addResource: (url: string) => void;
  resources: string[];
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
  const [resources, setResources] = useState([
    "StatQuest — Linear Regression",
    "Andrew Ng — Regression",
  ]);
  const [goals, setGoals] = useState<LearningGoal[]>([]);
  const [isStateLoading, setIsStateLoading] = useState(true);
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
  const saveGoal = (input: Omit<LearningGoal, "id">) => {
    setGoals((current) => [...current, { ...input, id: crypto.randomUUID() }]);
  };
  const updateGoal = (updated: LearningGoal) => {
    setGoals((current) =>
      current.map((goal) => (goal.id === updated.id ? updated : goal)),
    );
  };
  const addResource = (url: string) => {
    if (url.trim()) setResources((r) => [url.trim(), ...r]);
    setRecommendation("Continue with your newly added resource");
  };
  const value = useMemo(
    () => ({
      mastery,
      setMastery,
      showTutor,
      setShowTutor,
      recommendation,
      addResource,
      resources,
      goal: goals[0] ?? null,
      goals,
      isStateLoading,
      saveGoal,
      updateGoal,
    }),
    [mastery, showTutor, recommendation, resources, goals, isStateLoading],
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
