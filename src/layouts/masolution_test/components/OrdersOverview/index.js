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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Orders overview
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              24%
            </MDTypography>{" "}
            this month
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="테스트베드 시작"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="솔루션 시작일"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="정기 리밸런싱 (예정)"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="정기 리밸런싱 (예정)"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="정기 리밸런싱 (예정)"
          dateTime="18 DEC 4:54 AM"
          lastItem
        />
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
