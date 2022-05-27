/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
// import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
// import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
// import Projects from "layouts/dashboard/components/Projects";
import Explain from "layouts/home/components/Explain";
// import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// console.log(word.name);
// fetch("http://127.0.0.1:5000/word")
//  .then((response) => response.json())
//  .then((data) => console.log(data));
// fetch("http://127.0.0.1:5000/word")
//  .then((response) => response.json())
//  .then((data) => console.log(data.name));

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={15} md={12} lg={12}>
        <Explain />
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
