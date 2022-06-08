import httpGet from "config";

export default function data() {
  const perReturns = httpGet(
    "/period_returns/".concat(sessionStorage.getItem("port1"), "_", sessionStorage.getItem("port2"))
  );
  const cols = Object.keys(perReturns);
  console.log(perReturns);
  console.log(Object.keys(perReturns));

  let rows = {};
  for (let i = 0; i < cols.length; i += 1) {
    if (perReturns[cols[i]] !== "") {
      rows[cols[i]] = Math.ceil(perReturns[cols[i]] * 1000) / 1000;
    } else {
      rows[cols[i]] = "-";
    }
  }
  console.log(rows);
  rows = [rows];
  console.log(rows);

  const columns = [];
  for (let i = 0; i < cols.length; i += 1) {
    columns[i] = {
      Header: cols[i],
      accessor: cols[i],
      width: (1 / cols.length) * 100,
      align: "left",
    };
  }
  console.log(rows);

  return {
    columns,
    rows,
  };
}
