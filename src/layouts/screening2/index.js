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
import Screening3 from "layouts/screening3";
// Dashboard components
import React, { useState } from "react";
import MDButton from "components/MDButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Routes, Link } from "react-router-dom";
import Slider1 from './Slider';


global.XMLHttpRequest = require("xhr2");

function Dashboard() {
  function openWarningSB() {
    console.log("on click!");
    window.location.href = "layouts/masolution3";
  }

 const animatedComponents = makeAnimated();
 let selectList1= [1];
 let selectList2= [1];
 sessionStorage.setItem("sector", selectList1)
 sessionStorage.setItem("theme", selectList2)
 const [selected1, setSelected1] = useState(selectList1);
 const [selected2, setSelected2] = useState(selectList2);

 const handleChangeSec1 = event => {
  selectList1= [];
  for (let i = 0; i<Object.keys(event).length; i+=1){
        console.log(event[i].value);
        selectList1.push(event[i].value)
  };
  console.log(selectList1)
  console.log(selectList1.join(','))
  setSelected1(selectList1.join(','));
  sessionStorage.setItem("sector", selectList1)
  }

 const handleChangeThe1 = event => {
      selectList2= [];
  for (let i = 0; i<Object.keys(event).length; i+=1){
        console.log(event[i].value);
        selectList2.push(event[i].value)
  };
  console.log(selectList2)
  setSelected2(selectList2.join(','));
  sessionStorage.setItem("theme", selectList2)
  };

 const options1 = [
    { value: 1, label: "2차전지" },
    { value: 2, label: "전기차" },
    { value: 3, label: "대체에너지" },
    { value: 4, label: "환경보호기술 및 서비스" },
  ];
  const options2 = [
    { value: 1, label: "동박" },
    { value: 2, label: "배터리장비" },
    { value: 3, label: "배터리셀" },
    { value: 4, label: "분리막" },
    { value: 5, label: "양극재" },
    { value: 6, label: "음극재" },
    { value: 7, label: "전해액" },
    { value: 8, label: "전기차" },
    { value: 9, label: "전기차 공조 및 모터" },
    { value: 10, label: "전기차 기타부품" },
    { value: 11, label: "전동화 부품" },
    { value: 12, label: "ESS" },
    { value: 13, label: "수소" },
    { value: 14, label: "수소차부품" },
    { value: 15, label: "수소충전소" },
    { value: 16, label: "연료전지" },
    { value: 17, label: "재생에너지" },
    { value: 18, label: "태양광" },
    { value: 19, label: "풍력자재" },
    { value: 20, label: "풍력프로젝트" },
    { value: 21, label: "원자력" },
    { value: 22, label: "단열재" },
    { value: 23, label: "스마트그리드" },
    { value: 24, label: "스마트에너지플랫폼" },
    { value: 25, label: "친환경선박" },
    { value: 26, label: "탄소배출권" },
    { value: 27, label: "자원순환" },
    { value: 28, label: "폐기물" },
  ];
// console.log(`/green_index_${selected1}_${selected2}`);
// const postres = httpGet(`/green_index/${selected1}_${selected2}`);
// console.log(postres.port_return);
// const postresSec = httpGet('/green_index_sec');
// const postresTheme = httpGet('/green_index_theme');
// console.log(postres);
// console.log(postres.port_return);
// console.log(postresSec);
// console.log(postresTheme);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      <Grid container spacing={3}>
      <Grid item xs={6} md={6} lg={6}>
      <MDBox mt={1}>
        <DefaultProjectCard image=""
                label=""
                title="섹터 선택"
                description="편입할 섹터를 선택해주세요."
                size="large"
                component="text" />
          <MDBox mt={1}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options1[4], options1[5]]}
            isMulti
            options={options1}
            onChange={handleChangeSec1}
//            value={selected1}
          />
        </MDBox>
        </MDBox>
       </Grid>
       <Grid item xs={6} md={6} lg={6}>
      <MDBox mt={1}>
        <DefaultProjectCard image=""
                label=""
                title="테마 선택"
                description="편입할 테마를 선택해주세요."
                size="large"
                component="text" />
          <MDBox mt={1}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[options1[4], options1[5]]}
            isMulti
            options={options2}
            onChange={handleChangeThe1}
          />
        </MDBox>
        </MDBox>
        </Grid>
        </Grid>
        <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1} mt={1}>
            <DefaultProjectCard image=""
                label=""
                title="섹터 비중 조절"
                description="비중변화의 합은 0이 되어야 합니다."
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
          <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1} mt={1}>
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


        </Grid>
        <MDBox mt={4.5}>
            <Link to="/screening3">
              <MDButton variant="gradient" color="warning" onClick={() => openWarningSB()} fullWidth>
                NEXT
              </MDButton>
            </Link>
            <Routes path="/screening3" component={Screening3} />
          </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
