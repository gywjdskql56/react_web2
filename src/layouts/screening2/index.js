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
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Slider from "react-rangeslider";
// Data

// Dashboard components
import React, { useState } from "react";

import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Slider1 from './Slider';

function Dashboard() {
  const [warningSB, setWarningSB] = useState(false);
  const closeWarningSB = () => setWarningSB(false);
  const animatedComponents = makeAnimated();
  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world!"
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  function openWarningSB() {
    console.log("on click!");
    window.location.href = "layouts/masolution2";
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1}>
            <DefaultProjectCard image=""
                label=""
                title="팩터 가중치 선택"
                description="각 팩터의 가중치를 선택해주세요."
                size="large"
                component="text" />
                <MDBox mt={2}>
                <fieldset>
                <MDBox mt={0}>
                    <Slider1 title="Value" />
                </MDBox>
                <MDBox mt={-5}>
                    <Slider1 title="Size" />
                </MDBox>
                <MDBox mt={-5}>
                    <Slider1 title="Quality" />
                </MDBox>
                <MDBox mt={-5}>
                    <Slider1 title="Earnings Momentum" />
                </MDBox>
                <MDBox mt={-5}>
                    <Slider1 title="Price Momentum" />
                </MDBox>
                </fieldset>
                </MDBox>
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1}>
            <DefaultProjectCard image=""
                label=""
                title="섹터 비중 조절"
                description="비중변화의 합은 0이 되어야 합니다. 현재 합은 0입니다."
                size="large"
                component="text" />
                <MDBox mt={2}>
                <fieldset>
                    <MDBox mt={0}>
                        <Slider1 title="2차 전지" />
                    </MDBox>
                    <MDBox mt={-5}>
                        <Slider1 title="전기차" />
                    </MDBox>
                    <MDBox mt={-5}>
                        <Slider1 title="대체 에너지" />
                    </MDBox>
                    <MDBox mt={-5}>
                        <Slider1 title="환경보호기술 및 서비스" />
                    </MDBox>

                </fieldset>
                </MDBox>
            </MDBox>

          </Grid>
          <MDButton variant="gradient" color="warning" fullWidth>
                NEXT
              </MDButton>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
