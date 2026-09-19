"use client";
import { useState } from "react";
import { GoalForm } from "@/components/goals/GoalForm";
import { useAppState } from "@/lib/state";
import Link from "next/link";

export default function Goals() {
  const { goals, saveGoal, updateGoal } = useAppState();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
      <div className="eyebrow text-neutral-400">Learning goal</div>
      <div className="mt-2 flex items-end justify-between gap-4">
        <div><h1 className="text-4xl font-semibold tracking-tight">Your learning goals</h1><p className="mt-2 text-neutral-500">Create and manage the goals shaping your learning paths.</p></div>
        <button onClick={() => setIsAdding(true)} className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white">Add New Goal</button>
      </div>
      {isAdding && <div className="surface mt-8 p-6"><GoalForm onSave={(goal) => { saveGoal(goal); setIsAdding(false); }} onCancel={() => setIsAdding(false)} /></div>}
      <div className="mt-8 space-y-4">
        {goals.map((goal) => editingId === goal.id ? (
          <div key={goal.id} className="surface p-6"><GoalForm initialGoal={goal} onSave={(updated) => { updateGoal({ ...updated, id: goal.id }); setEditingId(null); }} onCancel={() => setEditingId(null)} /></div>
        ) : (
          <div key={goal.id} className="surface flex items-center justify-between gap-4 p-6">
            <div><h2 className="text-xl font-semibold">{goal.title}</h2><p className="mt-1 text-sm capitalize text-neutral-500">{goal.level ?? "Level not set"}</p>{goal.objective && <p className="mt-2 text-sm text-neutral-500">{goal.objective}</p>}</div>
            <div className="flex items-center gap-3"><button onClick={() => setEditingId(goal.id)} className="text-sm font-semibold underline">Edit</button><Link href="/dashboard" className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white">Continue</Link></div>
          </div>
        ))}
        {!goals.length && !isAdding && <div className="surface p-8 text-center text-neutral-500">You have not created a learning goal yet.</div>}
      </div>
    </div>
  );
}
