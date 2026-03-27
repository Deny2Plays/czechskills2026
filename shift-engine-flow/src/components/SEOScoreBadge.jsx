export default function SEOScoreBadge({ score, size = "md" }) {
  const getColor = () => {
    if (score >= 80) return "text-green-500 border-green-500/30";
    if (score >= 50) return "text-yellow-500 border-yellow-500/30";
    return "text-destructive border-destructive/30";
  };

  const sizeClass = size === "lg" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";

  return (
    <div
      className={`${sizeClass} rounded-full border-2 ${getColor()} flex items-center justify-center font-mono font-bold`}
      title={`SEO Score: ${score}/100`}
    >
      {score}
    </div>
  );
}