import Grid from "@mui/material/Grid";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import Explain from "layouts/home/components/Explain";
// import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left"> {props.left} </div>
      <div className="SplitPane-right"> {props.right} </div>
    </div>
  );
}

function Dashboard() {
  return (
  <SplitPane
    left = {<DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={15} md={12} lg={12}>
        <Explain />
      </Grid>
      <Footer />
    </DashboardLayout>}
    right = {<DashboardLayout>
      <Grid item xs={15} md={12} lg={12}>
        <Explain />
      </Grid>
      <Footer />
    </DashboardLayout>}
  />
  );
}

export default Dashboard;
