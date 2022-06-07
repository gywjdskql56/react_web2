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
import MAsolution1 from "layouts/masolution1";
import MAsolution2 from "layouts/masolution2";
import { Routes, Link } from "react-router-dom";
import MDButton from "components/MDButton";
import httpGet from "config";

function Dashboard() {
  const [component, setComponent] = useState(MAsolution2);
  const [path, setPath] = useState("/masolution2");
  sessionStorage.setItem("selected2", false);
  console.log("strategy is ".concat(sessionStorage.getItem("port2")));
  const color = ["error", "warning", "success", "info"];
  const strategy = httpGet("/strategy")[sessionStorage.getItem("port1")];
  sessionStorage.setItem("strategy", strategy);
  console.log(strategy);
  function click() {
    console.log(sessionStorage.getItem("selected2"));
    if (sessionStorage.getItem("selected2") === "false") {
      setComponent(MAsolution1);
      setPath("/masolution1");
      console.log("same");
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
          <Link onClick={() => click()} to={path}>
            <MDButton variant="gradient" color="warning" fullWidth>
              NEXT
            </MDButton>
          </Link>
          <Routes path={path} component={component} />
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
