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

import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";

function Dashboard() {
  const [warningSB, setWarningSB] = useState(false);
  const closeWarningSB = () => setWarningSB(false);
  const animatedComponents = makeAnimated();
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
  const options1 = [
    { value: "Nasdaq 100", label: "Nasdaq 100" },
    { value: "S&P500", label: "S&P500" },
    { value: "CSI300", label: "CSI300" },
    { value: "STOXX50", label: "STOXX50" },
  ];
  const options2 = [
    { value: "10000000", label: "1000만원" },
    { value: "20000000", label: "2000만원" },
    { value: "30000000", label: "3000만원" },
    { value: "40000000", label: "4000만원" },
    { value: "50000000", label: "5000만원" },
  ];
  const options3 = [
    { value: "Y", label: "절세 포트폴리오 운용 일임에 참여 희망" },
    { value: "N", label: "절세 포트폴리오 운용 일임에 참여 미희망" },
  ];
  function openWarningSB() {
    console.log("on click!");
    window.location.href = "layouts/masolution2";
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={2} md={2} lg={2}>
            <MDBox mb={1}>
              <ComplexStatisticsCard color="error" icon="weekend" count="- 투자 지수" />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options1[4], options1[5]]}
            options={options1}
          />
        </MDBox>
        <MDBox mt={4.5}>
          <Grid item xs={2} md={2} lg={2}>
            <MDBox mb={1}>
              <ComplexStatisticsCard color="error" icon="weekend" count="- 투자 금액" />
            </MDBox>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options2[1]]}
            isMulti
            options={options2}
          />
        </MDBox>
        <MDBox mt={4.5}>
          <Grid item xs={2} md={2} lg={2}>
            <MDBox mb={1}>
              <ComplexStatisticsCard color="error" icon="weekend" count="- 일임 계약" />
            </MDBox>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options3[4], options3[5]]}
            isMulti
            options={options3}
          />
        </MDBox>
        <MDBox mt={4.5}>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                <MDButton
                  variant="gradient"
                  color="warning"
                  onClick={() => openWarningSB()}
                  fullWidth
                  href="/tlh_solution2"
                >
                  다음 단계로
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
