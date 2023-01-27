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
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import port1 from "assets/images/port_1.png";
import port2 from "assets/images/port_2.png";
import port3 from "assets/images/port_3.png";
import port4 from "assets/images/port_4.png";
import port5 from "assets/images/port_5.png";
import port6 from "assets/images/port_6.png";
import apple from "assets/images/apple-icon.png";

function DefaultProjectCard({ image, title, description }) {
  console.log("IMAGE IS ".concat(image));
  let imagepath = "";
  if (image === "1") {
    imagepath = port1;
  } else if (image === "2") {
    imagepath = port2;
  } else if (image === "3") {
    imagepath = port3;
  } else if (image === "4") {
    imagepath = port4;
  } else if (image === "5") {
    imagepath = port6;
  } else if (image === "6") {
    imagepath = port5;
  } else if (image === "apple") {
    imagepath = apple;
  }

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
      {image === "" ? (
        <MDBox mt={1} mx={0.5}>
          <MDTypography component="a" variant="h5" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDBox mt={1} mx={0.5}>
            <MDTypography variant="button" fontWeight="regular" color="text">
              {description}
            </MDTypography>
          </MDBox>
        </MDBox>
      ) : (
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
      )}
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
  description: PropTypes.string.isRequired,
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
