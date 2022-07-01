/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
global.XMLHttpRequest = require("xhr2");

function httpGet(theURL) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
//const data = httpGet("http://127.0.0.1:5000/kospi");
//console.log(data);
//console.log(data.date);
//console.log(data.price);

export default {
  sales: {
    labels: data.date,
    datasets: { label: "price", data: [1,2,3,4,6] },
  },
  tasks: {
    labels: data.date,
    datasets: { label: "return", data: [1,2,34,54,5] },
  },
};
