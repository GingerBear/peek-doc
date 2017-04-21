const fetch = require("node-fetch");
const async = require("async");
const cheerio = require("cheerio");
const fs = require("fs");
const Fuse = require("fuse.js");

const data = [
  {
    api: "React Native",
    version: "0.43",
    title: "Getting Started",
    href: "https://facebook.github.io/react-native/docs/getting-started.html",
    content: "content from website page html"
  },
  {
    api: "React Native",
    version: "0.43",
    title: "Getting Started",
    href: "https://facebook.github.io/react-native/docs/getting-started.html",
    content: "content from website page html"
  }
];

function getItemsLinks() {
  return fetch(
    `https://facebook.github.io/react-native/docs/getting-started.html`
  )
    .then(res => res.text())
    .then(body => {
      const $ = cheerio.load(body);
      return $(`.nav-docs-section a[href]`)
        .map((i, link) => ({
          title: $(link).text(),
          href: "https://facebook.github.io/react-native/" +
            $(link).attr("href")
        }))
        .get();
    });
}

function fetchContent(link) {
  return fetch(link).then(res => res.text()).then(body => {
    const $ = cheerio.load(body);
    $("script, style").remove();
    return $(".inner-content").text();
  });
}

function main() {
  getItemsLinks().then(items => {
    async.forEachSeries(
      items,
      (item, cb) => {
        console.log(`fetching ${item.href}`);
        fetchContent(item.href)
          .then(content => {
            item.content = content;
            cb();
          })
          .catch(cb);
      },
      (err, cb) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync("./data.json", JSON.stringify(items), {
            encoding: "utf8"
          });
        }
      }
    );
  });
}

function testSearch() {
  var docsItems = JSON.parse(fs.readFileSync("./data.json").toString());
  var fuse = new Fuse(docsItems, { keys: ["title", "content"] });

  console.log("---\nlistview\n---");
  console.log(fuse.search("listview").map(item => item.title));
  console.log("---\nflaslist\n---");
  console.log(fuse.search("flaslist").map(item => item.title));
  console.log("---\nkeyboard\n---");
  console.log(fuse.search("keyboard").map(item => item.title));
  console.log("---\nlinking\n---");
  console.log(fuse.search("linking").map(item => item.title));
  console.log("---\nanimated\n---");
  console.log(fuse.search("animated").map(item => item.title));
}

// main();
testSearch();
