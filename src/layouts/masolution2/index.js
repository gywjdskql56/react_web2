// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ReportsLineChart from "examples/Charts/LineCharts/DefaultLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/masolution2/data/reportsBarChartData";
// import reportsLineChartData from "layouts/masolution2/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/masolution2/components/Projects";
import Projects2 from "layouts/masolution2/components/Projects2";
import OrdersOverview from "layouts/masolution2/components/OrdersOverview";
import httpGet from "config";
import MDButton from "components/MDButton";

function Dashboard() {
  //  const { sales, tasks } = reportsLineChartData;
  console.log(httpGet("/strategy")[sessionStorage.getItem("port1")]);
  sessionStorage.setItem("port2", httpGet("/strategy")[sessionStorage.getItem("port1")][0]);
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
  console.log(returns.returns[returns.returns.length - 1]);
  console.log(returns.returns.at(-1));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
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
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
