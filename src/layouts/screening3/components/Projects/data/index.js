import httpGet from "config";

export default function data() {
  const postres = httpGet(`/green_index/${sessionStorage.getItem("sector")}_${sessionStorage.getItem("theme")}`);
  const universe = postres.port_weight
  console.log(postres.port_return.date.slice(-200,-1));
  console.log(httpGet("/strategy")[sessionStorage.getItem("port1")]);


  const rows = [];
  for (let i = 0; i < universe.td.length; i += 1) {
    rows[i] = {

      date: universe.td[i],
      code: universe.code[i],
      name: universe.name[i],
      weight: universe.weight[i],
    };
  }
  console.log(rows);

  return {
    columns: [
      { Header: "Date", accessor: "date", width: "20%", align: "left" },
      { Header: "Code", accessor: "code", width: "20%", align: "left" },
      { Header: "Name", accessor: "name", width: "30%", align: "center" },
      { Header: "Weight", accessor: "weight", align: "center" },
    ],
    rows,
  };
}
