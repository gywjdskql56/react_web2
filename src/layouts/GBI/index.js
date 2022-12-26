import Grid from "@mui/material/Grid";
import httpGet from "config";
import MDBox from "components/MDBox";
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Slider from '@mui/material/Slider';
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/screening2/components/Projects";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import axios from "axios";
import React, { useState } from "react";
import MDButton from "components/MDButton";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Routes, Link } from "react-router-dom";
import { ResponsivePie } from '@nivo/pie'
import { ResponsiveTreeMapHtml } from '@nivo/treemap'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { SafeAreaView, StyleSheet, TextInput } from "react-native";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
 const [open, setOpen] = React.useState(false);
 const [open1, setOpen1] = React.useState(false);
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
   function onClickNext(e) {
    const ranks = httpGet(`/sort_ranking/수익률(1개월)`);
    console.log(ranks.rank);
    sessionStorage.setItem("rank", JSON.stringify(ranks))
    setPopular(ranks)
    setOpen(true);
    console.log('next를 누르셨습니다.');
    console.log(open);

  }
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
    function valuetext(value: number) {
  return `${value}개`;
    }
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
	  const options1 = [
    { value: "공격형", label: "공격형" },
    { value: "중립형", label: "중립형" },
    { value: "안정형", label: "안정형" },
  ];
  	  const options2 = [
    { value: "적립식", label: "적립식" },
    { value: "거치식", label: "거치식" },
  ];
  	  const options3 = [
    { value: "월마다", label: "monthly" },
    { value: "분기마다", label: "quarterly" },
    { value: "연마다", label: "yearly" },
  ];
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const classes = useStyles();

const useStyles1 = makeStyles({
  table: {
    minWidth: 650,
  },
});
const classes1 = useStyles1();
function createData(std, suggest, max, min) {
  return { std, suggest, max, min };
}
const rows = [
  createData('목표달성률', 6.0, 24, 4.0),
  createData('손실률', 9.0, 37, 4.3),
  createData('기대수익률', 16.0, 24, 6.0),
];
function createData_port(asset, ticker, wgt, amt) {
  return { asset, ticker, wgt, amt };
}
const rows_port = [
  createData_port('주식', 'AWCI US', '20%', '26 (백만원)'),
  createData_port('주식', 'SPY US', '20%', '26 (백만원)'),
  createData_port('채권', 'IEF US', '7%', '9.1 (백만원)'),
];

const PIEdata = [
  {
    "id": "주식",
    "label": "주식",
    "value": 60,
    "color": "hsl(249, 70%, 50%)"
  },
  {
    "id": "채권",
    "label": "채권",
    "value": 25,
    "color": "hsl(3, 70%, 50%)"
  },
  {
    "id": "대체",
    "label": "대체",
    "value": 15,
    "color": "hsl(294, 70%, 50%)"
  }
]

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
        </Typography>
        <Typography variant="h5" component="div">
        GBI 포트폴리오 직접 만들어보기
        </Typography>
        <Typography variant="body2">
          목표기반 개인 맞춤형 자산관리
        </Typography>
      </CardContent>
    </Card>
  <MDBox mt={3}>
       <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox mt={1}>
                <ComplexStatisticsCard color="error" icon="weekend" count="투자자별 목표 설정하기" percentage={{
                  color: "error",
                  amount: "목표 금액과 위험성향, 투자기간 및 방식",
                  label: "등 으로 목표 설정하기",
                }}/>
            </MDBox>
        </Grid>
        </Grid>
      </MDBox>
    <MDBox mt={4.5}>
    <Grid container spacing={3}>
   <Grid item xs={3} md={3} lg={3}>
     <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        은퇴시기
        </Typography>
        </Button>
       </form>

     <form className={classes.container} noValidate>
      <TextField
        id="date"
        label="은퇴 예정일"
        type="date"
        defaultValue="2030-12-31"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>


 </Grid>
<Grid item xs={3} md={3} lg={3}>
    <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        위험성향
        </Typography>
        </Button>
    </form>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options1}
            onChange={handleChange}
          />
</Grid>
<Grid item xs={3} md={3} lg={3}>
    <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        납입형태
        </Typography>
        </Button>
    </form>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options2}
            onChange={handleChange}
          />
</Grid>
<Grid item xs={3} md={3} lg={3}>
    <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        리밸런싱
        </Typography>
        </Button>
    </form>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={options3}
            onChange={handleChange}
          />
</Grid>
    </Grid>
    </MDBox>
    <MDBox mt={4.5}>
    <Grid container spacing={3}>
    <Grid item xs={3} md={3} lg={3}>
        <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        목표금액
        </Typography>
        </Button>
       <TextInput
        onkeyup="inputNumberFormat(this);"
        style={styles.input}
        value={0}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
    </form>
    </Grid>
    <Grid item xs={4} md={4} lg={4}>
        <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        최소 보전 희망액
        </Typography>
        </Button>
       <TextInput
        style={styles.input}
        value={0}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
    </form>
    </Grid>
    </Grid>
    </MDBox>
    <MDBox mt={4.5}>
          <MDButton variant="gradient" color="error" onClick={() => onClickNext()} fullWidth>
            NEXT
          </MDButton>
    </MDBox>


      {open===true &&

      <MDBox mt={4.5}>
       <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox mt={1}>
                <ComplexStatisticsCard color="error" icon="weekend" count="목표달성확률 도출 및 포트폴리오 선택" percentage={{
                  color: "error",
                  amount: "목표달성률, 손실률, 기대수익률",
                  label: "을 확인한 후 포트폴리오 선택하기",
                }}/>
            </MDBox>
        </Grid>
        </Grid>
        <MDBox mt={4.5}>
      <Grid container spacing={3}>
    </Grid>
    </MDBox>
<MDBox mt={4.5}>
<Grid container spacing={3}>
{/*<Grid item xs={2} md={2} lg={2}>
</Grid>*/}
    <Grid item xs={7} md={7} lg={7}>
      <TableContainer component={Paper}>
      <Table className={classes1.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    지표
                </Typography>
            </Button>
                </TableCell>
            <TableCell align="center">
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    제안
                </Typography>
            </Button>
            </TableCell>
            <TableCell align="center">
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    수익률 최대화
                </Typography>
            </Button>
            </TableCell>
            <TableCell align="center">
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    최소 수익률
                </Typography>
            </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.std}>
              <TableCell component="th" scope="row">
                <Button variant="contained" sx={{ color: '#ec42f5', backgroundColor: '#ec42f5', borderColor: '#ec42f5' }}>
                    <Typography variant="h6" component="div" color="common.white">
                        {row.std}
                    </Typography>
                </Button>
              </TableCell>
              <TableCell align="right"><Typography variant="h5" component="div" color="common.black">{row.suggest}</Typography></TableCell>
              <TableCell align="right"><Typography variant="h5" component="div" color="common.black">{row.max}</Typography></TableCell>
              <TableCell align="right"><Typography variant="h5" component="div" color="common.black">{row.min}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
</Grid>
<Grid item xs={2} md={2} lg={2}>
</Grid>
<Grid item xs={2.5} md={2.5} lg={2.5}>
<MDBox mt={4}>
        <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        초기투자액
        </Typography>
        </Button>
       <TextInput
        onkeyup="inputNumberFormat(this);"
        style={styles.input}
        value={0}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
    </form>
    <MDBox mt={4}>
        <form>
        <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
        <Typography variant="h6" component="div" color="common.white">
        월납입액 (만원)
        </Typography>
        </Button>
          <Slider
//            onChange={(e) => handleChange(e)}
            aria-label="Small steps"
            defaultValue={sessionStorage.getItem("portn")}
            getAriaValueText={valuetext}
            step={1}
            marks
            min={600}
            max={990}
            valueLabelDisplay="auto"
          />
          </form>
      </MDBox>
</MDBox>
</Grid>
<Grid item xs={1} md={1} lg={1}>
</Grid>
</Grid>
</MDBox>

        <MDBox mt={4.5}>
          <MDButton variant="gradient" color="error" onClick={() => onClickNext1()} fullWidth>
            NEXT
          </MDButton>
    </MDBox>
    </MDBox>
    }
     {open1===true &&
    <MDBox mt={4.5}>
           <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
            <MDBox mt={1}>
                <ComplexStatisticsCard color="error" icon="weekend" count="초기투자 포트폴리오" percentage={{
                  color: "error",
                  amount: "제안된 초기 포트폴리오",
                  label: " 확인하기",
                }}/>
            </MDBox>
        </Grid>
        </Grid>
    <MDBox mt={4.5}>
    <Grid container spacing={3}>

    <Grid item xs={7} md={7} lg={7}>
          <TableContainer component={Paper}>
      <Table className={classes1.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    자산군
                </Typography>
            </Button>
                </TableCell>
            <TableCell align="center">
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    티커
                </Typography>
            </Button>
            </TableCell>
            <TableCell align="center">
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    투자 비중
                </Typography>
            </Button>
            </TableCell>
            <TableCell align="center">
            <Button variant="contained" sx={{ color: '#a142f5', backgroundColor: '#a142f5', borderColor: '#a142f5' }}>
                <Typography variant="h6" component="div" color="common.white">
                    투자 금액
                </Typography>
            </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows_port.map((row) => (
            <TableRow key={row.asset}>
              <TableCell component="th" scope="row">
                <Button variant="contained" sx={{ color: '#ec42f5', backgroundColor: '#ec42f5', borderColor: '#ec42f5' }}>
                    <Typography variant="h6" component="div" color="common.white">
                        {row.asset}
                    </Typography>
                </Button>
              </TableCell>
              <TableCell align="right"><Typography variant="h5" component="div" color="common.black">{row.ticker}</Typography></TableCell>
              <TableCell align="right"><Typography variant="h5" component="div" color="common.black">{row.wgt}</Typography></TableCell>
              <TableCell align="right"><Typography variant="h5" component="div" color="common.black">{row.amt}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    <Grid item xs={5} md={5} lg={5}>
    <div style={{height: 350}}>
    <ResponsivePie
        data={PIEdata}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'ruby'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'c'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'go'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'python'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'scala'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'lisp'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'elixir'
                },
                id: 'lines'
            },
            {
                match: {
                    id: 'javascript'
                },
                id: 'lines'
            }
        ]}
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
    </div>
    </Grid>
        </Grid>
        <MDBox mt={4.5}>
              <MDButton variant="gradient" color="error" fullWidth>
                NEXT
              </MDButton>
        </MDBox>
        </MDBox>
        </MDBox>
          }
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
