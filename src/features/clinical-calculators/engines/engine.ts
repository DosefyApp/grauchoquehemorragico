import { z } from "zod";
import { buildEngine } from "@/features/clinical-calculators/engines/helpers";

const schema = z.object({
  heartRate: z.coerce.number().int().min(20).max(250),
  systolicBloodPressure: z.coerce.number().int().min(30).max(250),
  pulsePressure: z.enum(["normal", "reduced"]),
  respiratoryRate: z.coerce.number().int().min(4).max(80),
  urineOutput: z.coerce.number().min(0).max(300),
  mentalStatus: z.enum(["normal", "ansioso", "confuso", "letargico"]),
  estimatedBloodLossMl: z.coerce.number().min(0).max(10000).optional(),
  estimatedVolumeLossPercent: z.coerce.number().min(0).max(100).optional(),
});

type Values = z.infer<typeof schema>;

type MatchResult = {
  className: "Classe I" | "Classe II" | "Classe III" | "Classe IV";
  matches: string[];
};

function rangeMatch(value: number | undefined, min: number, max?: number) {
  if (value === undefined) {
    return false;
  }

  return max === undefined ? value >= min : value >= min && value <= max;
}

function evaluateClassI(values: Values): MatchResult {
  const matches: string[] = [];
  if (values.heartRate < 100) matches.push("FC <100 bpm");
  if (values.systolicBloodPressure >= 110) matches.push("PAS preservada");
  if (values.pulsePressure === "normal") matches.push("Pressão de pulso normal");
  if (rangeMatch(values.respiratoryRate, 14, 20)) matches.push("FR 14–20 irpm");
  if (values.urineOutput > 30) matches.push("Diurese >30 mL/h");
  if (values.mentalStatus === "normal") matches.push("Estado mental normal");
  if (rangeMatch(values.estimatedBloodLossMl, 0, 749)) matches.push("Perda estimada <750 mL");
  if (rangeMatch(values.estimatedVolumeLossPercent, 0, 14.9)) matches.push("Perda volêmica <15%");
  return { className: "Classe I", matches };
}

function evaluateClassII(values: Values): MatchResult {
  const matches: string[] = [];
  if (rangeMatch(values.heartRate, 100, 120)) matches.push("FC 100–120 bpm");
  if (values.systolicBloodPressure >= 100) matches.push("PAS ainda preservada");
  if (values.pulsePressure === "reduced") matches.push("Pressão de pulso reduzida");
  if (rangeMatch(values.respiratoryRate, 20, 30)) matches.push("FR 20–30 irpm");
  if (rangeMatch(values.urineOutput, 20, 30)) matches.push("Diurese 20–30 mL/h");
  if (values.mentalStatus === "ansioso") matches.push("Ansiedade presente");
  if (rangeMatch(values.estimatedBloodLossMl, 750, 1500)) matches.push("Perda estimada 750–1500 mL");
  if (rangeMatch(values.estimatedVolumeLossPercent, 15, 30)) matches.push("Perda volêmica 15–30%");
  return { className: "Classe II", matches };
}

function evaluateClassIII(values: Values): MatchResult {
  const matches: string[] = [];
  if (rangeMatch(values.heartRate, 120, 140)) matches.push("FC 120–140 bpm");
  if (values.systolicBloodPressure < 110) matches.push("PAS reduzida");
  if (values.pulsePressure === "reduced") matches.push("Pressão de pulso reduzida");
  if (rangeMatch(values.respiratoryRate, 30, 40)) matches.push("FR 30–40 irpm");
  if (rangeMatch(values.urineOutput, 5, 15)) matches.push("Diurese 5–15 mL/h");
  if (values.mentalStatus === "confuso") matches.push("Confusão/agitação importante");
  if (rangeMatch(values.estimatedBloodLossMl, 1500, 2000)) matches.push("Perda estimada 1500–2000 mL");
  if (rangeMatch(values.estimatedVolumeLossPercent, 30, 40)) matches.push("Perda volêmica 30–40%");
  return { className: "Classe III", matches };
}

function evaluateClassIV(values: Values): MatchResult {
  const matches: string[] = [];
  if (values.heartRate > 140) matches.push("FC >140 bpm");
  if (values.systolicBloodPressure <= 80) matches.push("PAS criticamente reduzida");
  if (values.pulsePressure === "reduced") matches.push("Pressão de pulso muito reduzida");
  if (values.respiratoryRate >= 35) matches.push("FR >=35 irpm");
  if (values.urineOutput <= 5) matches.push("Diurese mínima/negligenciável");
  if (values.mentalStatus === "letargico") matches.push("Letargia ou rebaixamento importante");
  if ((values.estimatedBloodLossMl ?? 0) > 2000) matches.push("Perda estimada >2000 mL");
  if ((values.estimatedVolumeLossPercent ?? 0) > 40) matches.push("Perda volêmica >40%");
  return { className: "Classe IV", matches };
}

const classMessages: Record<MatchResult["className"], { summary: string; management: string[]; tone: "info" | "warning" | "danger" }> = {
  "Classe I": {
    summary: "Perda sanguínea menor. Paciente em compensação. Reposição moderada e monitorização contínua.",
    management: [
      "Reposição cristaloide moderada.",
      "Monitorar resposta clínica e controle da fonte hemorrágica.",
    ],
    tone: "info",
  },
  "Classe II": {
    summary:
      "Perda sanguínea moderada. Sinais de hipovolemia discreta a moderada. Reposição agressiva com cristaloide e preparação para transfusão se a resposta for transitória.",
    management: [
      "Reposição cristaloide inicial 1–2 L conforme contexto.",
      "Tipagem/prova cruzada e observação da resposta ao bolus.",
    ],
    tone: "warning",
  },
  "Classe III": {
    summary:
      "Perda sanguínea significativa. Choque hemorrágico importante com necessidade de reposição de hemoderivados e controle urgente do sangramento.",
    management: [
      "Iniciar reposição com concentrado de hemácias e suporte hemodinâmico.",
      "Monitorar lactato, déficit de base e necessidade de abordagem cirúrgica.",
    ],
    tone: "danger",
  },
  "Classe IV": {
    summary:
      "Perda massiva / choque descompensado. Trata-se de emergência com risco iminente de morte e necessidade de ressuscitação maciça e controle imediato da hemorragia.",
    management: [
      "Ativar protocolo de transfusão maciça quando indicado.",
      "Priorizar controle da fonte hemorrágica e correção da tríade letal.",
    ],
    tone: "danger",
  },
};

export const grauChoqueHemorragicoEngine = buildEngine(schema, (values) => {
  const results = [evaluateClassI(values), evaluateClassII(values), evaluateClassIII(values), evaluateClassIV(values)].sort(
    (a, b) => b.matches.length - a.matches.length,
  );

  const top = results[0]!;
  const second = results[1]!;
  const confidence =
    top.matches.length >= 5 ? "Alta" : top.matches.length >= 3 ? "Moderada" : "Baixa";
  const mixedPattern = top.matches.length - second.matches.length <= 1;
  const config = classMessages[top.className];

  return {
    headline: {
      label: "Classe mais compatível",
      value: top.className,
      status: mixedPattern ? `Confiança ${confidence} com parâmetros mistos` : `Confiança ${confidence}`,
      tone: mixedPattern ? "warning" : config.tone,
      description: "Classificação compatível com o padrão ATLS informado, sem substituir avaliação dinâmica da resposta à reposição.",
    },
    interpretation: {
      title: "Interpretação clínica",
      tone: mixedPattern ? "warning" : config.tone,
      description: config.summary,
      bullets: [
        mixedPattern
          ? "Parâmetros mistos reduzem a precisão da classificação; use resposta a fluidos, lactato, déficit de base e controle da fonte hemorrágica para refinar a gravidade."
          : "Resposta a fluidos continua sendo um dos melhores indicadores da gravidade real.",
      ],
    },
    calculation: {
      title: "Como foi classificado",
      tone: "default",
      bullets: [
        ...results.map((result) => `${result.className}: ${result.matches.length} variável(is) compatível(is)`),
      ],
    },
    extraPanels: [
      {
        title: "Sinais que sustentam a classe escolhida",
        tone: config.tone,
        bullets: top.matches,
      },
      {
        title: "Manejo sugerido",
        tone: config.tone,
        bullets: config.management,
      },
      {
        title: "Comparação entre classes",
        tone: "info",
        rows: results.map((result) => ({
          label: result.className,
          value: `${result.matches.length} compatibilidades`,
        })),
      },
    ],
  };
});

export const calculatorEngine = grauChoqueHemorragicoEngine;
