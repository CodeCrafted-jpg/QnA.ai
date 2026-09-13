import type { Concept, Resource } from "@/types/learning";
export const concepts: Concept[] = [
  { id: "python", name: "Python", mastery: 86, state: "strong" },
  { id: "stats", name: "Statistics", mastery: 64, state: "developing" },
  { id: "linear", name: "Linear Algebra", mastery: 46, state: "attention" },
  { id: "regression", name: "Linear Regression", mastery: 72, state: "strong" },
  {
    id: "classification",
    name: "Classification",
    mastery: 61,
    state: "developing",
  },
  { id: "gradient", name: "Gradient Descent", mastery: 42, state: "attention" },
  { id: "optimization", name: "Optimization", mastery: 29, state: "attention" },
];
export const resources: Resource[] = [
  {
    id: "linear-regression",
    title: "StatQuest — Linear Regression",
    duration: "48 min",
    topic: "Linear Regression",
    source: "YouTube",
  },
  {
    id: "andrew-ng-regression",
    title: "Andrew Ng — Regression",
    duration: "52 min",
    topic: "Linear Regression",
    source: "YouTube",
  },
];
export const pathModules = [
  { n: "01", t: "Python Foundations", s: "Completed", m: 92 },
  { n: "02", t: "Mathematics for ML", s: "In Progress", m: 64 },
  { n: "03", t: "ML Fundamentals", s: "Completed", m: 88 },
  { n: "04", t: "Supervised Learning", s: "In Progress", m: 68 },
  { n: "05", t: "Unsupervised Learning", s: "Locked", m: 0 },
  { n: "06", t: "Deep Learning", s: "Locked", m: 0 },
];
