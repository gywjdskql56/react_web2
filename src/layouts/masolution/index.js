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
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MAsolution1 from "layouts/masolution1";
import { Routes, Link } from "react-router-dom";

// Data
// import reportsBarChartData from "layouts/masolution/data/reportsBarChartData";
// import reportsLineChartData from "layouts/masolution/data/reportsLineChartData";

// Dashboard components
// import Projects from "layouts/masolution/components/Projects";
// import OrdersOverview from "layouts/masolution/components/OrdersOverview";
import React, { useState } from "react";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

import MDButton from "components/MDButton";

function Dashboard() {
  const [port, setPort] = useState("1");
  sessionStorage.setItem("selected1", false);
  sessionStorage.setItem("selected2", false);

  window.addEventListener("port1", () => {
    const portfolio1 = sessionStorage.getItem("port1");
    console.log("change to local storage!");
    //    setPort(localStorage.getItem("port"));
    //    console.log(localStorage.getItem("port"));
    let portnm = "?????????????????????1";
    if (portfolio1 === "?????????") {
      setPort("1");
      portnm = "?????????????????????1";
    } else if (portfolio1 === "???????????????") {
      setPort("2");
      portnm = "???????????????????????????1";
    } else if (portfolio1 === "???????????????") {
      setPort("3");
      portnm = "???????????????????????????1";
    } else if (portfolio1 === "??????????????????") {
      setPort("4");
      portnm = "???????????????????????????1";
    } else if (portfolio1 === "AI ???????????? ??????") {
      setPort("5");
      portnm = "????????????AI???????????????";
    }
    localStorage.setItem("port", portnm);
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                count="????????? ????????????"
                title="?????? / ETF"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+25%",
                  label: "????????? ??????",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                count="???????????? ????????????"
                title="????????? / ETF"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+31%",
                  label: "????????? ??????",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                count="?????? ????????????"
                title="?????? / ETF"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+13%",
                  label: "????????? ??????",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                count="???????????? ??????"
                title="????????? ?????? ??????"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+16%",
                  label: "????????? ??????",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={15} md={15} xl={12}>
              <DefaultProjectCard image={port} label="" title="" description="" size="large" />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <MDBox mt={4.5}>
            <Link to="/masolution1">
              <MDButton variant="gradient" color="warning" fullWidth>
                NEXT
              </MDButton>
            </Link>
            <Routes path="/masolution1" component={MAsolution1} />
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
