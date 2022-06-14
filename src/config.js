global.XMLHttpRequest = require("xhr2");

const url = "http://13.125.19.13:5000";
export default function httpGet(theURL) {
  const xmlHttp = new XMLHttpRequest();
  console.log(url.concat(theURL));
  xmlHttp.open("GET", url.concat(theURL), false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
