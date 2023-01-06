import Grid from "@mui/material/Grid";
import httpGet from "config";
import MDBox from "components/MDBox";
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/screening_str/components/Projects";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import Card from '@mui/material/Card';
import img1 from "assets/images/다이렉트인덱싱1.png";
import CardMedia from '@mui/material/CardMedia';
import axios from "axios";
import React, { useState } from "react";
import MDButton from "components/MDButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Routes, Link } from "react-router-dom";
import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider1 from './Slider';
import data from './data/areaChartData';


global.XMLHttpRequest = require("xhr2");

function Dashboard() {

console.log(data);
const theme = {
    "펀더멘탈":
    [{
      "key": "건전한 재무재표 전략지수",
      "val": "S&P500 기업 중 각 섹터별로 'Altman Z-score'점수가 가장 높은 50개 주식으로 구성. 'Altman Z-score'는 운전자본/자산 비율, 이익잉여금/자산 비율, 영업이익률, 부채비율, 매출/자산 비율로 측정. 섹터중립 비중 방식. 각 섹터 내에서는 동일가증. 섹터 배분은 리밸런싱 시점에 전체시장의 섹터 비중과 동일하게 구성. (단, 금융, 부동산, 유틸리티 섹터는 제외)"
    }],
    "기업현금 흐름":
    [{
      "key": "주주환원지수",
      "val": "분기초 시가총액 대비 이전 4개 분기 총주주 수익률(배당+자사주매입)이 가장 높은 주식 50개로 구성. 섹터내 비중은 동일 가중. 섹터 비중은 리밸런싱 시점에 전체 시장(S&P500)의 섹터 비중과 동일하게 구성"
    },
    {
      "key": "Capex와 R&D 지수",
      "val": "분기초 시가총액 대비 이전 12개월 Capex 및 R&D 투자금액의 비율이 가장 높은 50개 주식으로 구성. 섹터내 비중은 동일 가중. 섹터비중은 리밸런싱 시점에 전체 시장의 섹터 비중과 동일하게 구성. 단 금융 섹터와 부동산 섹터는 제외"
    }],
//    "매크로지표":
//    [{
//      "key": "인플레이션 수혜기업지수",
//      "val": "인플레이션이 높을수록 수혜를 본 상위 50개의 기업 선별"
//    },
//    {
//      "key": "인플레이션 피해기업지수",
//      "val": "인플레이션이 높을수록 언더퍼폼 한 하위 50개의 기업 선별"
//    }]
}

Object.keys(theme).map((val, idx)=>
console.log('key:',val)

)
console.log(Object.keys(theme));
 const theme_explain = {
      "건전한 재무재표 전략지수": "S&P500 기업 중 각 섹터별로 'Altman Z-score'점수가 가장 높은 50개 주식으로 구성. 'Altman Z-score'는 운전자본/자산 비율, 이익잉여금/자산 비율, 영업이익률, 부채비율, 매출/자산 비율로 측정. 섹터중립 비중 방식. 각 섹터 내에서는 동일가증. 섹터 배분은 리밸런싱 시점에 전체시장의 섹터 비중과 동일하게 구성. (단, 금융, 부동산, 유틸리티 섹터는 제외)",
      "주주환원지수": "분기초 시가총액 대비 이전 4개 분기 총주주 수익률(배당+자사주매입)이 가장 높은 주식 50개로 구성. 섹터내 비중은 동일 가중. 섹터 비중은 리밸런싱 시점에 전체 시장(S&P500)의 섹터 비중과 동일하게 구성",
      "Capex와 R&D 지수":"분기초 시가총액 대비 이전 12개월 Capex 및 R&D 투자금액의 비율이 가장 높은 50개 주식으로 구성. 섹터내 비중은 동일 가중. 섹터비중은 리밸런싱 시점에 전체 시장의 섹터 비중과 동일하게 구성. 단 금융 섹터와 부동산 섹터는 제외"
    }
 const [theme2, setTheme2] = useState(["theme2"]);
 const [theme3, setTheme3] = useState(["theme3"]);

// const factor_list = ['growth', 'liquidity', 'price_mom', 'quality', 'sentiment', 'size', 'value', 'volatility'];
// const factors = [{one:'growth', two:'liquidity'}, {one:'price_mom', two:'quality'}, {one:'sentiment', two:'size'}, {one:'value', two:'volatility'}];

 let width = 0;
 if (theme2.length>10){
    console.log('bigger');
    width = 1.2;
 }
 else {
    width = 12/theme2.length;
 }
 const animatedComponents = makeAnimated();
 let selectList1= [1];
 let selectList2= [1];
 sessionStorage.setItem("sector", selectList1)
 sessionStorage.setItem("theme", selectList2)
 const [selected1, setSelected1] = useState(selectList1);
 const [selected2, setSelected2] = useState(selectList2);
 const [open, setOpen] = React.useState(false);
// const [open1, setOpen1] = React.useState(false);
 const [open2, setOpen2] = React.useState(false);
 const [open3, setOpen3] = React.useState(false);
 const [open4, setOpen4] = React.useState(false);
 const [port, setPort] = React.useState(false);
 const [sale, setSale] = React.useState(false);
 const [smalls, setSmalls] = React.useState(false);
 const [portn, setPortn] = React.useState(false);
 const [popular, setPopular] = React.useState(false);
 const [rmticker, setRmticker] = React.useState([]);
 const [factor, setFactor] = React.useState({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0});

 console.log(port);


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

// const popular = ['그린-스마트그리드', '기타-반려동물', '디지털-반도체', '바이오-바이오텍', '인플레이션-인프라'];
 const popularCol = ['수익률(1개월)', '수익률(3개월)', '수익률(6개월)','이익추정치(1개월)','이익추정치(3개월)'];
 const options1 = [
    { value: 1, label: "한국" },
  ];
  const options2 = [
    { value: 1, label: "친환경 투자" },
  ];

 const onClickNextNew3 = event => {
    console.log(event.target.innerText)
    const rank = httpGet(`/sort_ranking/${event.target.innerText}`);
    console.log(rank.rank);
    sessionStorage.setItem("rank", JSON.stringify(rank))
    setPopular(rank)
  };
 const onClickNextNew2 = event => {

    console.log(event.target.innerText)
    const Pports = event.target.innerText.split('-');
    console.log(Pports)
    sessionStorage.setItem("DI_1", Pports[0])
    sessionStorage.setItem("DI_2", Pports[1]);

  };

    function onClickNextNew(e) {
   const small = httpGet(`/screen_DI_str/${sessionStorage.getItem("DI_1")}_111`)
    setOpen2(true);
    console.log('next를 누르셨습니다.');
  const xtick = [];
  setPort(small.area);
  setPortn(small.portn);
  sessionStorage.setItem('portn', small.portn);
  sessionStorage.setItem('portn_select', 50);
  sessionStorage.setItem("area", JSON.stringify(small.area));
  setRmticker([]);
  sessionStorage.setItem('factor', JSON.stringify({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0}));
  setFactor({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0});
  sessionStorage.setItem('rmticker', JSON.stringify([]));
  sessionStorage.setItem('rmticker_str', '111');
  setSmalls(small);
  console.log(JSON.parse(sessionStorage.getItem('rmticker')))
  console.log(typeof(JSON.parse(sessionStorage.getItem('rmticker'))))

//  const secEX=httpGet(`/sec_ex_DI/${sessionStorage.getItem("DI_2")}`).ex
//  const facEX=httpGet(`/fac_ex_DI`).ex
//  sessionStorage.setItem('secEX', secEX);
//  sessionStorage.setItem('facEX', JSON.stringify(facEX));

  }
   function onClickNext(e) {
    const ranks = httpGet(`/sort_ranking/수익률(1개월)`);
    sessionStorage.setItem("rank", JSON.stringify(ranks))
    setPopular(ranks)
    setOpen(true);
    console.log('next를 누르셨습니다.');
    console.log(open);

  }
    function onClickNext1(e) {
//    setOpen1(true);
    setOpen2(true);
    console.log('next를 누르셨습니다.');
//    console.log(open1);
    const big = sessionStorage.getItem("DI_1")
    const small = httpGet(`/screen_DI_str/${sessionStorage.getItem("DI_1")}_111`)
  const xtick = [];
  setPort(small.area);
  setPortn(small.portn);
  sessionStorage.setItem('portn', small.portn);
  sessionStorage.setItem('portn_select', 50);
  sessionStorage.setItem("area", JSON.stringify(small.area));
  setRmticker([]);
  sessionStorage.setItem('factor', JSON.stringify({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0}));
  setFactor({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0});
  sessionStorage.setItem('rmticker', JSON.stringify([]));
  sessionStorage.setItem('rmticker_str', '111');
  setSmalls(small);
  console.log(JSON.parse(sessionStorage.getItem('rmticker')))
  console.log(typeof(JSON.parse(sessionStorage.getItem('rmticker'))))


  }
  function onClickNext2(e) {
   const small = httpGet(`/screen_DI_str/${sessionStorage.getItem("DI_1")}_111`)
    setOpen2(true);
    console.log('next를 누르셨습니다.');
  const xtick = [];
  setPort(small.area);
  setPortn(small.portn);
  sessionStorage.setItem('portn', small.portn);
  sessionStorage.setItem('portn_select', 50);
  sessionStorage.setItem("area", JSON.stringify(small.area));
  setRmticker([]);
  sessionStorage.setItem('factor', JSON.stringify({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0}));
  setFactor({0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0});
  sessionStorage.setItem('rmticker', JSON.stringify([]));
  sessionStorage.setItem('rmticker_str', '111');
  setSmalls(small);
  console.log(JSON.parse(sessionStorage.getItem('rmticker')))
  console.log(typeof(JSON.parse(sessionStorage.getItem('rmticker'))))

  const secEX=httpGet(`/sec_ex_DI/${sessionStorage.getItem("DI_2")}`).ex
  const facEX=httpGet(`/fac_ex_DI`).ex
  sessionStorage.setItem('secEX', secEX);
  sessionStorage.setItem('facEX', JSON.stringify(facEX));


  }
  function onClickOPT(e) {
  const opt = httpGet(`/OptimalScore/${sessionStorage.getItem("DI_2")}`);
  console.log(opt.score);
  console.log(opt.score[0]);
  sessionStorage.setItem('factor', JSON.stringify({0:opt.score[0], 1:opt.score[1], 2:opt.score[2], 3:opt.score[3], 4:opt.score[4], 5:opt.score[5], 6:opt.score[6], 7:opt.score[7]}));
      let factor_s = JSON.parse(sessionStorage.getItem("factor"))
    console.log(factor_s)
    let rmticker_str = sessionStorage.getItem("rmticker_str")
    const area_update = httpGet(`/screen_DI/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}_${factor_s[0]}I${factor_s[1]}I${factor_s[2]}I${factor_s[3]}I${factor_s[4]}I${factor_s[5]}_${rmticker_str}`).area // _${rmticker_str}
    console.log(area_update)
    setPort(area_update);
    sessionStorage.setItem("area", JSON.stringify(area_update));
  }

 function onClickNext3(e) {
    setOpen3(true);
    console.log('next를 누르셨습니다.');
    let factor_s = JSON.parse(sessionStorage.getItem("factor"));
    let rmticker_str = sessionStorage.getItem("rmticker_str");
    console.log(factor_s);
    console.log(rmticker_str);
    const finalPort = httpGet(`/finalPort_DI_str/${sessionStorage.getItem("DI_1")}_${rmticker_str}_${sessionStorage.getItem('portn_select')}`)

    sessionStorage.setItem("fianl_port", JSON.stringify(finalPort))
    sessionStorage.setItem("universe_str", JSON.stringify(finalPort.universe))
    console.log(finalPort);
    let xtick = [];
    for (let i=0; i<finalPort.date.length; i+=1){
      xtick.push(0)
      }
      const sales = {
        labels:  finalPort.date,
        datasets: [{ label: "PORT", data: finalPort.rtn, color: "error", pointRadius:1, borderWidth:2  },
        { label: finalPort.bm_nm, data: finalPort.rtn_bm, color: "warning", pointRadius:1, borderWidth:2 },
        { label: "기준선", data: xtick, color: "secondary", pointRadius:0, borderWidth:2 }
        ]
      };
      console.log(sales);
      setSale(sales);
      sessionStorage.setItem("tot_rtn", finalPort.tot_rtn);

//    const finalPort = httpGet(`/small_di_org/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}`);

  }
  function handleChange(e) {
    console.log(e.target.value);
    setPortn(e.target.value);
    sessionStorage.setItem('portn_select', e.target.value);
  }
  function handleChange_factor(e,idx) {
    console.log(idx);
    console.log(e);
    console.log(e.target.value);
    let factor_s = JSON.parse(sessionStorage.getItem("factor"))
    factor_s[idx] = e.target.value*10;
    setFactor(factor_s);
    console.log(factor_s)
    sessionStorage.setItem("factor", JSON.stringify(factor_s))
  }


    function valuetext(value: number) {
  return `${value}개`;
    }

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
       <MDBox mt={3}>
       <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="펀더멘탈" percentage={{
                  color: "error",
                  amount: "펀더멘탈",
                  label: "으로 유니버스 구성하기",
                }}/>
            </MDBox>
        </Grid>
        <Grid item xs={6} md={6} lg={6}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="기업현금 흐름" percentage={{
                  color: "error",
                  amount: "기업현금흐름",
                  label: "으로 유니버스 구성하기",
                }}/>
            </MDBox>
        </Grid>
        {/*<Grid item xs={4} md={4} lg={4}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="매크로지표" percentage={{
                  color: "error",
                  amount: "매크로지표",
                  label: "으로 유니버스 구성하기",
                }}/>
            </MDBox>
        </Grid>*/}
        </Grid>
        </MDBox>

       <MDBox mt={4.5}>
          <MDButton variant="gradient" color="success" onClick={() => onClickNext()} fullWidth>
            NEXT
          </MDButton>
        </MDBox>
      {open===false?
         <MDBox mt={3} />
      :
      (<MDBox mt={3}>
      <Grid container spacing={3}>
        {theme[sessionStorage.getItem("포트폴리오 타입")].map((dict, val)=>
        <Grid item xs={12/theme[sessionStorage.getItem("포트폴리오 타입")].length} md={12/theme[sessionStorage.getItem("포트폴리오 타입")].length} lg={12/theme[sessionStorage.getItem("포트폴리오 타입")].length}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="3" color="success" icon="weekend" count={dict.key} percentage={{
                  color: "error",
                  amount: dict.val,
                  label: " ",
                }}/>
            </MDBox>
        </Grid>
        )}
        </Grid>
        <MDBox mt={4.5}>
              <MDButton variant="gradient" color="success" onClick={() => onClickNext1()} fullWidth>
                NEXT
              </MDButton>
        </MDBox>
        </MDBox>)
      }
      {open2===true &&
          <MDBox mt={1}>
        <MDBox mt={0.5}>
          <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
              <MDButton variant="gradient" color="dark" fullWidth>
                ({sessionStorage.getItem("DI_1")})을/를 선택하셨습니다.
              </MDButton>
            </Grid>
        <Grid item xs={12} md={12} xl={12}>
              <DefaultProjectCard
                image=""
                label=""
                title={sessionStorage.getItem("DI_1")}
                description={theme_explain[sessionStorage.getItem("DI_1")]}
                size="large"
                component="text"
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
             <div style={{height: 400}}>
              <ResponsiveTreeMapHtml
                onClick={(e) => {
                let areaPort = JSON.parse(sessionStorage.getItem("area"));
                console.log(areaPort);
                console.log(e);
                console.log(e.id);
                console.log(e.path.split('.'));
                let rmtickerS = JSON.parse(sessionStorage.getItem('rmticker'));
                console.log(rmtickerS);
                let rmtickerstrS = sessionStorage.getItem('rmticker_str');
                for (let i = 0; i<areaPort.children.length; i++){
                    if (areaPort.children[i].name === e.path.split('.')[1]){
                        console.log(Object.keys(areaPort.children[i]));
                        console.log(areaPort.children[i].children);
                        console.log(areaPort.children[i].children.length);
                        if (e.path.split('.').length === 2) {
                         for (let j = 0; j<areaPort.children[i].children.length; j++){
                            rmtickerS.push(areaPort.children[i].children[j]);
                            console.log(areaPort.children[i].children[j].name)
                            rmtickerstrS += areaPort.children[i].children[j].name+'111'
                            let portnS = sessionStorage.getItem('portn')-1;
                            sessionStorage.setItem('portn',portnS)
                            console.log(rmtickerstrS);
                            setRmticker(rmtickerS);
                            console.log(rmtickerS);
                         }
                            areaPort.children.splice(i,1);
                            setPort(areaPort);
                            sessionStorage.setItem("area",JSON.stringify(areaPort));
                            console.log(areaPort);
                            console.log(areaPort.children[i]);
                        } else{
                            for (let j = 0; j<areaPort.children[i].children.length; j++){
                                if (areaPort.children[i].children[j].name === e.path.split('.')[2]){
                                    rmticker.push(areaPort.children[i].children[j]);
                                    rmtickerstrS += areaPort.children[i].children[j].name+'111'
                                    areaPort.children[i].children.splice(j, 1);
                                    console.log('REMOVE:: ',areaPort.children[i].children);
                                    console.log('REMOVE:: ',areaPort);
                                    setPort(areaPort);
                                    sessionStorage.setItem("area",JSON.stringify(areaPort));
                                    let portnS = sessionStorage.getItem('portn')-1;
                                    sessionStorage.setItem('portn',portnS)
                                    console.log(areaPort.children[i].children[j].name)
                                    console.log(e.path.split('.')[2])
                                    setRmticker(rmticker);
                                    console.log(rmtickerstrS);
                         }}}}}
                         console.log('rmtickerS',rmtickerS)
                         sessionStorage.setItem('rmticker', JSON.stringify(rmtickerS));
                         sessionStorage.setItem('rmticker_str', rmtickerstrS);
                         if (sessionStorage.getItem('portn')<sessionStorage.getItem('portn_select')){
                            sessionStorage.setItem('portn_select',sessionStorage.getItem('portn'))
                         }
                         }}
                label="id"
                data={port}
                identity="name"
                value="loc"
                valueFormat=".02s"
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                labelSkipSize={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [['darker',2 ]]
                }}
                parentLabelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 3]]
                }}
                colors={{ scheme: 'yellow_green' }}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.1]]
                }}
            />
            </div>
            <Grid container spacing={3}>
             { rmticker.map((ticker, idx)=>
            <Grid item xs={1} md={1} lg={1}>
          <MDButton variant="gradient" color="dark" fullWidth>
            {ticker.name}
          </MDButton>
          </Grid>
          )}
           </Grid>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
          <Grid item xs={0.5} md={0.5} lg={0.5}>
          </Grid>
          <Grid item xs={3} md={3} lg={3}>
          <MDButton variant="gradient" color="error" fullWidth>
            포트폴리오에 편입할 종목 수 선택 (최소 30개, 최대 {sessionStorage.getItem('portn')})
          </MDButton>
          </Grid>

        <Grid item xs={3} md={3} lg={3}>
          <Slider
            onChange={(e) => handleChange(e)}
            aria-label="Small steps"
//            sessionStorage.getItem("portn")
            defaultValue={50}
            getAriaValueText={valuetext}
            step={1}
            marks
            min={30}
            max={sessionStorage.getItem("portn")}
            valueLabelDisplay="auto"
          />
          </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MDButton variant="gradient" color="error" fullWidth>
            {sessionStorage.getItem("portn_select")} 개 선택
          </MDButton>
        </Grid>
        </Grid>
        </MDBox>


        </MDBox>
        <MDBox>

          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <MDBox mt={4.5}>
                  <MDButton variant="gradient" color="success" onClick={() => onClickNext3()} fullWidth>
                    NEXT
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
      }
      {open3 && <MDBox mb={3}>
        <ReportsLineChart
          color="success"
          title="수익률"
          description={
            <>
              전 기간 백테스트 수익률은 <strong>{sessionStorage.getItem("tot_rtn")}%</strong> 입니다.
            </>
          }
          date="updated 4 min ago"
          chart={sale}
        />
        <MDBox mt={4.5} />
       <Grid container spacing={3}>
        <Grid item xs={3} md={3} lg={3}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="연평균 수익률" percentage={{
                  color: "error",
                  amount: JSON.parse(sessionStorage.getItem("fianl_port")).CAGR,
                  label: "",
                }}/>
            </MDBox>
        </Grid>
        <Grid item xs={3} md={3} lg={3}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="연평균 Sharpe Ratio" percentage={{
                  color: "error",
                  amount: JSON.parse(sessionStorage.getItem("fianl_port")).SHR,
                  label: "",
                }}/>
            </MDBox>
        </Grid>
        <Grid item xs={3} md={3} lg={3}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="연평균 변동성" percentage={{
                  color: "error",
                  amount: JSON.parse(sessionStorage.getItem("fianl_port")).STD,
                  label: "",
                }}/>
            </MDBox>
        </Grid>
        <Grid item xs={3} md={3} lg={3}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="5" color="success" icon="weekend" count="평균 Turnover" percentage={{
                  color: "error",
                  amount: JSON.parse(sessionStorage.getItem("fianl_port")).TURNOVER,
                  label: "",
                }}/>
            </MDBox>
        </Grid>
        </Grid>

        <MDBox mt={4.5}>
        <Projects />
        </MDBox>
     <MDBox mt={4.5}>
          <MDButton variant="gradient" color="success" fullWidth>
            주문 실행하기
          </MDButton>
        </MDBox>
      </MDBox>
    }

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

//시뮬레이션에 필요한 데이터 목록
//1.	시뮬레이션용 전처리가 끝난 최종 모델링 데이터 – data/model_dat.xlsx
//2.	벤치마크 데이터 – bm_raw.xlsx
//3.	종목 일간 수익률데이터 data/indv/rtn.xlsx

//시뮬레이션 스크립트 – script/gs_basket_sim2.Rmd (gs_basket_sim은 버퍼룰이 없는 과거 결과입니다.)
//커스텀 라이브러리를 사용하고 있기 때문에 코드를 다시 돌려보실 경우 주석처리된 15, 16번째 주석처리 된 코드를 실행시켜서 패키지를 받아주셔야 합니다.
//
//시뮬레이션 로직
//1.	데이터에서 제외할 섹터를 반영하여 최종 데이터 확정 – 종목 비중 및 섹터 비중 다시 Normalize
//2.	섹터별 종목 수 = Max(50종목 * 섹터비중, 1). 만약 합계가 50종목을 넘을 경우 섹터 비중이 가장 큰 섹터에서 선택 종목수를 가감.
//3.	버퍼를 적용하여 섹터별 종목 선택
//A.	해당 종목이 이전 리밸런싱 시점에 포함된 종목일 경우, 이번 리밸런싱 시기 랭크가 섹터 종목 수 * 1.25 안에 들 경우 편입을 유지
//B.	신규 종목 수 = (섹터 종목 수 – 편입 유지 종목수). 신규 종목 수 만큼 랭크 순위대로 추가 선택

// 전체 유니버스 - 펀더멘탈은 부동산, 금융, 유틸리티 제외