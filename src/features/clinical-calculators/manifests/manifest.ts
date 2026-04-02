import type { CalculatorManifest } from "@/features/clinical-calculators/types";

export const grauChoqueHemorragicoManifest: CalculatorManifest = {
  slug: "grau-choque-hemorragico",
  title: "Grau de Choque Hemorrágico",
  shortTitle: "Choque hemorrágico",
  description: "Classifique a compatibilidade com as classes ATLS de choque hemorrágico.",
  seoTitle: "Hemorrhagic Shock Classifier | Dosefy",
  seoDescription: "Classify hemorrhagic shock severity using ATLS-compatible clinical parameters.",
  heroEyebrow: "Trauma",
  heroDescription:
    "Classificador por compatibilidade de sinais clínicos inspirado na tabela ATLS clássica para choque hemorrágico.",
  heroHighlights: [
    "Retorna classe mais provável com grau de confiança.",
    "Mostra quantas variáveis apoiam cada classe.",
    "Destaca quando os parâmetros são mistos e a classificação fica imprecisa.",
  ],
  resultMetricLabel: "Classe mais compatível",
  actionLabel: "Classificar choque",
  note: "A classificação ATLS é simplificada e não substitui avaliação dinâmica, lactato, déficit de base, resposta à reposição e controle da fonte hemorrágica.",
  limitations: [
    "Idosos podem manter pressão arterial apesar de perda significativa.",
    "Beta-bloqueadores podem mascarar taquicardia compensatória.",
    "Gestantes e atletas podem apresentar padrões hemodinâmicos diferentes.",
    "Sepse, queimaduras e choques distributivos fogem do comportamento clássico ATLS.",
  ],
  references: [
    {
      label: "ATLS Student Course Manual overview",
      href: "https://www.facs.org/quality-programs/trauma/education/atls/",
    },
    {
      label: "Hemorrhagic Shock | StatPearls",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK470382/",
    },
    {
      label: "Review on hemorrhagic shock pathophysiology and management",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4967406/",
    },
  ],
  sections: [
    {
      id: "vitals",
      title: "Sinais vitais",
      description: "Parâmetros hemodinâmicos e respiratórios de triagem.",
    },
    {
      id: "perfusion",
      title: "Perfusão e estado mental",
      description: "Diurese e alteração neurológica ajudam a refinar a classe.",
    },
    {
      id: "bloodloss",
      title: "Estimativa de perda",
      description: "Opcional, mas útil quando já houver estimativa volumétrica.",
    },
  ],
  fields: [
    { name: "heartRate", label: "Frequência cardíaca", type: "number", sectionId: "vitals", placeholder: "Ex.: 112", inputMode: "numeric", suffix: "bpm" },
    { name: "systolicBloodPressure", label: "PAS", type: "number", sectionId: "vitals", placeholder: "Ex.: 118", inputMode: "numeric", suffix: "mmHg" },
    {
      name: "pulsePressure",
      label: "Pressão de pulso",
      type: "select",
      sectionId: "vitals",
      options: [
        { label: "Normal (>=40 mmHg)", value: "normal" },
        { label: "Reduzida (<40 mmHg)", value: "reduced" },
      ],
    },
    { name: "respiratoryRate", label: "Frequência respiratória", type: "number", sectionId: "vitals", placeholder: "Ex.: 24", inputMode: "numeric", suffix: "irpm" },
    { name: "urineOutput", label: "Diurese", type: "number", sectionId: "perfusion", placeholder: "Ex.: 25", inputMode: "decimal", suffix: "mL/h" },
    {
      name: "mentalStatus",
      label: "Estado mental",
      type: "select",
      sectionId: "perfusion",
      options: [
        { label: "Normal", value: "normal" },
        { label: "Ansioso", value: "ansioso" },
        { label: "Confuso", value: "confuso" },
        { label: "Letárgico / rebaixado", value: "letargico" },
      ],
    },
    {
      name: "estimatedBloodLossMl",
      label: "Perda sanguínea estimada",
      type: "number",
      sectionId: "bloodloss",
      placeholder: "Ex.: 1200",
      inputMode: "numeric",
      suffix: "mL",
      optional: true,
    },
    {
      name: "estimatedVolumeLossPercent",
      label: "% estimada de perda volêmica",
      type: "number",
      sectionId: "bloodloss",
      placeholder: "Ex.: 25",
      inputMode: "decimal",
      suffix: "%",
      optional: true,
    },
  ],
  initialValues: {
    heartRate: "",
    systolicBloodPressure: "",
    pulsePressure: "normal",
    respiratoryRate: "",
    urineOutput: "",
    mentalStatus: "normal",
    estimatedBloodLossMl: "",
    estimatedVolumeLossPercent: "",
  },
};

export const calculatorManifest = grauChoqueHemorragicoManifest;
