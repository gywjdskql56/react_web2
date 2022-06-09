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
import React, { useState, useEffect } from "react";
import MAsolution1 from "layouts/masolution1";
import MAsolution2 from "layouts/masolution2";
import { Routes, Link } from "react-router-dom";
import MDButton from "components/MDButton";
import httpGet from "config";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

function Dashboard() {
  let strategy = httpGet("/strategy")[sessionStorage.getItem("port1")];
  const strategyEx = httpGet("/strategy_explain");
  sessionStorage.setItem("strategy_explain", strategyEx);
  const [component, setComponent] = useState(MAsolution2);
  const [path, setPath] = useState("/masolution2");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  //  sessionStorage.setItem("strategy", strategy[sessionStorage.getItem("port1")]);
  //  const [strategy, setStrategy] = useState(strategy[sessionStorage.getItem("port1")]);
  sessionStorage.setItem("selected2", false);
  console.log("strategy is ".concat(sessionStorage.getItem("port2")));
  console.log(strategyEx[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")]);
  const color = ["error", "warning", "success", "info"];
  console.log(strategy);
  useEffect(() => {
    setTitle(strategyEx[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")].title);
    setDesc(strategyEx[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")].desc);
    strategy = httpGet("/strategy")[sessionStorage.getItem("port1")];
  }, []);
  window.addEventListener("port2", () => {
    setTitle(strategyEx[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")].title);
    setDesc(strategyEx[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")].desc);
    strategy = httpGet("/strategy")[sessionStorage.getItem("port1")];
  });

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
        <MDButton variant="gradient" color="dark" fullWidth>
          {sessionStorage.getItem("port1")}이 선택되었습니다.
        </MDButton>
        <MDBox mt={4.5}>
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
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={15} md={15} xl={12}>
              <DefaultProjectCard
                image=""
                label=""
                title={title}
                description={desc}
                size="large"
                component="text"
              />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Link onClick={() => click} to={path}>
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
