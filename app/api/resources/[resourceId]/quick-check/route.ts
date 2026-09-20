import { auth } from "@clerk/nextjs/server";
import { generateQuickCheck } from "@/lib/ai/learner/assessment";
import { recordLearningInteraction } from "@/lib/ai/learner/interactions";
import { ensureCurrentUser } from "@/lib/data/users";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ resourceId: string }> }) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const user = await ensureCurrentUser();
    const resourceId = (await params).resourceId;
    const body = await request.json().catch(() => ({})) as { conceptId?: unknown };
    const { data: resource, error: resourceError } = await supabaseAdmin.from("resources").select("id,topic_id,status").eq("id", resourceId).eq("user_id", user.id).single();
    if (resourceError || !resource) return Response.json({ error: "Resource not found" }, { status: 404 });
    if (resource.status !== "ready") return Response.json({ error: "This resource is not ready" }, { status: 409 });
    if (!resource.topic_id) return Response.json({ error: "Quick Checks require a resource linked to a learning topic" }, { status: 422 });
    const requestedConceptId = typeof body.conceptId === "string" ? body.conceptId : null;
    const { data: links, error: linksError } = await supabaseAdmin.from("resource_concepts").select("concept_id,relevance_score").eq("resource_id", resourceId);
    if (linksError || !links?.length) return Response.json({ error: "Analyze this resource's concepts before creating a Quick Check" }, { status: 422 });
    const link = requestedConceptId ? links.find((item) => item.concept_id === requestedConceptId) : [...links].sort((a, b) => Number(b.relevance_score ?? 0) - Number(a.relevance_score ?? 0))[0];
    if (!link) return Response.json({ error: "Concept not found for this resource" }, { status: 404 });
    const [{ data: concept, error: conceptError }, { data: segments, error: segmentsError }] = await Promise.all([
      supabaseAdmin.from("concepts").select("id,name,description").eq("id", link.concept_id).single(),
      supabaseAdmin.from("video_segments").select("id,start_seconds,end_seconds,text").eq("resource_id", resourceId).order("start_seconds").limit(40),
    ]);
    if (conceptError || !concept) return Response.json({ error: "Concept not found" }, { status: 404 });
    if (segmentsError || !segments?.length) return Response.json({ error: "This resource has no transcript context" }, { status: 422 });
    const quickCheck = await generateQuickCheck({ concept, segments: (segments ?? []).map((segment) => ({ id: segment.id as string, startSeconds: Number(segment.start_seconds), endSeconds: Number(segment.end_seconds), text: segment.text as string })), topic: resource.topic_id });
    const { data: assessment, error: assessmentError } = await supabaseAdmin.from("assessments").insert({ topic_id: resource.topic_id, concept_id: concept.id, type: "quick_check", question: quickCheck.question, options: quickCheck.options, correct_answer: quickCheck.correctAnswer, explanation: quickCheck.explanation }).select().single();
    if (assessmentError || !assessment) throw new Error(assessmentError?.message ?? "Could not save assessment");
    await recordLearningInteraction({ userId: user.id, topicId: resource.topic_id, conceptId: concept.id, resourceId, interactionType: "QUIZ", metadata: { assessment_id: assessment.id, event: "generated" } });
    return Response.json({ assessment, quickCheck, concept });
  } catch (error) {
    console.error("POST /api/resources/[resourceId]/quick-check failed", error);
    return Response.json({ error: error instanceof Error ? error.message : "Could not create Quick Check" }, { status: 400 });
  }
}