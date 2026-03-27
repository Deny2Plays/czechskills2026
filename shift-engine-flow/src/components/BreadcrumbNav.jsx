import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import StructuredData from "./StructuredData";
import { generateBreadcrumbSchema } from "../lib/seoHelpers";

export default function BreadcrumbNav({ items }) {
  const schemaItems = items.map((item, i) => ({
    name: item.label,
    url: window.location.origin + item.href,
  }));

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3 w-3 text-chrome" />}
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}