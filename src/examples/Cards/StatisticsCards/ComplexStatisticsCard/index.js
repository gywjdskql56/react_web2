/* eslint-disable react/prop-types */
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
// import CardActionArea from "@material-ui/core/CardActionArea";
// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React, { useState } from "react";
import httpGet from "config";

// import React from "react";
function handleClick(title, solutionNum) {
  console.log('click: ',title)
  localStorage.setItem("title", title);
  if (solutionNum === "1") {
    sessionStorage.setItem("selected1", true);
    if (title === "변동성 알고리즘") {
      sessionStorage.setItem("port1", "변동성");
      sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
    } else if (title === "초개인화 자산관리") {
      sessionStorage.setItem("port1", "초개인로보");
      sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
    } else if (title === "테마 로테이션") {
      sessionStorage.setItem("port1", "테마로테션");
      sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
    } else if (title === "멀티에셋 인컴") {
      sessionStorage.setItem("port1", "멀티에셋인컴");
      sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
    } else if (title === "멀티에셋 모멘텀") {
      sessionStorage.setItem("port1", "멀티에셋국");
      sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
    }
    localStorage.setItem("color", "salmon");
    console.log(sessionStorage.getItem("port1"));
    window.dispatchEvent(new Event("port1"));
  } else if (solutionNum === "2") {
    sessionStorage.setItem("selected2", true);
    sessionStorage.setItem("port2", title);
    localStorage.setItem("color", "salmon");
    console.log(sessionStorage.getItem("port2"));
    window.dispatchEvent(new Event("port2"));
    //    const strategyEx = sessionStorage.getItem("strategy_explain")[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")];
  } else if (solutionNum === "3") {
    console.log(title);
    sessionStorage.setItem("selected3", true);
    sessionStorage.setItem("DI_1", title);
    localStorage.setItem("color", "green");
    console.log(sessionStorage.getItem("selected3"));
    window.dispatchEvent(new Event("selected3"));
    //    const strategyEx = sessionStorage.getItem("strategy_explain")[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")];
  } else if (solutionNum === "4") {
    console.log(title);
    sessionStorage.setItem("selected4", true);
    sessionStorage.setItem("DI_2", title);
    localStorage.setItem("color", "green");
    console.log(sessionStorage.getItem("selected4"));
    window.dispatchEvent(new Event("selected4"));
    //    const strategyEx = sessionStorage.getItem("strategy_explain")[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")];
  } else if (solutionNum === "5") {
    console.log(title);
    sessionStorage.setItem("포트폴리오 타입", title);
    console.log(sessionStorage.getItem("포트폴리오 타입"));
    localStorage.setItem("color", "green");
    //    const strategyEx = sessionStorage.getItem("strategy_explain")[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")];
  }
   else {
    localStorage.setItem("color", "");
  }
  window.dispatchEvent(new Event("title"));
}
function ComplexStatisticsCard({ color, title, count, percentage, icon, solutionNum }) {
  const [port, setPort] = useState("");
  //  useEffect(() => {
  //    setPort(localStorage.getItem("title"));
  //  }, [port])
  window.addEventListener("title", () => {
    setPort(localStorage.getItem("title"));
  });

  return (
    <Card
      onClick={() => handleClick(count, solutionNum)}
      style={{ backgroundColor: count === port ? localStorage.getItem("color") : "" }}
    >
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2}>
        <MDTypography component="p" variant="button" color="text" display="flex">
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
          >
            {percentage.amount}
          </MDTypography>
          &nbsp;{percentage.label}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node,
};

export default ComplexStatisticsCard;
