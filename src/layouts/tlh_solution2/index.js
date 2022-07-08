// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/tlh_solution2/components/Projects";
// Data
// import reportsBarChartData from "layouts/masolution2/data/reportsBarChartData";
// import reportsLineChartData from "layouts/masolution2/data/reportsLineChartData";

// Dashboard components
import httpGet from "config";
import MDButton from "components/MDButton";

function Dashboard() {
  //  const { sales, tasks } = reportsLineChartData;
  const returns = httpGet("/tlh_solution");
  console.log(returns);
  console.log(returns["전략"]);
  console.log(returns["전략"]["TLH 전략"]);
  console.log(returns["전략"]["TLH 전략"].at(-1));
  console.log(returns["전략"].date);
  const sales = {
    labels: returns["전략"].date,
    datasets: { label: "수익률", data: returns["전략"]["TLH 전략"] },
  };

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
                      전 기간 백테스트 수익률은 <strong>{returns.returns}%</strong> 입니다.
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
                  title="CAGR"
                  count={returns.cagr}
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
                  title="초기 자산"
                  count={Math.round(returns["전략"]["TLH 전략"].at(0))}
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
                  title="현재 자산"
                  count={Math.round(returns["전략"]["TLH 전략"].at(-1))}
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
                <Projects />
              </Grid>
            </Grid>
          </MDBox>
          <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={12}>
                <MDButton variant="gradient" color="warning" fullWidth>
                  주문 실행하기
                </MDButton>
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
