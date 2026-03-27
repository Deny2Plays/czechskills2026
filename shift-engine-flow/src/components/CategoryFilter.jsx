import { motion } from "framer-motion";

export default function CategoryFilter({ categories, selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all ${
          !selectedId
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-primary/10"
        }`}
      >
        Vše
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all ${
            selectedId === cat.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-primary/10"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}