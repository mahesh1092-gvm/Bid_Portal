const colors = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  submitted: "bg-cyan-50 text-cyan-700 border-cyan-200",
  completed: "bg-sky-50 text-sky-700 border-sky-200",
  cancelled: "bg-stone-100 text-stone-600 border-stone-200",
  overdue: "bg-rose-50 text-rose-700 border-rose-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  withdrawn: "bg-stone-100 text-stone-600 border-stone-200",
};

export default function StatusBadge({ value }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${colors[value] || colors.cancelled}`}>
      {value?.replace("_", " ")}
    </span>
  );
}
