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
    let portnm = "미래변동성공격1";
    if (portfolio1 === "변동성") {
      setPort("1");
      portnm = "미래변동성공격1";
    } else if (portfolio1 === "초개인로보") {
      setPort("2");
      portnm = "미래초개인로보적극1";
    } else if (portfolio1 === "테마로테션") {
      setPort("3");
      portnm = "미래테마로테션공격1";
    } else if (portfolio1 === "멀티에셋인컴") {
      setPort("4");
      portnm = "미래멀티에셋인컴공1";
    } else if (portfolio1 === "AI 미국주식 투자") {
      setPort("5");
      portnm = "미래에셋AI크로스알파";
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
                count="변동성 알고리즘"
                title="국내 / ETF"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+25%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                count="초개인화 자산관리"
                title="국내외 / ETF"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+31%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                count="테마 로테이션"
                title="해외 / ETF"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+13%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                count="멀티에셋 인컴"
                title="다양한 인컴 자산"
                solutionNum="1"
                percentage={{
                  color: "success",
                  amount: "+16%",
                  label: "설정일 이후",
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
