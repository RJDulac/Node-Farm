const fs = require("fs");
const http = require("http");
const { promisify } = require("util");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
/////////////
//files

//blocking, synchronous way
// const textIn = fs.readFile("./txt/input.txt", "utf-8");

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);

// console.log("file Written");

//Non-blocking, asynchronous way
// const readFileAsync = promisify(fs.readFile);
// const writeFileAsync = promisify(fs.writeFile);
// const readAndWrite = async () => {
//   try {
//     const read = await readFileAsync("./txt/start.txt", "utf-8");
//     const read2 = await readFileAsync(`./txt/${read}.txt`, "utf-8");
//     const read3 = await readFileAsync("./txt/append.txt", "utf-8");
//     console.log("Your file has been written");
//     await writeFileAsync("./txt/final.txt", `${read2}\n${read3}`, "utf-8");
//   } catch (error) {
//     console.log("caught error: ", error);
//   }
// };
// readAndWrite();

////////////////////////
//server

//use synchronous outside of create server. it only happens once and when the code starts

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //Product page
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json"
    });
    res.end(data);
  }
  //Not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello-world"
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
