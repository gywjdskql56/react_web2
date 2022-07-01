import Home from "layouts/home";
import MAsolution from "layouts/masolution";
// import MAsolution1 from "layouts/masolution1";
// import MAsolution2 from "layouts/masolution2";
// import Screening from "layouts/screening";
import TLHsolution from "layouts/tlh_solution";
// import TLHsolution2 from "layouts/tlh_solution2";
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
    name: "Direct Indexing 솔루션",
    icon: <Icon fontSize="small">dashboard</Icon>,
    href: "https://jkw5779.shinyapps.io/direct_indexing_green",
  },
  {
    type: "collapse",
    name: "TLH 솔루션",
    key: "tlh_solution",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/tlh_solution",
    component: <TLHsolution />,
  },
];

export default routes;
