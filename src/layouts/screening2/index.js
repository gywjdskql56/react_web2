import Grid from "@mui/material/Grid";
import httpGet from "config";
import MDBox from "components/MDBox";
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/screening2/components/Projects";
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
import Slider1 from './Slider';
import data from './data/areaChartData';



global.XMLHttpRequest = require("xhr2");

function Dashboard() {

console.log(data);
 const theme = httpGet(`/big_di/`).count;
 const [theme2, setTheme2] = useState(["theme2"]);
 const [theme3, setTheme3] = useState(["theme3"]);

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
    function onClickNext1(e) {
    setOpen1(true);
    console.log('next를 누르셨습니다.');
    console.log(open1);
    const big = sessionStorage.getItem("DI_1")
    const mid = httpGet(`/medium_di/${big}`).count;
    sessionStorage.setItem("DI_2", mid.key);
    setTheme2(mid);
    setTheme3(["1"]);
    console.log(mid);
    console.log(theme2);
    console.log(theme3);
    console.log(sessionStorage.getItem("DI_2"));
    console.log(typeof(sessionStorage.getItem("DI_2")));
    console.log(mid.length);
  }
  function onClickNext2(e) {
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
        { label: "BM(S&P500)", data: finalPort.rtn_bm, color: "warning", pointRadius:1, borderWidth:2 },
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
      <MDBox py={3}>
      <Grid container spacing={3}>
        {theme.map((dict, val)=>
        <Grid item xs={12/theme.length} md={12/theme.length} lg={12/theme.length}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="3" color="success" icon="weekend" count={dict.key} percentage={{
                  color: "error",
                  amount: dict.val,
                  label: " 개의 종목",
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

     {open1===true &&

    <MDBox mt={0.5}>
    <Grid container spacing={3}>
    <Grid item xs={12} md={12} lg={12}>
      <MDBox mt={0.5}>
      <MDButton variant="gradient" color="dark" fullWidth>
        대분류로 ({sessionStorage.getItem("DI_1")})을/를 선택하셨습니다.
      </MDButton>
    </MDBox>
    </Grid>
        {theme2.map((dict,index)=>
        <Grid item xs={width} md={width} lg={width}>
            <MDBox mt={1}>
                <ComplexStatisticsCard solutionNum="4" color="success" icon="weekend" count={dict.key} percentage={{
                  color: "error",
                  amount: dict.val,
                  label: " 개의 종목",
                }}/>
            </MDBox>
        </Grid>)}
        </Grid>

        <MDBox mt={4.5}>
              <MDButton variant="gradient" color="success" onClick={() => onClickNext2()} fullWidth>
                NEXT
              </MDButton>
        </MDBox>
        </MDBox>
          }
          {open2===true &&
          <MDBox py={1}>
        <MDBox mt={0.5}>
          <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
              <MDButton variant="gradient" color="dark" fullWidth>
                중분류로 ({sessionStorage.getItem("DI_2")})을/를 선택하셨습니다.
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
          <Grid item xs={1} md={1} lg={1}>
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
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
            defaultValue={0}
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
            defaultValue={0}
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

       {/*   <Grid container spacing={3}>
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
          </Grid> */}
{/*          <MDBox mt={4.5}>
//             <Grid container spacing={3}>
//              <Grid item xs={12} md={12} lg={12}>
//                <Projects2 />
//              </Grid>
//            </Grid>
//          </MDBox> */}

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
