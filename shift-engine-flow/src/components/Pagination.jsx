import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-12" aria-label="Stránkování">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Předchozí stránka"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-xs font-mono text-chrome">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded text-xs font-mono transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary text-muted-foreground"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="p-2 rounded hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Další stránka"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}