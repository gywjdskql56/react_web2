import httpGet from "config";

export default function data() {
  const tlh = httpGet(`/tlh_solution/${sessionStorage.getItem("index")}_${sessionStorage.getItem("init_invest")}`).TABLE;

  console.log(tlh.diff_tlh);
  sessionStorage.setItem('수익', tlh.diff_tlh[0]);
  sessionStorage.setItem('세금', tlh.diff_tlh[3]);
  console.log(tlh.no_tlh);
  console.log(tlh.with_tlh);

  const rows = [];
  for (let i = 0; i < tlh.no_tlh.length; i += 1) {
    rows[i] = {
      col: tlh.col[i],
      with_tlh: tlh.with_tlh[i],
      no_tlh: tlh.no_tlh[i],
      diff_tlh : tlh.diff_tlh[i]
    };
  }
  console.log(rows);

  return {
    columns: [
      { Header: "", accessor: "col", width: "30%", align: "left" },
      { Header: "TLH 적용", accessor: "with_tlh",  align: "left" },
      { Header: "TLH 미적용", accessor: "no_tlh", align: "center" },
      { Header: "절세전략 효과", accessor: "diff_tlh", align: "center" },
    ],
    rows,
  };
}
