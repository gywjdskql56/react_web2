global.XMLHttpRequest = require("xhr2");

const url = "http://13.209.7.71:5000";
// const url = "http://172.16.120.19:5000/";
export default function httpGet(theURL) {
  const xmlHttp = new XMLHttpRequest();
  console.log(url.concat(theURL));
  xmlHttp.open("GET", url.concat(theURL), false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
