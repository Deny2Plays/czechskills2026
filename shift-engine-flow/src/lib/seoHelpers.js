// SEO Score Calculator - returns issue keys instead of messages
export function calculateSEOScore(post) {
  let score = 0;
  const issues = [];

  // Title checks (max 20 points)
  if (post.title) {
    score += 5;
    if (post.title.length >= 30 && post.title.length <= 60) score += 10;
    else issues.push("titleLength30To60");
    if (post.title.length > 0) score += 5;
  } else {
    issues.push("missingTitle");
  }

  // Meta title (max 10 points)
  if (post.meta_title) {
    score += 5;
    if (post.meta_title.length >= 30 && post.meta_title.length <= 60) score += 5;
    else issues.push("metaTitleLength30To60");
  } else {
    issues.push("missingMetaTitle");
  }

  // Meta description (max 15 points)
  if (post.meta_description) {
    score += 5;
    if (post.meta_description.length >= 120 && post.meta_description.length <= 160) score += 10;
    else issues.push("metaDescLength120To160");
  } else {
    issues.push("missingMetaDescription");
  }

  // Content (max 20 points)
  if (post.content) {
    const contentLength = post.content.replace(/<[^>]*>/g, '').length;
    if (contentLength >= 300) score += 10;
    else issues.push("contentMin300");
    if (contentLength >= 800) score += 10;
    else issues.push("contentMin800");
  } else {
    issues.push("missingContent");
  }

  // Slug (max 5 points)
  if (post.slug) {
    score += 5;
  } else {
    issues.push("missingSlug");
  }

  // Featured image (max 10 points)
  if (post.featured_image) {
    score += 10;
  } else {
    issues.push("missingFeaturedImage");
  }

  // Category (max 5 points)
  if (post.category_id) {
    score += 5;
  } else {
    issues.push("missingCategory");
  }

  // Tags (max 5 points)
  if (post.tag_ids && post.tag_ids.length > 0) {
    score += 5;
  } else {
    issues.push("addAtLeastOneTag");
  }

  // Excerpt (max 5 points)
  if (post.excerpt) {
    score += 5;
  } else {
    issues.push("missingExcerpt");
  }

  // GEO (max 5 points)
  if (post.geo_city) {
    score += 5;
  } else {
    issues.push("addGeoTargeting");
  }

  return { score: Math.min(score, 100), issues };
}

// Generate slug from string
export function generateSlug(text) {
  const map = {
    'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i',
    'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u',
    'ů': 'u', 'ý': 'y', 'ž': 'z',
  };
  return text
    .toLowerCase()
    .split('')
    .map(c => map[c] || c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generate structured data for article
export function generateArticleSchema(post, tenant, category) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.featured_image,
    "datePublished": post.published_at || post.created_date,
    "dateModified": post.updated_date,
    "author": {
      "@type": "Organization",
      "name": tenant?.brand_name || "SHIFT-CMS"
    },
    "publisher": {
      "@type": "Organization",
      "name": tenant?.brand_name || "SHIFT-CMS"
    },
    "mainEntityOfPage": {
      "@type": "WebPage"
    }
  };
}

// Generate FAQ structured data
export function generateFAQSchema(faqItems) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// Generate LocalBusiness structured data
export function generateLocalBusinessSchema(tenant) {
  if (!tenant) return null;
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": tenant.brand_name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": tenant.city,
      "streetAddress": tenant.address
    },
    "geo": tenant.geo_lat && tenant.geo_lng ? {
      "@type": "GeoCoordinates",
      "latitude": tenant.geo_lat,
      "longitude": tenant.geo_lng
    } : undefined,
    "telephone": tenant.phone,
    "email": tenant.email
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}