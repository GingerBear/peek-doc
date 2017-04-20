const Fuse = require("fuse.js");
var data = require('../doc-builder/react-native/doc.json');
var fuse = new Fuse(data, { keys: ["title", "content"] });

var searchInput = document.querySelector('#search');
var results = document.querySelector('#results');
var preview = document.querySelector('#preview');

window.handlePreview = function(href) {
  preview.innerHTML = `
    <webview id="previewWebView"
      autosize
      src="${href}"
      useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1" style="display:inline-flex; width:640px; height:480px">
    </webview>
  `;


    var previewWebView = document.querySelector('#previewWebView');
    previewWebView.addEventListener('dom-ready', function() {
      previewWebView.insertCSS(`.nav-docs {display: none !important}`);
    })

}

searchInput.addEventListener('keyup', e => {
  results.innerHTML = `<ul>${fuse.search(e.target.value)
    .map(item => `<li><a onclick="handlePreview('${item.href}')" >${item.title}</a></li>`).join('')}</ul>`
});

searchInput.focus();