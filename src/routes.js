import Home1 from "layouts/home1";
import MAsolutionTest from "layouts/masolution_test";
import Screening2 from "layouts/screening2";
// import Screening4 from "layouts/screening4";
// import DI from "layouts/direct_indexing";
import TLHsolution from "layouts/tlh_solution";
import Icon from "@mui/material/Icon";

const routes = [
   {
    type: "collapse",
    name: "메인",
    key: "react_web2",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/react_web2",
    component: <Home1 />,
  },
  {
    type: "collapse",
    name: "미래에셋 자문 솔루션",
    key: "masolution",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/masolution",
    component: <MAsolutionTest />,
  },
//  {
//    type: "collapse",
//    name: "Direct Indexing",
//    key: "screening",
//    icon: <Icon fontSize="small">dashboard</Icon>,
//    route: "/screening",
//    component: <DI />,
//  },
//    {
//    type: "collapse",
//    name: "ETF 스크리닝",
//    key: "etf_screening",
//    icon: <Icon fontSize="small">dashboard</Icon>,
//    route: "/etf_screening",
//    component: <Screening4 />,
//  },
    {
    type: "collapse",
    name: "다이렉트 인덱싱",
    key: "direct_indexing",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/direct_indexing",
    component: <Screening2 />,
  },
  {
    type: "collapse",
    name: "절세 전략",
    key: "tlh_solution",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/tlh_solution",
    component: <TLHsolution />,
  },

];

export default routes;
