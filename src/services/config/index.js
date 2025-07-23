let config = null; // Store the loaded config

export const loadConfig = async () => {
  if (config) return config; // Return cached config if already loaded

  try {
    const response = await fetch('/config.json', {
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    config = await response.json(); // Store config
    return config;
  } catch (error) {
    console.error('Error loading config.json:', error);
    return {};
  }
};

// Ensure config is loaded before exporting
export const configPromise = loadConfig();