import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MAsolution1 from "layouts/masolution1";
import MAsolution2 from "layouts/masolution2";
import { Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import MDButton from "components/MDButton";
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import Projects from "layouts/masolution2/components/Projects";
import Projects2 from "layouts/masolution2/components/Projects2";
import OrdersOverview from "layouts/masolution2/components/OrdersOverview";
import httpGet from "config";


function Dashboard() {
  const [port, setPort] = useState("1");
  const [start1, setStart1] = React.useState(false);
  const [start2, setStart2] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  sessionStorage.setItem("selected1", false);
  sessionStorage.setItem("selected2", false);
  if (start1===false){
    sessionStorage.setItem("port1", "변동성");
    sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
    setStart1(true);
  }
  window.addEventListener("port1", () => {
    const portfolio1 = sessionStorage.getItem("port1");
    console.log("change to local storage!");
    let portnm = "미래변동성공격1";
    if (portfolio1 === "변동성") {
      setPort("1");
      portnm = "미래변동성공격1";
    } else if (portfolio1 === "초개인로보") {
      setPort("2");
      portnm = "미래초개인로보적극1";
    } else if (portfolio1 === "테마로테션") {
      setPort("3");
      portnm = "미래테마로테션공격1";
    } else if (portfolio1 === "멀티에셋인컴") {
      setPort("4");
      portnm = "미래멀티에셋인컴공1";
    } else if (portfolio1 === "AI 미국주식 투자") {
      setPort("5");
      portnm = "미래에셋AI크로스알파";
    }
    localStorage.setItem("port", portnm);
  });
  const algos = [
  {title:'변동성 알고리즘', color: 'dark', subtitle:"국내 / ETF", val:'25%', icon:"weekend" },
  {title:'초개인화 자산관리', color: 'info', subtitle:"국내외 / ETF", val:'+31%', icon:"leaderboard" },
  {title:'테마 로테이션', color: 'success', subtitle:"해외 / ETF", val:'+13%', icon:"store" },
  {title:'멀티에셋 인컴', color: 'primary', subtitle:"다양한 인컴 자산", val:'+16%', icon:"person_add" },
  ];
//  function onClickNext(e) {
//    setOpen1(true);
//    console.log('next를 누르셨습니다.');
//    console.log(open1);
//  }
  /// //////////////////////////////////////////////////////////////////////////////////////////
  function onClickNext(e) {
    setOpen1(true);
    console.log('next를 누르셨습니다.');
    console.log(open1);
  }
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
  const color = ["error", "warning", "success", "info"];
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
    if (sessionStorage.getItem("selected2") === "false") {
      setComponent(MAsolution1);
      setPath("/masolution1");
      console.log("same");
    }
  }
  function onClickNext2(e) {
    setOpen2(true);
    console.log('next를 누르셨습니다.');
    console.log(open2);
  }
  /// //////////////////////////////////////////////////////////////////////////////////////////
  console.log(httpGet("/strategy")[sessionStorage.getItem("port1")]);
  if (start2 === false){
  sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
  setStart2(true);
  }
  const returns = httpGet(
    "/returns/".concat(sessionStorage.getItem("port1"), "_", sessionStorage.getItem("port2"))
  );
  const std = returns.std.toFixed(4);
  const xtick = [];
  for (let i=0; i<returns.returns.length; i+=1){
  xtick.push(0)
  }
  console.log(xtick);

  const sales = {
    labels: returns.date,
    datasets: [{ label: "수익률", data: returns.returns,color: "error", pointRadius:1, borderWidth:2 },
    { label: "기준선", data: xtick, color: "secondary", pointRadius:0, borderWidth:1 }],
  };
  console.log(sessionStorage.getItem("port1"));
  console.log(sessionStorage.getItem("port2"));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>

         {algos.map(algo =>
         <Grid item xs={9.6} md={4.8} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color={algo.color}
                icon="weekend"
                count={algo.title}
                title={algo.subtitle}
                solutionNum="1"
                percentage={{
                  color:"success",
                  amount: algo.val,
                  label: "설정일 이후",
                }}
              />
            </MDBox>
          </Grid>)}

        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={15} md={15} xl={12}>
              <DefaultProjectCard image={port} label="" title="" description="" size="large" />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox>
          <MDBox mt={4.5}>
              <MDButton variant="gradient" color="warning" onClick={() => onClickNext()} fullWidth>
                NEXT
              </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>



      { open1===true &&
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
            <MDButton variant="gradient" color="warning" onClick={() => onClickNext2()} fullWidth>
              NEXT
            </MDButton>
        </MDBox>
      </MDBox> }


      { open2===true &&
      <MDBox py={3}>
      <MDButton variant="gradient" color="dark" fullWidth>
          {sessionStorage.getItem("port2")}이 선택되었습니다.
        </MDButton>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="수익률"
                  description={
                    <>
                      전 기간 백테스트 수익률은 <strong>{returns.returns.at(-1)}%</strong> 입니다.
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
                  count={std}
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
              <Grid item xs={12} md={6} lg={8}>
                <Projects />
                <MDBox mt={4.5}>
                  <MDButton variant="gradient" color="warning" fullWidth>
                    주문 실행하기
                  </MDButton>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <OrdersOverview />
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
