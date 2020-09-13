const puppeteer = require('puppeteer');
const express   = require('express'),
      bodyParser= require('body-parser');

// var product_name_all = "hp laptop";
var product_name_all;
//Amazon
async function amazon () {
  var result={};
  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox']
 })
  const page = await browser.newPage();
  var product_name = product_name_all;
  const link = "https://www.amazon.in/s?k="+product_name+"&ref=nb_sb_noss_2";
  result.links = link;
  await page.goto(link);
  // await page.waitFor(1000);
  // await page.waitForNavigation();
var example = await page.evaluate(() => {
  let url = document.querySelector('a.a-link-normal.a-text-normal').href;
  return url
});

await page.goto(example);
// await page.waitFor(1000);
// await page.waitForNavigation();
await page.waitForSelector('body');
var ans = await page.evaluate(() => {
var results = [];
var product_name = document.body.querySelector('#productTitle').innerText.trim();
var price = document.querySelector('#priceblock_ourprice').innerText.trim();
let ratingElement = document.body.querySelector('.a-icon.a-icon-star').getAttribute('class');
let integer = ratingElement.replace(/[^0-9]/g,'').trim();
let parsedRating = parseInt(integer)/10;
 results.push({
  title:product_name,
  price:price,
  rating:parsedRating
 });
 return results;
});

result.product_name  = ans[0].title;
result.price = ans[0].price;
result.rating = ans[0].rating;
result.link =  example;

// console.log("On Amazon :")
// console.log("Product Name : "+ans[0].title);
// console.log("Price is : "+ans[0].price);
// console.log("Rating is : "+ans[0].rating);
// console.log("Link is "+example);
browser.close();
return result;
}



//Flipkart

async function Flipkart () {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox']
 })
 var result = {};
  const page = await browser.newPage();
  product_name  = product_name_all.replace(' ','%20');
  const link = "https://www.flipkart.com/search?q="+product_name+"&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off";
  result.links = link;
  await page.goto(link);
  // await page.waitFor(1000);
  // await page.waitForNavigation();
var example = await page.evaluate(() => {
  // var url = document.querySelector("a._2cLu-l").href;
  // var url = document.querySelector("a._3wU53n").href;
 var url = document.querySelector("#container > div > div.t-0M7P._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div:nth-child(2) > div:nth-child(2) > div > div > div > a").href;
  // var url = document.querySelector("div._1UoZIX").href;

  return url;
});

await page.goto(example);
// await page.waitFor(3000);
// await page.waitFor(1000);
// await page.waitForNavigation();
await page.waitForSelector('body');
var ans = await page.evaluate(() => {
var results = [];
var product_name = document.body.querySelector("span._35KyD6").innerText.trim();
var price = document.querySelector('div._1vC4OE._3qQ9m1').innerText.trim();
// let ratingElement = document.body.querySelector('.a-icon.a-icon-star').getAttribute('class');
// let integer = ratingElement.replace(/[^0-9]/g,'').trim();
// let parsedRating = parseInt(integer)/10;
 results.push({
  title:product_name,
  price:price,
  // rating:parsedRating
 });
 return results;
});
result.product_name  = ans[0].title;
result.price = ans[0].price;
// result.rating = ans[0].rating;
result.link =  example;
// result.links = link;
// console.log("On Flipkart :")
// console.log("Product Name : "+ans[0].title);
// console.log("Price is : "+ans[0].price);
// console.log("Link is "+example);
// console.log("Rating is : "+ans[0].rating);
 browser.close();
 return result;
}





//Snapdeal
async function snapdeal () {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox']
 })
 var result = {};
  const page = await browser.newPage();
  product_name  = product_name_all.replace(' ','%20');
  const link = "https://www.snapdeal.com/search?keyword="+product_name+"&santizedKeyword=&catId=&categoryId=0&suggested=false&vertical=&noOfResults=20&searchState=&clickSrc=go_header&lastKeyword=&prodCatId=&changeBackToAll=false&foundInAll=false&categoryIdSearched=&cityPageUrl=&categoryUrl=&url=&utmContent=&dealDetail=&sort=rlvncy";
  result.links = link;
  await page.goto(link);
  // await page.waitFor(1000);
  // await page.waitFor(10000);
  // await page.waitForNavigation();
var example = await page.evaluate(() => {

 var url = document.querySelector("a.dp-widget-link.noUdLine.hashAdded").href;
  return url;
});

await page.goto(example);
// await page.waitFor(1000);
// await page.waitFor(10000)
// await page.waitForNavigation();
await page.waitForSelector('body');
var ans = await page.evaluate(() => {
var results = [];
var product_name = document.body.querySelector("h1.pdp-e-i-head").innerText.trim();
var price = document.querySelector('span.payBlkBig').innerText.trim();
 results.push({
  title:product_name,
  price:price,

 });
 return results;
});
result.product_name  = ans[0].title;
result.price = ans[0].price;
// result.link = example;
result.link =  example;
// result.links = link;
 browser.close();
 return result;
}





var router = express.Router();
router.post('/',(req,res)=>{
  var query=req.body.query;
  console.log("Hello");
  product_name_all=query;
  if(product_name_all.length==0){
    res.send("Field can't be empty");
  }
  else{

const Amazon_res = new Promise((resolve, reject) => {
  //setTimeout(resolve, 100, 'foo');
  console.log("Amazon Call");
  var x=amazon();
  if(x!=undefined)   
  resolve(x);
  reject("can't fetch from amazon");
});
const Flipkart_res = new Promise((resolve, reject) => {
  //setTimeout(resolve, 100, 'foo');
  console.log("Flipkart Call");
  var x=Flipkart();
  if(x!=undefined)   
  resolve(x);
  //resolve(Flipkart());
  reject("can't fetch from flipkart");
});

const Snapdeal_res = new Promise((resolve, reject) => {
  //setTimeout(resolve, 100, 'foo');
  console.log("Snapdeal Call");
  var x=snapdeal();
  if(x!=undefined)   
  resolve(x);
  reject("can't fetch from snapdeal");
});
Promise.all([Amazon_res,Flipkart_res,Snapdeal_res]).then((values) => {
  res.render('search.ejs',{values:values});
}).catch((err)=>{
  res.render('error.ejs');
}
);

  }
});
module.exports=router;
