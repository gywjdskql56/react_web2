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
// const kospi = fetch("http://127.0.0.1:5000/kospi")
//  .then((response) => response.json())
//  .then((data) => this.setState({ date: data.date, price: data.price, returns: data.returns }));
// console.log(kospi);
const data = localStorage.getItem("returns");
console.log(data);
export default {
  sales: {
    labels: data.date,
    datasets: { label: "수익률", data: data.returns },
  },
  tasks: {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: { label: "Desktop apps", data: [200, 40, 300, 220, 500, 250, 400, 230, 500] },
  },
};
