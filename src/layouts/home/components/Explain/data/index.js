/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
// import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
// import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
// import logoSlack from "assets/images/small-logos/logo-slack.svg";
// import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
// import logoJira from "assets/images/small-logos/logo-jira.svg";
// import logoInvesion from "assets/images/small-logos/logo-invision.svg";
// import team1 from "assets/images/team-1.jpg";
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";

export default function data() {
  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDTypography variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  return {
    columns: [
      { Header: "기능", accessor: "companies", width: "5%", align: "left" },
      { Header: "서브 기능", accessor: "members", width: "10%", align: "left" },
      { Header: "특징", accessor: "budget", width: "20%", align: "center" },
      { Header: "구현도", accessor: "completion", align: "center" },
    ],

    rows: [
      {
        companies: <Company image={logoAtlassian} name="미래에셋 맞춤형 솔루션" />,
        members: <Company name="1. 변동성 알고리즘" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            저가 매수 / 고가 매도의 변동성 매매를 알고리즘화
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company name="" />,
        members: <Company name="2. 초개인화 자산관리 로보" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            장단기 자산 가격 시나리오 및 전략적 / 전술적 자산배분으로 고객에게 최적화
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company name="" />,
        members: <Company name="3. 테마 로테이션" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            다양한 테마 ETF에 분산 투자
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company name="" />,
        members: <Company name="4. 멀티에셋 인컴" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            다양한 자산군의 인컴형 자산에 투자
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company name="" />,
        members: <Company name="5. AI 미국주식 투자" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            수익률 예측 모델을 통해 S&P 종목중 선택
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company image={logoAtlassian} name="종목 스크리닝" />,
        members: <Company name="1. ETF" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            국가별 / 자산군별 / 다양한 제약조건을 통해 스크리닝
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company name="" />,
        members: <Company name="2. 주식" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            국가별 / 섹터별 / 다양한 제약조건 / 키워드를 통해 스크리닝
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company image={logoAtlassian} name="내가 만드는 포트폴리오" />,
        members: <Company name="1. EMP" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ETF를 기반으로 포트폴리오를 구성 및 분석
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
      {
        companies: <Company name="" />,
        members: <Company name="2. 주식" />,
        budget: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            주식을 기반으로 포트폴리오를 구성 및 분석
          </MDTypography>
        ),
        completion: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress value={0} color="info" variant="gradient" label={false} />
          </MDBox>
        ),
      },
    ],
  };
}
