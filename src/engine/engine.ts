/**
 * U.S. Citizenship Rules Engine — TypeScript port.
 *
 * Consumes the SAME citizenship_rules.json as the Python reference engine.
 * Drop this into a Node or browser project. The legal logic lives entirely in
 * the JSON; this file is just the interpreter + validator.
 */

// ── Types ────────────────────────────────────────────────────────────────────
export type AnswerValue = boolean | string;

export interface Answer {
  value: AnswerValue;
  label: string;
  next: string;
}

export interface QuestionNode {
  kind: "question";
  prompt: string;
  explanation?: string;
  citation: string;
  answer_type: "boolean" | "enum";
  answers: Answer[];
}

export interface OutcomeNode {
  kind: "outcome";
  outcome: "CITIZEN" | "NOT_CITIZEN";
  title: string;
  citation: string;
}

export type Node = QuestionNode | OutcomeNode;

export interface Rules {
  meta: Record<string, unknown>;
  start: string;
  nodes: Record<string, Node>;
}

export interface TraceStep {
  node: string;
  prompt?: string;
  answer?: string;
  value?: AnswerValue;
  outcome?: string;
  title?: string;
}

// ── Core engine ──────────────────────────────────────────────────────────────
/**
 * Walk the rules graph. `getAnswer` returns the chosen answer's `value` for a
 * given node. Returns the terminal outcome node (and fills `trace` if provided).
 */
export function evaluate(
  rules: Rules,
  getAnswer: (nodeId: string, node: QuestionNode) => AnswerValue,
  trace?: TraceStep[]
): { id: string; node: OutcomeNode } {
  let nodeId = rules.start;
  for (let guard = 0; guard < 1000; guard++) {
    const node = rules.nodes[nodeId];
    if (node.kind === "outcome") {
      trace?.push({ node: nodeId, outcome: node.outcome, title: node.title });
      return { id: nodeId, node };
    }
    const value = getAnswer(nodeId, node);
    const match = node.answers.find((a) => a.value === value);
    if (!match) {
      const valid = node.answers.map((a) => a.value);
      throw new Error(
        `Invalid answer ${JSON.stringify(value)} for ${nodeId}. Valid: ${JSON.stringify(valid)}`
      );
    }
    trace?.push({ node: nodeId, prompt: node.prompt, answer: match.label, value });
    nodeId = match.next;
  }
  throw new Error("Cycle detected — exceeded 1000 steps");
}

// ── Validator: prove the graph is a total function ───────────────────────────
export function validate(rules: Rules): {
  errors: string[];
  stats: { questions: number; outcomes: number; distinctPaths: number; leafKinds: string[] };
} {
  const nodes = rules.nodes;
  const errors: string[] = [];

  // 1. every `next` targets a real node
  for (const [id, node] of Object.entries(nodes)) {
    if (node.kind === "question") {
      if (!node.answers?.length) errors.push(`${id}: question has no answers`);
      for (const a of node.answers ?? []) {
        if (!(a.next in nodes)) errors.push(`${id}: routes to missing node '${a.next}'`);
      }
    }
  }

  // 2. reachability
  const reachable = new Set<string>();
  const stack = [rules.start];
  while (stack.length) {
    const id = stack.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    const node = nodes[id];
    if (node?.kind === "question") node.answers.forEach((a) => stack.push(a.next));
  }
  for (const id of Object.keys(nodes)) {
    if (!reachable.has(id)) errors.push(`${id}: unreachable from start`);
  }

  // 3. acyclic (DFS coloring)
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color: Record<string, number> = {};
  Object.keys(nodes).forEach((id) => (color[id] = WHITE));
  const dfs = (id: string, path: string[]) => {
    const node = nodes[id];
    if (node.kind === "outcome") { color[id] = BLACK; return; }
    color[id] = GRAY;
    for (const a of node.answers) {
      if (color[a.next] === GRAY) errors.push(`CYCLE: ${[...path, id, a.next].join(" -> ")}`);
      else if (color[a.next] === WHITE) dfs(a.next, [...path, id]);
    }
    color[id] = BLACK;
  };
  dfs(rules.start, []);

  // 4. outcomes are only CITIZEN / NOT_CITIZEN
  for (const [id, node] of Object.entries(nodes)) {
    if (node.kind === "outcome" && node.outcome !== "CITIZEN" && node.outcome !== "NOT_CITIZEN") {
      errors.push(`${id}: invalid outcome '${(node as OutcomeNode).outcome}'`);
    }
  }

  // 5. enumerate every path; confirm all terminate in a valid leaf
  let distinctPaths = 0;
  const leafKinds = new Set<string>();
  const walk = (id: string) => {
    const node = nodes[id];
    if (node.kind === "outcome") { leafKinds.add(node.outcome); distinctPaths++; return; }
    node.answers.forEach((a) => walk(a.next));
  };
  if (errors.every((e) => !e.startsWith("CYCLE"))) walk(rules.start);

  const questions = Object.values(nodes).filter((n) => n.kind === "question").length;
  const outcomes = Object.values(nodes).filter((n) => n.kind === "outcome").length;
  return { errors, stats: { questions, outcomes, distinctPaths, leafKinds: [...leafKinds].sort() } };
}

// ── Example: evaluate a recorded answer map ──────────────────────────────────
export function runWithAnswers(
  rules: Rules,
  answers: Record<string, AnswerValue>
): { outcome: string; title: string; citation: string; trace: TraceStep[] } {
  const trace: TraceStep[] = [];
  const { node } = evaluate(
    rules,
    (nodeId) => {
      if (!(nodeId in answers)) throw new Error(`Missing answer for node ${nodeId}`);
      return answers[nodeId];
    },
    trace
  );
  return { outcome: node.outcome, title: node.title, citation: node.citation, trace };
}

/*
Usage (Node):

  import rules from "./citizenship_rules.json" assert { type: "json" };
  import { validate, runWithAnswers } from "./engine";

  const { errors, stats } = validate(rules as any);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(stats); // { questions, outcomes, distinctPaths, leafKinds }

  const result = runWithAnswers(rules as any, {
    Q0: "us_states_dc",
    Q1: true,
  });
  console.log(result.outcome); // "CITIZEN"
*/
