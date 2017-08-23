const express = require("express");
const hbs = require('hbs');
const fs = require('fs');
var Client = require('node-rest-client').Client;
var port = process.env.PORT || 3000;
var app = express();
var client = new Client();
var products;

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper("year", () => {
    return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + ' \n');
    next();
});
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

var args = {
    headers: { "Content-Type": "application/json" }
};
client.get("http://m.lowes.com/CatalogServices/product/nvalue/v1_0?nValue=4294857975&maxResults=6&showURL=1&rollUpVariants=1&showUrl=true&storeNumber=0595&priceFlag=rangeBalance&showMarketingBullets=1", args, function (data, response) {
    // parsed response body as js object
    console.log(data);
    products = data;
    // raw response
    // console.log(response);
});
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
//	res.send('<h1>Hello Express</h1>');
	res.render('home.hbs', {
        pageTitle: 'Home Page'
//        year: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
//	res.send("About Page");
    res.render('about.hbs', {
        pageTitle: 'About Page'
//        year: new Date().getFullYear()
    });
});

app.get("/projects", (req, res) => {
    res.render("projects.hbs", {
        pageTitle: "Projects"
    });
});

app.get('/products', (req, res) => {
  console.log(products);
  res.render('products.hbs', {
    products: products
  });
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to handle request'
	});
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
