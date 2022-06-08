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

// react-router-dom components

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import port1 from "assets/images/port_1.png";
import port2 from "assets/images/port_2.png";
import port3 from "assets/images/port_3.png";
import port4 from "assets/images/port_4.png";
import port5 from "assets/images/port_5.png";

function DefaultProjectCard({ image, title }) {
  console.log("IMAGE IS ".concat(image));
  const strategy = httpGet("/strategy_explain")[sessionStorage.getItem("port1")][sessionStorage.getItem("port2")];

  console.log("IMAGE IS".concat(imagepath));
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
        boxShadow: "none",
        overflow: "visible",
      }}
    >
      <MDBox position="relative" width="100.25%" shadow="xl" borderRadius="xl">
        <CardMedia
          src={imagepath}
          component="img"
          title={title}
          sx={{
            maxWidth: "100%",
            margin: 0,
            boxShadow: ({ boxShadows: { md } }) => md,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of DefaultProjectCard
DefaultProjectCard.defaultProps = {
  action: {
    type: "internal",
    color: "dark",
    label: "",
  },
};
// Typechecking props for the DefaultProjectCard
DefaultProjectCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "light",
      "dark",
      "white",
    ]).isRequired,
    label: PropTypes.string.isRequired,
  }),
};

export default DefaultProjectCard;
