import Grid from "@mui/material/Grid";
import httpGet from "config";
import MDBox from "components/MDBox";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import StraightIcon from '@mui/icons-material/Straight';
import Typography from '@mui/material/Typography';
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/screening4/components/Projects";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import img1 from "assets/images/다이렉트인덱싱1.png";
import CardMedia from '@mui/material/CardMedia';
import axios from "axios";
import React, { useState } from "react";
import MDButton from "components/MDButton";
import { ResponsiveHeatMap } from '@nivo/heatmap'
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Routes, Link } from "react-router-dom";
import Text from 'react-text';
import { ResponsiveBar } from '@nivo/bar'
import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import Slider from '@mui/material/Slider';
import Slider1 from './Slider';
import data from './data/areaChartData';



global.XMLHttpRequest = require("xhr2");

function Dashboard() {
let data1 = httpGet(`/make_corr_heatmap/`).data;

const data2 = [
  {
    "country": "AD",
    "hot dog": 121,
    "hot dogColor": "hsl(52, 70%, 50%)",
    "burger": 127,
    "burgerColor": "hsl(120, 70%, 50%)",
    "sandwich": 172,
    "sandwichColor": "hsl(111, 70%, 50%)",
    "kebab": 57,
    "kebabColor": "hsl(239, 70%, 50%)",
    "fries": 44,
    "friesColor": "hsl(25, 70%, 50%)",
    "donut": 45,
    "donutColor": "hsl(190, 70%, 50%)"
  },
  {
    "country": "AE",
    "hot dog": 40,
    "hot dogColor": "hsl(44, 70%, 50%)",
    "burger": 66,
    "burgerColor": "hsl(94, 70%, 50%)",
    "sandwich": 27,
    "sandwichColor": "hsl(85, 70%, 50%)",
    "kebab": 133,
    "kebabColor": "hsl(86, 70%, 50%)",
    "fries": 94,
    "friesColor": "hsl(277, 70%, 50%)",
    "donut": 104,
    "donutColor": "hsl(357, 70%, 50%)"
  },
  {
    "country": "AF",
    "hot dog": 4,
    "hot dogColor": "hsl(150, 70%, 50%)",
    "burger": 107,
    "burgerColor": "hsl(6, 70%, 50%)",
    "sandwich": 196,
    "sandwichColor": "hsl(292, 70%, 50%)",
    "kebab": 133,
    "kebabColor": "hsl(24, 70%, 50%)",
    "fries": 108,
    "friesColor": "hsl(201, 70%, 50%)",
    "donut": 62,
    "donutColor": "hsl(239, 70%, 50%)"
  },
  {
    "country": "AG",
    "hot dog": 44,
    "hot dogColor": "hsl(231, 70%, 50%)",
    "burger": 2,
    "burgerColor": "hsl(296, 70%, 50%)",
    "sandwich": 85,
    "sandwichColor": "hsl(110, 70%, 50%)",
    "kebab": 5,
    "kebabColor": "hsl(251, 70%, 50%)",
    "fries": 107,
    "friesColor": "hsl(194, 70%, 50%)",
    "donut": 75,
    "donutColor": "hsl(183, 70%, 50%)"
  },
  {
    "country": "AI",
    "hot dog": 40,
    "hot dogColor": "hsl(214, 70%, 50%)",
    "burger": 77,
    "burgerColor": "hsl(359, 70%, 50%)",
    "sandwich": 60,
    "sandwichColor": "hsl(308, 70%, 50%)",
    "kebab": 129,
    "kebabColor": "hsl(212, 70%, 50%)",
    "fries": 165,
    "friesColor": "hsl(280, 70%, 50%)",
    "donut": 121,
    "donutColor": "hsl(152, 70%, 50%)"
  },
  {
    "country": "AL",
    "hot dog": 76,
    "hot dogColor": "hsl(53, 70%, 50%)",
    "burger": 69,
    "burgerColor": "hsl(205, 70%, 50%)",
    "sandwich": 41,
    "sandwichColor": "hsl(308, 70%, 50%)",
    "kebab": 79,
    "kebabColor": "hsl(359, 70%, 50%)",
    "fries": 113,
    "friesColor": "hsl(175, 70%, 50%)",
    "donut": 120,
    "donutColor": "hsl(197, 70%, 50%)"
  },
  {
    "country": "AM",
    "hot dog": 16,
    "hot dogColor": "hsl(48, 70%, 50%)",
    "burger": 141,
    "burgerColor": "hsl(144, 70%, 50%)",
    "sandwich": 3,
    "sandwichColor": "hsl(194, 70%, 50%)",
    "kebab": 77,
    "kebabColor": "hsl(241, 70%, 50%)",
    "fries": 171,
    "friesColor": "hsl(349, 70%, 50%)",
    "donut": 72,
    "donutColor": "hsl(331, 70%, 50%)"
  }
];
 console.log(data1);
 const theme = httpGet(`/big_di/`).count;
 const [theme2, setTheme2] = useState(["theme2"]);
 const [theme3, setTheme3] = useState(["theme3"]);
 const [corr, setCorr] = useState(data1);
 const [corrS, setCorrS] = useState(800);
 const popular = ['그린-스마트그리드', '기타-반려동물', '디지털-반도체', '바이오-바이오텍', '인플레이션-인프라'];

 const factor_list = ['growth', 'liquidity', 'price_mom', 'quality', 'sentiment', 'size', 'value', 'volatility'];
 const factors = [{one:'growth', two:'liquidity'}, {one:'price_mom', two:'quality'}, {one:'sentiment', two:'size'}, {one:'value', two:'volatility'}];
factors.map((o,t)=>
{
console.log(o);
console.log(t);
}
)
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
 const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
  </Box>
);
 sessionStorage.setItem("sector", selectList1)
 sessionStorage.setItem("theme", selectList2)
 const [selected1, setSelected1] = useState(selectList1);
 const [selected2, setSelected2] = useState(selectList2);
 const [open1, setOpen1] = React.useState(false);
 const [open2, setOpen2] = React.useState(false);
 const [open3, setOpen3] = React.useState(false);
 const [port, setPort] = React.useState(false);
 const [sale, setSale] = React.useState(false);
 const [smalls, setSmalls] = React.useState(false);
 const [portn, setPortn] = React.useState(false);
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


 const options1 = [
    { value: 1, label: "한국" },
  ];
  const options2 = [
    { value: 1, label: "친환경 투자" },
  ];
//  function onClickNext(e) {
//    console.log(e);
//    console.log(e.target.value);
//  }
    const onClickNext = event => {

    console.log(event.target.innerText)
    const Pports = event.target.innerText.split('-');
    console.log(Pports)
    sessionStorage.setItem("DI_1", Pports[0])
    sessionStorage.setItem("DI_2", Pports[1]);

  };

  function onClickNext1(e) {
   const small = httpGet(`/screen_DI/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}_0I0I0I0I0I0_1`)
    setOpen2(true);
    console.log('next를 누르셨습니다.');
  const xtick = [];
  setPort(small.area);
  setPortn(small.portn);
  sessionStorage.setItem('portn', small.portn);
  sessionStorage.setItem('portn_select', small.portn);
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
    const finalPort = httpGet(`/finalPort_DI/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}_${factor_s[0]}I${factor_s[1]}I${factor_s[2]}I${factor_s[3]}I${factor_s[4]}I${factor_s[5]}I${factor_s[6]}I${factor_s[7]}_${rmticker_str}_${sessionStorage.getItem('portn_select')}`) // _${rmticker_str}
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

    function onClickCorrAll(num) {
    data1 = httpGet(`/make_corr_heatmap/`).data;
    setCorr(data1)
    setCorrS(800)
}
  function onClickCorr(num) {
    if (num===1){
    data1 = httpGet(`/make_corr_heatmap_col/dev`).data;
    setCorr(data1)
    console.log(data1.length)
    setCorrS((data1.length+1)*160)
    }
    else if (num===2){
    data1 = httpGet(`/make_corr_heatmap_col/inf`).data;
    setCorr(data1)
    console.log(data1.length)
    setCorrS((data1.length+1)*160)    }
    else {
    data1 = httpGet(`/make_corr_heatmap_col/usd`).data;
    setCorr(data1)
    console.log(data1.length)
    setCorrS((data1.length+1)*160)
    }
}


    function valuetext(value: number) {
  return `${value}개`;
    }

  return (
    <DashboardLayout>
      <DashboardNavbar />
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        </Typography>
        <Typography variant="h5" component="div">
          EMP 포트폴리오 직접 만들어보기
        </Typography>
        <Typography variant="body2">
          ETF 스크리닝 및 검색 / EMP 리스크 분석 / EMP 포트폴리오 최적화
        </Typography>
      </CardContent>
    </Card>
<MDBox mt={2}/>

    <Grid item xs={12} md={12} lg={12}>
    <MDBox mt={1}>
    <Button variant="primary" sx={{ color: 'yellow', backgroundColor: 'orange', borderColor: 'orange' }}>
        <Typography variant="h5" component="div" color="common.white" onClick={() => onClickCorrAll(1)}>
          GLOBAL X ETF들의 팩터 노출도
        </Typography>
    </Button>
    </MDBox>
     </Grid>
     <Grid container spacing={3}>
<Grid item xs={4} md={4} lg={4}>
    <MDBox mt={1}>
    <Button variant="primary" sx={{ color: 'red', backgroundColor: 'red', borderColor: 'orange' }} onClick={() => onClickCorr(1)}>
        <Typography variant="h6" component="div" color="common.white">
          인플레이션이 높아질때 수혜받는 ETF
        </Typography>
    </Button>
    </MDBox>
 </Grid>
 <Grid item xs={4} md={4} lg={4}>
    <MDBox mt={1}>
    <Button variant="primary" sx={{ color: 'red', backgroundColor: 'red', borderColor: 'orange' }} onClick={() => onClickCorr(2)}>
        <Typography variant="h6" component="div" color="common.white">
          달러 약세 전환시 수혜받는 ETF
        </Typography>
    </Button>
    </MDBox>
 </Grid>
 <Grid item xs={4} md={4} lg={4}>
    <MDBox mt={1}>
    <Button variant="primary" sx={{ color: 'red', backgroundColor: 'red', borderColor: 'orange' }} onClick={() => onClickCorr(3)}>
        <Typography variant="h6" component="div" color="common.white">
          성장주 성격이면서 중소형주 비중이 높은 ETF
        </Typography>
    </Button>
    </MDBox>
 </Grid>
 </Grid>
<Grid container spacing={3}>
<Grid item xs={12} md={12} lg={12}>
 <div style={{height: corrS}}>
  <ResponsiveHeatMap
        data={corr}
        margin={{ top: 90, right: 0, bottom: 60, left: 90 }}
        valueFormat=">-.2s"
        axisTop={{
            tickSize: 20,
            tickPadding: 5,
            tickRotation: -90,
            legend: 'ETF',
            legendOffset: 46
        }}
        axisRight={{
            tickSize: 20,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 70
        }}
        axisLeft={{
            tickSize: 10,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'FACTOR',
            legendPosition: 'middle',
            legendOffset: -72
        }}
        colors={{
            type: 'diverging',
            scheme: 'red_yellow_blue',
            divergeAt: 0.5,
            minValue: -1,
            maxValue: 1
        }}
        emptyColor="#555555"
        legends={[
            {
                anchor: 'bottom',
                translateX: 0,
                translateY: 30,
                length: 400,
                thickness: 8,
                direction: 'row',
                tickPosition: 'after',
                tickSize: 15,
                tickSpacing: 20,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: 'Value →',
                titleAlign: 'start',
                titleOffset: 4
            }
        ]}
    />

</div>
 </Grid>
</Grid>



 <Grid item xs={12} md={12} lg={12}>
 <div style={{height: 400}}>
 <ResponsiveBar
        data={data2}
        keys={[
            'hot dog',
            'burger',
            'sandwich',
            'kebab',
            'fries',
            'donut'
        ]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function(e){return e.id+": "+e.formattedValue+" in country: "+e.indexValue}}
    />
  </div>
 </Grid>


      <MDBox py={1}>
        <MDBox mt={4.5}>
              <MDButton variant="gradient" color="success" onClick={() => onClickNext1()} fullWidth>
                선택한 유니버스에 바로 투자하기
              </MDButton>
        </MDBox>


          {open2===true &&
          <MDBox py={1}>
        <MDBox mt={0.5}>
          <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
              <MDButton variant="gradient" color="dark" fullWidth>
               대분류로 ({sessionStorage.getItem("DI_1")})을/를 중분류로 ({sessionStorage.getItem("DI_2")})을/를 선택하셨습니다.
              </MDButton>
            </Grid>
        <Grid item xs={12} md={12} xl={12}>
              <DefaultProjectCard
                image=""
                label=""
                title={sessionStorage.getItem("DI_1")+'-'+sessionStorage.getItem("DI_2")}
                description={sessionStorage.getItem('secEX')}
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
            포트폴리오에 편입할 종목 수 선택 (최대 {sessionStorage.getItem('portn')})
          </MDButton>
          </Grid>

        <Grid item xs={3} md={3} lg={3}>
          <Slider
            onChange={(e) => handleChange(e)}
            aria-label="Small steps"
            defaultValue={sessionStorage.getItem("portn")}
            getAriaValueText={valuetext}
            step={1}
            marks
            min={1}
            max={sessionStorage.getItem("portn")}
            valueLabelDisplay="auto"
          />
          </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MDButton variant="gradient" color="error" fullWidth>
            {sessionStorage.getItem("portn_select")} 개 선택
          </MDButton>
        </Grid>
        <Grid item xs={1} md={1} lg={1}/>
        <Grid item xs={2} md={2} lg={2}>
          <MDButton variant="gradient" color="success" onClick={() => onClickOPT()} fullWidth>
            스코어 최적화하기
          </MDButton>
        </Grid>
        </Grid>
        </MDBox>



    {factors.map((factor, idx)=>
     <MDBox mt={4.5}>
        <Grid container spacing={3}>
          <Grid item xs={2.5} md={2.5} lg={2.5}>
          <MDButton variant="gradient" color="warning" fullWidth>
            {factor.one}
          </MDButton>
          </Grid>
        <Grid item xs={2.5} md={2.5} lg={2.5}>
          <Slider
            onChange={(e) => handleChange_factor(e, idx*2)}
            onChangeCommitted={(e) => {
                let factor_s = JSON.parse(sessionStorage.getItem("factor"))
                console.log(factor_s)
                let rmticker_str = sessionStorage.getItem("rmticker_str")
                const area_update = httpGet(`/screen_DI/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}_${factor_s[0]}I${factor_s[1]}I${factor_s[2]}I${factor_s[3]}I${factor_s[4]}I${factor_s[5]}I${factor_s[6]}I${factor_s[7]}_${rmticker_str}`).area // _${rmticker_str}
                console.log(area_update)
                setPort(area_update);
                sessionStorage.setItem("area", JSON.stringify(area_update));
                }}
            aria-label="Default"
            defaultValue={JSON.parse(sessionStorage.getItem("factor"))[idx*2]*0.1}
            getAriaValueText={valuetext}
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay="auto"
          />
          </Grid>
        <Grid item xs={2} md={2} lg={2} />

        <Grid item xs={2.5} md={2.5} lg={2.5}>
          <MDButton variant="gradient" color="warning" fullWidth>
            {factor.two}
          </MDButton>
          </Grid>
        <Grid item xs={2.5} md={2.5} lg={2.5}>
          <Slider
            onChange={(e) => handleChange_factor(e, idx*2+1)}
            onChangeCommitted={(e) => {
                let factor_s = JSON.parse(sessionStorage.getItem("factor"))
                console.log(factor_s)
                let rmticker_str = sessionStorage.getItem("rmticker_str")
                const area_update = httpGet(`/screen_DI/${sessionStorage.getItem("DI_1")}_${sessionStorage.getItem("DI_2")}_${factor_s[0]}I${factor_s[1]}I${factor_s[2]}I${factor_s[3]}I${factor_s[4]}I${factor_s[5]}_${rmticker_str}`).area // _${rmticker_str}
                console.log(area_update)
                setPort(area_update);
                sessionStorage.setItem("area", JSON.stringify(area_update));
                }}
            aria-label="Default"
            defaultValue={JSON.parse(sessionStorage.getItem("factor"))[idx*2+1]*0.1}
            getAriaValueText={valuetext}
            step={0.1}
            marks
            min={0}
            max={1}
            valueLabelDisplay="auto"
          />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={5} md={5} xl={5}>
              <DefaultProjectCard
                image=""
                label=""
                title=""
                description={JSON.parse(sessionStorage.getItem('facEX'))[factor_list[idx*2]]}
                size="large"
                component="text"
              />
            </Grid>
            <Grid item xs={2} md={2} xl={2} />
            <Grid item xs={5} md={5} xl={5}>
              <DefaultProjectCard
                image=""
                label=""
                title=""
                description={JSON.parse(sessionStorage.getItem('facEX'))[factor_list[idx*2+1]]}
                size="large"
                component="text"
              />
            </Grid>
          </Grid>
       </MDBox>)}

{/*              <MDBox mb={3}>
//                <ReportsLineChart
//                  color="success"
//                  title="수익률"
//                  description={
//                    <>
//                      전 기간 백테스트 수익률은 <strong>{smalls.tot_rtn}%</strong> 입니다.
//                    </>
//                  }
//                  date="updated 4 min ago"
//                  chart={sale}
//                />
//              </MDBox> */}


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
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
