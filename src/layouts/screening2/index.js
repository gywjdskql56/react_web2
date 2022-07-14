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
import httpGet from "config";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
// Data
import axios from "axios";

// Dashboard components
import React from "react";
import MDButton from "components/MDButton";
import Slider1 from './Slider';

global.XMLHttpRequest = require("xhr2");

function Dashboard() {
const theURL = "https://evening-ridge-28066.herokuapp.com/calc_port_weight2";
const data = {
    sim_start:"20150101",
    sim_end:"20220101",
    include_sector_num:[1,2,3],
    include_theme_num:[28],
    value_adj:1,
    size_adj:0,
    quality_adj:0,
    em_adj:1,
    pm_adj:1,
    weight_add_vec:[0.05,-0.05,0,0],
    num_select:1
    }
const postres = httpGet('/green_index');
console.log(postres);

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
