'use client';

import { useEffect } from 'react';

type CusdisProps = {
  appId: string;
  pageId: string;
  pageTitle: string;
  pageUrl: string;
  theme?: 'light' | 'dark';
};

const Cusdis = ({
  appId,
  pageId,
  pageTitle,
  pageUrl,
  theme = 'light',
}: CusdisProps) => {
  useEffect(() => {
    // Remove any existing Cusdis script
    const existingScript = document.getElementById('cusdis-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Remove any existing Cusdis container
    const existingContainer = document.getElementById('cusdis-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create Cusdis script
    const script = document.createElement('script');
    script.id = 'cusdis-script';
    script.src = 'https://cusdis.com/js/cusdis.es.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-host', 'https://cusdis.com');
    script.setAttribute('data-app-id', appId);

    // Create Cusdis container
    const container = document.createElement('div');
    container.id = 'cusdis-container';
    container.setAttribute('data-page-id', pageId);
    container.setAttribute('data-page-url', pageUrl);
    container.setAttribute('data-page-title', pageTitle);
    container.setAttribute('data-theme', theme);

    // Add elements to the DOM
    const cusdisDiv = document.getElementById('cusdis-thread');
    if (cusdisDiv) {
      cusdisDiv.appendChild(container);
      cusdisDiv.appendChild(script);
    }

    return () => {
      // Clean up the script and container when the component is unmounted
      if (existingScript) {
        existingScript.remove();
      }
      if (existingContainer) {
        existingContainer.remove();
      }
    };
  }, [appId, pageId, pageTitle, pageUrl, theme]);

  return <div id="cusdis-thread" className="mt-8" />;
};

export default Cusdis;