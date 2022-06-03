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
import httpGet from "config";

const data = httpGet("/kospi");
console.log(data);
// const getdata = async () => {
//  const response = await fetch("http://127.0.0.1:5000/kospi");
//  return response.json();
// };
// console.log(getdata());
// console.log(getdata().date);
// async function getPrice() {
//  fetch("http://127.0.0.1:5000/kospi").then((response) => response.json()).then((data) => await data);
// }
//  .then((data) => this.setState({ kospi: data }));
// const kospi = getPrice();
// console.log(kospi);
// console.log(kospi.date);
// const storeProducts = fetch("http://127.0.0.1:5000/kospi").then((res) => res.json());
// console.log(storeProducts);
export default {
  sales: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: { label: "Desktop apps", data: [200, 40, 300, 220, 500, 250, 400, 230, 500] },
  },
  tasks: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: { label: "Desktop apps", data: [200, 40, 300, 220, 500, 250, 400, 230, 500] },
  },
};
