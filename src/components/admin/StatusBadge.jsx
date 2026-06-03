import React from "react";

export default function StatusBadge({ status }) {
  const normalized = status ? status.toLowerCase() : "pendente";

  let styles = {
    bg: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Pendente",
    dot: "bg-amber-500"
  };

  if (normalized === "resolvido") {
    styles = {
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Resolvido",
      dot: "bg-emerald-500"
    };
  } else if (normalized === "em_progresso" || normalized === "em progresso" || normalized === "em processo" || normalized === "em_processo" || normalized === "em resolução" || normalized === "em_resolucao") {
    styles = {
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Em Progresso",
      dot: "bg-blue-500"
    };
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {styles.label}
    </span>
  );
}
