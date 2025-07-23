const fs = require("fs");
const path = require("path");

// Helper function to convert a string to title case
function toTitleCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const componentName = process.argv[2];
if (!componentName) {
  console.error("Please provide a component name.");
  process.exit(1);
}

// Use an absolute path to src/components
const componentDir = path.join(__dirname, componentName);
if (fs.existsSync(componentDir)) {
  console.error(`Component ${componentName} already exists.`);
  process.exit(1);
}

fs.mkdirSync(componentDir, { recursive: true });

const componentJs = `import React, { useState } from 'react';
const ${toTitleCase(componentName)} = (props) => {
  return (
     <div></div>
  );
};
export default ${toTitleCase(componentName)};
`;
fs.writeFileSync(path.join(componentDir, `${componentName}.jsx`), componentJs);

