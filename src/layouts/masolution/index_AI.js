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

// Data
// import reportsBarChartData from "layouts/masolution/data/reportsBarChartData";
// import reportsLineChartData from "layouts/masolution/data/reportsLineChartData";

// Dashboard components
// import Projects from "layouts/masolution/components/Projects";
// import OrdersOverview from "layouts/masolution/components/OrdersOverview";
import React, { useState } from "react";

import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import port1 from "assets/images/port_1.png";
import port2 from "assets/images/port_2.png";
import port3 from "assets/images/port_3.png";
import port4 from "assets/images/port_4.png";
import port5 from "assets/images/port_5.png";
import port6 from "assets/images/port_6.png";

function Dashboard() {
  const [warningSB, setWarningSB] = useState(false);
  const [port, setPort] = useState("변동성 알고리즘");

  const closeWarningSB = () => setWarningSB(false);
  window.addEventListener("port", () => {
    console.log("change to local storage!");
    setPort(localStorage.getItem("port"));
    console.log(localStorage.getItem("port"));
    let portnm = "미래변동성공격1";
    if (sessionStorage.getItem("port1") === "변동성") {
      setPort(port1);
      portnm = "미래변동성공격1";
    } else if (sessionStorage.getItem("port1") === "초개인로보") {
      setPort(port2);
      portnm = "미래초개인로보적극1";
    } else if (sessionStorage.getItem("port1") === "테마로테션") {
      setPort(port3);
      portnm = "미래테마로테션공격1";
    } else if (sessionStorage.getItem("port1") === "멀티에셋인컴") {
      setPort(port4);
      portnm = "미래멀티에셋인컴공1";
    } else if (sessionStorage.getItem("port1") === "AI 미국주식 투자") {
      setPort(port5);
      portnm = "미래에셋AI크로스알파";
    } else if (sessionStorage.getItem("port1") === "멀티에셋 모멘텀") {
      setPort(port5);
      portnm = "멀티에셋국";
    }
    sessionStorage.setItem("port1", portnm);
  });

  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );
  // todo:
  // openWarningSB
  function openWarningSB() {
    console.log("on click!");
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={9.6} md={4.8} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                count="변동성 알고리즘"
                title="국내 / ETF"
                percentage={{
                  color: "success",
                  amount: "+25%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                count="초개인화 자산관리"
                title="국내외 / ETF"
                percentage={{
                  color: "success",
                  amount: "+31%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                count="테마 로테이션"
                title="해외 / ETF"
                percentage={{
                  color: "success",
                  amount: "+13%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                count="멀티에셋 인컴"
                title="다양한 인컴 자산"
                percentage={{
                  color: "success",
                  amount: "+16%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="adb"
                count="AI 미국주식 투자"
                title="국내외 238개 종목"
                percentage={{
                  color: "success",
                  amount: "+18%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={9.6} md={4.8} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="secondary"
                icon="adb"
                count="AI 미국주식 투자"
                title="국내외 238개 종목"
                percentage={{
                  color: "success",
                  amount: "+18%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={15} md={15} xl={12}>
              <DefaultProjectCard image={port} label="" title="" description="" />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                <MDButton
                  variant="gradient"
                  href="/masolution1"
                  color="warning"
                  onClick={() => openWarningSB()}
                  fullWidth
                >
                  NEXT
                </MDButton>
                {renderWarningSB}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
