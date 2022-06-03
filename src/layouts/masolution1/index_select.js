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
    { value: "GLOBAL", label: "GLOBAL" },
    { value: "US", label: "US" },
    { value: "KOREA", label: "KR" },
    { value: "JAPAN", label: "JP" },
  ];
  const options2 = [
    { value: "ESG", label: "ESG" },
    { value: "ex ESG", label: "ex ESG" },
  ];
  const options3 = [
    { value: "AALP", label: "AAPL" },
    { value: "TSLA", label: "TSLA" },
    { value: "GOOGL", label: "GOOGL" },
    { value: "NASDAQ", label: "NASDAQ" },
  ];
  function openWarningSB() {
    console.log("on click!");
    window.location.href = "layouts/dashboard_2_2";
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={4} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="weekend"
                count="공격투자"
                title="국내외 238개 종목"
                percentage={{
                  color: "success",
                  amount: "+25%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="warning"
                count="위험중립"
                title="국내외 238개 종목"
                percentage={{
                  color: "warning",
                  amount: "+31%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                count="안정중립"
                title="국내외 238개 종목"
                percentage={{
                  color: "success",
                  amount: "+13%",
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options1[4], options1[5]]}
            isMulti
            options={options1}
          />
        </MDBox>
        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options2[4], options2[5]]}
            isMulti
            options={options2}
          />
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
                  href="/masolution2"
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
