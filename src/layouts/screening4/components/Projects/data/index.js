import httpGet from "config";

export default function data() {
    let factor_s = JSON.parse(sessionStorage.getItem("factor"));
    console.log(factor_s);
    let rmticker_str = sessionStorage.getItem("rmticker_str");
    console.log(rmticker_str);
    const universe = httpGet(`/finalUniverse_DI/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}_${factor_s[0]}I${factor_s[1]}I${factor_s[2]}I${factor_s[3]}I${factor_s[4]}I${factor_s[5]}I${factor_s[6]}I${factor_s[7]}_${rmticker_str}_${sessionStorage.getItem('portn_select')}`) // _${rmticker_str}
  const rows = [];
  for (let i = 0; i < universe.ticker.length; i += 1) {
    rows[i] = {
      date: universe.td[i],
      code: universe.ticker[i],
      name: universe.name[i],
      theme1: universe.theme1[i],
      theme2: universe.theme2[i],
      theme3: universe.theme3[i],
      weight: universe.weight[i],
    };
  }

  return {
    columns: [
      { Header: "Date", accessor: "date", width: "10%", align: "left" },
      { Header: "Code", accessor: "code", width: "10%", align: "left" },
      { Header: "Name", accessor: "name", width: "20%", align: "center" },
      { Header: "Theme1", accessor: "theme1", width: "10%", align: "center" },
      { Header: "Theme2", accessor: "theme2", width: "10%", align: "center" },
      { Header: "Theme3", accessor: "theme3", width: "10%", align: "center" },
      { Header: "Weight", accessor: "weight", align: "center" },
    ],
    rows,
  };
}
