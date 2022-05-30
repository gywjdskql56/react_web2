/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

const XMLHttpRequest = require("xhr2");

function httpGet(theURL) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theURL, false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

export default function data() {
  const universe = httpGet("http://0.0.0.0:5001/universes/".concat(localStorage.getItem("port1")));
  console.log(localStorage.getItem("port1"));
  console.log(Object.keys(universe));
  console.log(typeof universe);
  console.log(universe.ticker);
  console.log(universe.ticker.lengths);

  const rows = [];
  for (let i = 0; i < 5; i += 1) {
    rows[i] = {
      tickers: universe.ticker[i],
      ratio: universe.percent[i],
      returns: universe.returns[i],
    };
  }
  console.log(rows);

  return {
    columns: [
      { Header: "Tickers", accessor: "tickers", width: "45%", align: "left" },
      { Header: "Ratio", accessor: "ratio", width: "10%", align: "left" },
      { Header: "Return", accessor: "returns", align: "center" },
    ],
    rows,
  };
}
