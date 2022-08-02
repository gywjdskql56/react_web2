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
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/screening3/components/Projects";
import Projects2 from "layouts/screening3/components/Projects2";// Material Dashboard 2 React example components
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
 const animatedComponents = makeAnimated();
 let selectList1= [1];
 let selectList2= [1];
 sessionStorage.setItem("sector", selectList1)
 sessionStorage.setItem("theme", selectList2)
 const [selected1, setSelected1] = useState(selectList1);
 const [selected2, setSelected2] = useState(selectList2);
 const [open1, setOpen1] = React.useState(false);

 const handleChangeSec1 = event => {
  selectList1= [];
  for (let i = 0; i<Object.keys(event).length; i+=1){
        console.log(event[i].value);
        selectList1.push(event[i].value)
  };
  console.log("sector",selectList1)
  console.log("sector",selectList1.join(','))
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
    { value: 1, label: "글로벌" },
    { value: 2, label: "미국" },
    { value: 3, label: "한국" },
    { value: 4, label: "일본" },
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
  function onClickNext(e) {
    setOpen1(true);
    console.log('next를 누르셨습니다.');
    console.log(open1);
  }
  const postres = httpGet(`/green_index/${sessionStorage.getItem("sector")}_${sessionStorage.getItem("theme")}`);
  const xtick = [];
  for (let i=0; i<postres.port_return.date.length; i+=1){
  xtick.push(0)
  }
  const sales = {
    labels: postres.port_return.date,
    datasets: [{ label: "수익률", data: postres.port_return.rtn,color: "error", pointRadius:1, borderWidth:2  },
    { label: "기준선", data: xtick, color: "secondary", pointRadius:0, borderWidth:1 }
    ]
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      <Grid container spacing={3}>
      <Grid item xs={6} md={6} lg={6}>
      <MDBox mt={1}>
        <DefaultProjectCard image=""
                label=""
                title="투자 대상 국가 선택"
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
          />
        </MDBox>
        </MDBox>
       </Grid>
       <Grid item xs={6} md={6} lg={6}>
      <MDBox mt={1}>
        <DefaultProjectCard image=""
                label=""
                title="투자 유니버스 선택"
                description="편입할 유니버스를 선택해주세요."
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
              <MDButton variant="gradient" color="warning" onClick={() => onClickNext()} fullWidth>
                NEXT
              </MDButton>
          </MDBox>

          {open1===true && <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="수익률"
                  description={
                    <>
                      전 기간 백테스트 수익률은 <strong>{Math.round(postres.port_return.rtn.at(-1)*100)}%</strong> 입니다.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="변동성"
                  count="-"
                  percentage={{
                    color: "success",
                    amount: "2,000,000",
                    label: "than last week",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="현재 자산"
                  count="-"
                  percentage={{
                    color: "success",
                    amount: "2,300,000",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="배당성"
                  count="-"
                  percentage={{
                    color: "success",
                    amount: "0.9%",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
          <MDBox mt={4.5}>
             <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Projects2 />
              </Grid>
            </Grid>
          </MDBox>
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Projects />
                <MDBox mt={4.5}>
                  <MDButton variant="gradient" color="warning" fullWidth>
                    주문 실행하기
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>}

      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
