import Home from "layouts/home";
//import Home2 from "layouts/home2";
import MAsolution from "layouts/masolution";
import MAsolution1 from "layouts/masolution1";
import MAsolution2 from "layouts/masolution2";
import Screening from "layouts/screening";
import Screening2 from "layouts/screening2";
import TLHsolution from "layouts/tlh_solution";
import TLHsolution2 from "layouts/tlh_solution2";
// import Tables from "layouts/tables";
// import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
// import Notifications from "layouts/notifications";
// import Profile from "layouts/profile";
// import SignIn from "layouts/authentication/sign-in";
// import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
//  {
//    type: "collapse",
//    name: "test page",
//    key: "react_web2_test_split",
//    icon: <Icon fontSize="small">dashboard</Icon>,
//    route: "/react_web2_test_split",
//    component: <Home2 />,
//  },
   {
    type: "collapse",
    name: "메인",
    key: "react_web2",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/react_web2",
    component: <Home />,
  },
  {
    type: "collapse",
    name: "미래에셋 맞춤형 솔루션",
    key: "masolution",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/masolution",
    component: <MAsolution />,
  },
  {
    type: "collapse",
    name: "  -- 유형 선택",
    key: "masolution1",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/masolution1",
    component: <MAsolution1 />,
  },
  {
    type: "collapse",
    name: "  --포트폴리오 현황",
    key: "masolution2",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/masolution2",
    component: <MAsolution2 />,
  },
  {
    type: "collapse",
    name: "Direct Indexing",
    key: "screening",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/screeening",
    component: <Screening />,
  },
  {
    type: "collapse",
    name: "--Direct Indexing2",
    key: "screening2",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/screeening2",
    component: <Screening2 />,
  },
//  {
//    type: "collapse",
//    name: "Direct Indexing 솔루션",
//    icon: <Icon fontSize="small">dashboard</Icon>,
//    href: "https://jkw5779.shinyapps.io/direct_indexing_green",
//  },

  {
    type: "collapse",
    name: "TLH 솔루션",
    key: "tlh_solution",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/tlh_solution",
    component: <TLHsolution />,
  },
  {
    type: "collapse",
    name: "  --TLH 솔루션2",
    key: "tlh_solution2",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/tlh_solution2",
    component: <TLHsolution2 />,
  },
];

export default routes;
