import Home1 from "layouts/home1";
import MAsolutionTest from "layouts/masolution_test";
import Screening2 from "layouts/screening2";
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
    name: "미래에셋 EMP 솔루션",
    key: "masolution",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/masolution",
    component: <MAsolutionTest />,
  },
  {
    type: "collapse",
    name: "Direct Indexing",
    key: "screening",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/screening",
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
