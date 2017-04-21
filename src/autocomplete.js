const Fuse = require("fuse.js");
const { ipcRenderer } = require("electron");
var data = require("../doc-builder/react-native/doc.json");
var fuse = new Fuse(data, { keys: ["title", "content"] });

var searchInput = document.querySelector("#search");
var results = document.querySelector("#results");
var preview = document.querySelector("#preview");

preview.addEventListener("dom-ready", function() {
  preview.insertCSS(
    `
  .nav-main {
    display: none !important;}
  .nav-docs {
    display: none !important;}
  .container {
    padding-top: 0 !important;
    min-width: 0 !important;}
  .inner-content {
    width: auto !important;}
  .web-player .prism {
    display: block !important;}
  .web-player iframe {
    display: none !important; }`
  );
});

window.handlePreview = function(href) {
  preview.loadURL(href);
};

searchInput.addEventListener("keyup", e => {
  if (e.which === 13) {
    results.querySelector("a[data-href]") &&
      handlePreview(results.querySelector("a[data-href]").dataset["href"]);
    return;
  }
  results.innerHTML = `<ul>${fuse
    .search(e.target.value)
    .map(item => `<li>
          <a data-href="${item.href}"onclick="handlePreview('${item.href}')" >${item.title}</a>
        </li>`)
    .join("")}</ul>`;
});

searchInput.focus();

ipcRenderer.on("focus", (event, selector) => {
  searchInput.focus();
});
