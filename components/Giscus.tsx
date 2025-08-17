'use client';

import { useEffect } from 'react';

type GiscusProps = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'number' | 'specific';
  term?: string;
  theme?: 'light' | 'dark' | 'light_high_contrast' | 'light_protanopia' | 'dark_high_contrast' | 'dark_protanopia' | 'dark_dimmed' | 'transparent_dark' | 'preferred_color_scheme';
};

const Giscus = ({
  repo,
  repoId,
  category,
  categoryId,
  mapping,
  term,
  theme = 'light',
}: GiscusProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', mapping);
    if (term) script.setAttribute('data-term', term);
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-strict', '1');

    const element = document.getElementById('giscus-container');
    if (element) {
      element.appendChild(script);
    }

    return () => {
      // Clean up the script when the component is unmounted
      if (element) {
        element.innerHTML = '';
      }
    };
  }, [repo, repoId, category, categoryId, mapping, term, theme]);

  return <div id="giscus-container" className="mt-8" />;
};

export default Giscus;