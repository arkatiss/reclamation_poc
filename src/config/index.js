export const Config = {
      // CLOUD_URL:'https://reclamation-b-998524737689.us-east4.run.app/', 
        CLOUD_URL:'https://devcsapim.cswg.com/rcm/1.0', 
  }

//   let config = null; // Store the loaded config

// export const loadConfig = async () => {
//   if (config) return config; // Return cached config if already loaded

//   try {
//     console.log("Fetching config.json...");
//     const response = await fetch('/config.json', {
//       headers: { 'Cache-Control': 'no-cache' },
//     });

//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     config = await response.json(); // Store config
//     console.log("Config Loaded:", config);
//     return config;
//   } catch (error) {
//     console.error('Error loading config.json:', error);
//     return {};
//   }
// };

// // Ensure config is loaded before exporting
// export const configPromise = loadConfig();
  
