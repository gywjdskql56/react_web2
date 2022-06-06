/* eslint-disable react/prop-types */
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
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data

// Dashboard components
import React, { useState } from "react";
import MAsolution2 from "layouts/masolution2";
import { Routes, Link } from "react-router-dom";
import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import httpGet from "config";

function Dashboard() {
  sessionStorage.setItem("selected2", false);
  console.log("strategy is ".concat(sessionStorage.getItem("port2")));
  const [warningSB, setWarningSB] = useState(false);
  const closeWarningSB = () => setWarningSB(false);
  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world! "
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );
  const color = ["error", "warning", "success", "info"];
  const strategy = httpGet("/strategy")[sessionStorage.getItem("port1")];
  console.log(strategy);

  function openWarningSB() {
    console.log("on click!");
    console.log(sessionStorage.getItem("selected2"));
    if (sessionStorage.getItem("selected2") === "true") {
      console.log("selected");
      window.location.href = "/masolution2";
    }
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {strategy.map((value, index) => (
            <Grid item xs={4} md={4} lg={12 / strategy.length}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color={color[index]}
                  icon="weekend"
                  count={value}
                  title="국내외 238개 종목"
                  solutionNum="2"
                  percentage={{
                    color: "success",
                    amount: "+25%",
                    label: "설정일 이후",
                  }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>
        <MDBox mt={4.5}>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                <MDButton
                  variant="gradient"
                  color="warning"
                  onClick={() => openWarningSB()}
                  fullWidth
                >
                  다음 단계로
                </MDButton>
                {renderWarningSB}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <MDBox mt={4.5}>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                <MDButton
                  variant="gradient"
                  color="warning"
                  href="...src/layouts/masolution2"
                  fullWidth
                >
                  다음 단계로
                </MDButton>
                {renderWarningSB}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <MDBox mt={4.5}>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                <MDButton
                  variant="gradient"
                  color="warning"
                  href="...src/layouts/masolution2/index.js"
                  fullWidth
                >
                  다음 단계로
                </MDButton>
                {renderWarningSB}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <MDBox mt={4.5}>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                <MDButton
                  variant="gradient"
                  color="warning"
                  href="...src/layouts/masolution2/index.js"
                  onClick="window.open('...src/layouts/masolution2/index.js', 'self');"
                  fullWidth
                >
                  다음 단계로
                </MDButton>
                {renderWarningSB}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <MDBox mt={4.5}>
          <Link to="/masolution2">다음 단계로</Link>
          <Routes path="/masolution2" component={MAsolution2} />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
