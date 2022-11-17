import { Routes, Link } from "react-router-dom";
import img1 from "assets/images/절세전략 설명2.png";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

// @mui material components
import Grid from "@mui/material/Grid";
import httpGet from "config";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/tlh_solution/components/Projects";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Data

// Dashboard components
import React, { useState } from "react";

import MDSnackbar from "components/MDSnackbar";
import MDButton from "components/MDButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";

function Dashboard() {
  let returns = 0
//  sessionStorage.setItem("index", 'SPY')
  const [warningSB, setWarningSB] = useState(false);
  const closeWarningSB = () => setWarningSB(false);
  const animatedComponents = makeAnimated();
  const [selected1, setSelected1] = useState("SPY US EQUITY");
  const [profit, setProfit] = useState(null);
  const [tax, setTax] = useState(null);
  const [sale, setSale] = useState(null);
  const [open1, setOpen1] = React.useState(false);
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
    { value: "QQQ", label: "Nasdaq 100 INDEX" },
    { value: "SPY", label: "S&P500 INDEX" },
    { value: "NOBL", label: "ProShares S&P 500 Dividend Aristocrats ETF" },
    { value: "SOXX", label: "iShares Semiconductor ETF" },
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

  const handleChange = event => {
      console.log("index",event.value);
      console.log("index",event);
      setSelected1(event.value);
      sessionStorage.setItem("index", event.value);
      }
  const handleChange2 = event => {
      sessionStorage.setItem("init_invest", event.value);
      console.log(sessionStorage.getItem("init_invest"))
      }
  function onClickNext(e) {
    setOpen1(true);
    console.log('next를 누르셨습니다.');
    console.log(sessionStorage.getItem("index"));
    console.log(open1);
    const TLHport = httpGet(`/tlh_solution/${sessionStorage.getItem("index")}_${sessionStorage.getItem("init_invest")}`);
    returns = TLHport.SIMUL
    sessionStorage.setItem("returns",JSON.stringify(returns))
    const tlh = TLHport.TABLE
    sessionStorage.setItem("table",JSON.stringify(tlh))
      console.log(tlh.diff_tlh);
      sessionStorage.setItem('수익', tlh.diff_tlh[3]);
      sessionStorage.setItem('세금', tlh.diff_tlh[5]);
      setProfit(tlh.diff_tlh[2])

      setTax(tlh.diff_tlh[3]);

    const xtick = [];
    for (let i=0; i<returns.TLH_SIMUL.length; i+=1){
      xtick.push(0)
    }
    const sales = {
      labels: returns.Date,
      datasets: [{ label: "TLH 적용 수익률", data: returns.TLH_SIMUL,color: "error", pointRadius:1, borderWidth:2 },
      { label: "TLH 미적용 수익률", data: returns.PORT_SIMUL,color: "info", pointRadius:1, borderWidth:2 },
      ],
    };
    setSale(sales)
    console.log(sales)
    console.log(returns.TLH_SIMUL)
    console.log(returns.PORT_SIMUL)
    sessionStorage.setItem("sales", JSON.stringify(sales))
  }
  console.log(sessionStorage.getItem('수익'));
  console.log(sessionStorage.getItem('세금'));
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card>
        <CardMedia
                component="img"
                height="400"
                image={img1}
                alt="Paella dish"
              />
              <Card
                sx={{ maxWidth: 1200 }}
                color = "orange"
              />
        </Card>
      {/* <MDBox py={3}>
        <Grid container spacing={3}>

      <DefaultProjectCard image={img1} label="" title="" description="" size="large" />
      </Grid>
      </MDBox> */}
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1}>
            <ComplexStatisticsCard color="error" icon="weekend" count="- 투자 지수" />

            </MDBox>

        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options1}
            onChange={handleChange}
          />
        </MDBox>
        </Grid>

          <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1}>
              <ComplexStatisticsCard color="error" icon="weekend" count="- 투자 금액" />
            </MDBox>

        <MDBox mt={4.5}>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options2}
            onChange={handleChange2}
          />
        </MDBox>
        </Grid>

        </Grid>
        <MDBox mt={4.5}>
          <MDBox mt={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} lg={12}>
                    <MDButton variant="gradient" color="error" onClick={() => onClickNext()} fullWidth>
                      NEXT
                    </MDButton>
                {renderWarningSB}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
      {open1===true &&
      <MDBox py={3}>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="평가금액"
                  description={
                    <>
                      전 기간 백테스트 수익률은 <strong>{JSON.parse(sessionStorage.getItem("returns")).returns}%</strong> 입니다.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sale}
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
                  title="CAGR"
                  count={JSON.parse(sessionStorage.getItem("returns")).CAGR}
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
                  title="초기 자산"
                  count={JSON.parse(sessionStorage.getItem("table")).with_tlh[0]}
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
                  title="현재 자산"
                  count={JSON.parse(sessionStorage.getItem("table")).with_tlh[1]}
                  percentage={{
                    color: "success",
                    amount: "0.9%",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="error"
                  icon="weekend"
                  title="절세 금액"
                  count={tax}
                  percentage={{
                    color: "error",
                    amount: tax,
                    label: "원의 세금이 절약되는 효과",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="error"
                  icon="leaderboard"
                  title="수익 효과"
                  count={profit}
                  percentage={{
                    color: "error",
                    amount: profit,
                    label: "원의 수익이 창출되는 효과",
                  }}
                />
              </MDBox>
            </Grid>
            </Grid>
          <MDBox mt={4.5}>
            <MDButton variant="gradient" color="error" onClick={() => onClickNext()} fullWidth>
              2000만원을 10년간 투자하는 경우 TLH 전략을 통해  {sessionStorage.getItem('세금')} 원의 세금을 절약하여 총  {sessionStorage.getItem('수익')}의 수익을 낼 수 있습니다.
            </MDButton>
          </MDBox>
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Projects />
              </Grid>
            </Grid>
          </MDBox>
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={12}>
                <MDButton variant="gradient" color="warning" fullWidth>
                  주문 실행하기
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>

      }
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
