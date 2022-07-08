import httpGet from "config";

export default function data() {
  const tlh = httpGet("/tlh_table");
  console.log(tlh);
  console.log(tlh.no_tlh);
  console.log(tlh.with_tlh);

  const rows = [];
  for (let i = 0; i < tlh.no_tlh.length; i += 1) {
    rows[i] = {
      col: tlh.col[i],
      with_tlh: tlh.with_tlh[i],
      no_tlh: tlh.no_tlh[i],
    };
  }
  console.log(rows);

  return {
    columns: [
      { Header: "", accessor: "col", width: "30%", align: "left" },
      { Header: "TLH 적용", accessor: "with_tlh", width: "40%", align: "left" },
      { Header: "TLH 미적용", accessor: "no_tlh", align: "center" },
    ],
    rows,
  };
}
