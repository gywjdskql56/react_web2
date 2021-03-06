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
    { value: 1, label: "2?????????" },
    { value: 2, label: "?????????" },
    { value: 3, label: "???????????????" },
    { value: 4, label: "?????????????????? ??? ?????????" },
  ];
  const options2 = [
    { value: 1, label: "??????" },
    { value: 2, label: "???????????????" },
    { value: 3, label: "????????????" },
    { value: 4, label: "?????????" },
    { value: 5, label: "?????????" },
    { value: 6, label: "?????????" },
    { value: 7, label: "?????????" },
    { value: 8, label: "?????????" },
    { value: 9, label: "????????? ?????? ??? ??????" },
    { value: 10, label: "????????? ????????????" },
    { value: 11, label: "????????? ??????" },
    { value: 12, label: "ESS" },
    { value: 13, label: "??????" },
    { value: 14, label: "???????????????" },
    { value: 15, label: "???????????????" },
    { value: 16, label: "????????????" },
    { value: 17, label: "???????????????" },
    { value: 18, label: "?????????" },
    { value: 19, label: "????????????" },
    { value: 20, label: "??????????????????" },
    { value: 21, label: "?????????" },
    { value: 22, label: "?????????" },
    { value: 23, label: "??????????????????" },
    { value: 24, label: "???????????????????????????" },
    { value: 25, label: "???????????????" },
    { value: 26, label: "???????????????" },
    { value: 27, label: "????????????" },
    { value: 28, label: "?????????" },
  ];


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
      {/* <Grid container spacing={3}>
      <Grid item xs={6} md={6} lg={6}>
      <MDBox mt={1}>
        <DefaultProjectCard image=""
                label=""
                title="?????? ??????"
                description="????????? ????????? ??????????????????."
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
                title="?????? ??????"
                description="????????? ????????? ??????????????????."
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
        </Grid> */}
        <Grid container spacing={3}>
        <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1} mt={1}>
            <DefaultProjectCard image=""
                label=""
                title="?????? ?????? ??????"
                description="??????????????? ?????? 0??? ????????? ?????????."
                size="large"
                component="text" />
                <MDBox mt={2}>
                <fieldset>
                    <MDBox mt={0}>
                        <Slider1 title="2??? ??????" />
                    </MDBox>
                    <MDBox mt={-5}>
                        <Slider1 title="?????????" />
                    </MDBox>
                    <MDBox mt={-5}>
                        <Slider1 title="?????? ?????????" />
                    </MDBox>
                    <MDBox mt={-5}>
                        <Slider1 title="?????????????????? ??? ?????????" />
                    </MDBox>

                </fieldset>
                </MDBox>
            </MDBox>

          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <MDBox mb={1} mt={1}>
            <DefaultProjectCard image=""
                label=""
                title="?????? ????????? ??????"
                description="??? ????????? ???????????? ??????????????????."
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
        {/* <MDBox mt={4.5}>
            <Link to="/screening3">
              <MDButton variant="gradient" color="warning" fullWidth>
                NEXT
              </MDButton>
            </Link>
            <Routes path="/screening3" component={Screening3} />
          </MDBox> */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
