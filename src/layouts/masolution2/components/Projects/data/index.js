import httpGet from "config";

export default function data() {
  const universe = httpGet(
    "/universes/".concat(sessionStorage.getItem("port1"), "_", sessionStorage.getItem("port2"))
  );
  console.log(sessionStorage.getItem("port1"));
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
