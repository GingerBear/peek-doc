const Fuse = require("fuse.js");
var data = require('../doc-builder/react-native/doc.json');
var fuse = new Fuse(data, { keys: ["title", "content"] });

var searchInput = document.querySelector('#search');
var results = document.querySelector('#results');


searchInput.addEventListener('keyup', e => {
  results.innerHTML = `<ul>${fuse.search(e.target.value)
    .map(item => `<li><a href="${item.href}">${item.title}</a></li>`).join('')}</ul>`
});




