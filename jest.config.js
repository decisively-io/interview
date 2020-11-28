module.exports = {
  "rootDir": "src",
  moduleDirectories: [
    'src/test-utils',
    'node_modules'
  ],
  "transformIgnorePatterns": [
    "^.+\\.module\\.(css|sass|scss)$",
    "node_modules/(?!(@material-ui|@babel)/)" // The modules that need to be transpiled. You might not need this.
    // "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$", // This line is no longer needed.
  ],
  "testMatch": [
    "**/__tests__/**/*.{js,jsx,ts,tsx}",
    "**/?(*.)(spec|test).{js,jsx,ts,tsx}"
  ]
}