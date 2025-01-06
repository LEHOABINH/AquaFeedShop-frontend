var path = require("path");

var root = path.join(__dirname);

var config = {
  rootDir: root,
  // Targets ========================================================
  serveDir: path.join(root, ".serve"),
  distDir: path.join(root, "dist"),
  clientManifestFile: "manifest.webpack.json",
  clientStatsFile: "stats.webpack.json",

  // Source Directory ===============================================
  srcDir: path.join(root, "app"),
  srcServerDir: path.join(root, "server"),

  // HTML Layout ====================================================
  srcHtmlLayout: path.join(root, "app", "index.html"),

  // Site Config ====================================================
  siteTitle: "UniEXETask",
  siteDescription: "Platform to manage and support the Experiential Entrepreneurship subject of FPT University.",
  //siteCannonicalUrl: "https://uniexetask.netlify.app",
  siteCannonicalUrl: "https://localhost:3000",
  siteKeywords: "uniexetask exe101 exe102 fpt",

  // Api Config =====================================================
  apiBaseUrl: "https://localhost:7251/",
  //apiBaseUrl: "https://uniexetask-api-fvene7e9cjf2gdbn.southeastasia-01.azurewebsites.net/",

  // Api Config =====================================================
  webBaseUrl: "https://localhost:3000/",
  //webBaseUrl: "https://uniexetask.netlify.app/",

  // Google Client ID Config =====================================================
  //googleClientId: "84036477180-g8du4c9m1nvh7ducvvj0mkgm3dp9pfjp.apps.googleusercontent.com"

};

module.exports = config;
