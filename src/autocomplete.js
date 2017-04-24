const Fuse = require("fuse.js");
const $ = require("./lib/jquery-3.2.1.min.js");
const { ipcRenderer } = require("electron");
var data = require("../doc-builder/react-native/doc.json");
var fuse = new Fuse(data, { keys: ["title", "content"] });

var searchInput = $("#search");
var results = $("#results");
var preview = $("#preview");

preview.on("dom-ready", function() {
  preview[0].insertCSS(
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
  preview[0].loadURL(href);
};

searchInput.on("keydown", e => {
  if (e.keyCode == 9) {
    e.preventDefault();
    moveItemCurserNext();
    return;
  }
});

searchInput.on("keyup", e => {
  if (e.keyCode == 9) return;
  if (e.which === 13) {
    e.preventDefault();
    let selected = results.find("li.focused").first();
    selected = selected.length ? selected : results.find("li").first();
    selected && handlePreview(selected.find("a[data-href]").data("href"));
    return;
  }
  results.html(
    `<ul>${fuse
      .search(e.target.value)
      .map((item, i) => `<li ${i === 0 ? 'class="focused"' : ""}>
          <a
            data-href="${item.href}"
            onclick="handlePreview('${item.href}')"
          >${item.title}</a>
        </li>`)
      .join("")}</ul>`
  );
});

searchInput.focus();

ipcRenderer.on("focus", (event, selector) => {
  searchInput.focus();
  searchInput[0].setSelectionRange(0, searchInput.val().length);
});

function moveItemCurserNext() {
  var selected = results.find("li.focused").first();
  var index = selected.length ? selected.index() : -1;
  results.find("li").removeClass("focused");
  results.find("li").eq(index + 1).addClass("focused");
}

function resetItemCurser() {}

function resetItemCurserPrev() {}
