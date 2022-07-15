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
import Screening2 from "layouts/screening2";
import { Routes, Link } from "react-router-dom";
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
    { value: "GLOBAL", label: "글로벌 전체" },
    { value: "US", label: "미국" },
    { value: "KOREA", label: "한국" },
    { value: "JAPAN", label: "일본" },
  ];
  const options2 = [
    { value: "배당", label: "스타일 투자 - 배당주" },
    { value: "성장", label: "스타일 투자 - 성장주" },
    { value: "퀄리티", label: "스타일 투자 - 퀄리티" },
    { value: "로우볼", label: "스타일 투자 - 로우볼" },
    { value: "모멘텀", label: "스타일 투자 - 모멘텀" },
    { value: "탄소중립", label: "테마 투자 - 탄소중립" },
    { value: "로보틱스", label: "테마 투자 - 로보틱스" },
    { value: "클라우드", label: "테마 투자 - 클라우드" },
    { value: "인프라", label: "테마 투자 - 인프라" },
    { value: "혼합 자산", label: "테마 투자 - 혼합 자산" },
  ];
  const options3 = [
    { value: "변동성 20% 이내", label: "변동성 20% 이내" },
    { value: "변동성 10% 이내", label: "변동성 10% 이내" },
    { value: "최근 수익률 상위 30개", label: "최근 수익률 상위 30개" },
    { value: "최근 수익률 상위 10%", label: "최근 수익률 상위 10%" },
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
              <ComplexStatisticsCard color="error" icon="weekend" count="- 국가 선택" />
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
          <Grid item xs={2} md={2} lg={2}>
            <MDBox mb={1}>
              <ComplexStatisticsCard color="error" icon="weekend" count="- 테마 선택" />
            </MDBox>
          </Grid>
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
          <Grid item xs={2} md={2} lg={2}>
            <MDBox mb={1}>
              <ComplexStatisticsCard color="error" icon="weekend" count="- 스크리닝 조건" />
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
                <MDBox>
          <MDBox mt={4.5}>
            <Link to="/screening2">
              <MDButton variant="gradient" color="warning" fullWidth>
                NEXT
              </MDButton>
            </Link>
            <Routes path="/screening2" component={Screening2} />
          </MDBox>
        </MDBox>
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
