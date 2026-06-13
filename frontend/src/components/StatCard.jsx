export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-500">{label}</div>
        {Icon && <Icon size={18} className="text-coral" />}
      </div>
      <div className="mt-3 text-2xl font-bold text-ink">{value}</div>
    </div>
  );
}
