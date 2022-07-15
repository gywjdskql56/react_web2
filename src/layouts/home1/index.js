import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MAsolution1 from "layouts/masolution1";
import { Routes, Link } from "react-router-dom";
import { useState } from "react";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
// import img1 from "image/화면.png"
// import img2 from "layouts/home1/image/화면.png"
import img1 from "assets/images/img1_1.png";
import img2 from "assets/images/img2_2.png";
import img3 from "assets/images/img3_3.png";
import img11 from "assets/images/img111.png";
import img22 from "assets/images/img22.png";
import img33 from "assets/images/img33.png";
import MDButton from "components/MDButton";


interface ExpandMoreProps1 extends IconButtonProps {
  expand: boolean;
}

interface ExpandMoreProps2 extends IconButtonProps {
  expand: boolean;
}
interface ExpandMoreProps3 extends IconButtonProps {
  expand: boolean;
}
const ExpandMore1 = styled((props: ExpandMoreProps1) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ExpandMore2 = styled((props: ExpandMoreProps2) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ExpandMore3 = styled((props: ExpandMoreProps3) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
function Dashboard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  const [port, setPort] = useState("1");
  sessionStorage.setItem("selected1", false);
  sessionStorage.setItem("selected2", false);

  window.addEventListener("port1", () => {
    const portfolio1 = sessionStorage.getItem("port1");
    console.log("change to local storage!");
    //    setPort(localStorage.getItem("port"));
    //    console.log(localStorage.getItem("port"));
    let portnm = "미래변동성공격1";
    if (portfolio1 === "변동성") {
      setPort("1");
      portnm = "미래변동성공격1";
    } else if (portfolio1 === "초개인로보") {
      setPort("2");
      portnm = "미래초개인로보적극1";
    } else if (portfolio1 === "테마로테션") {
      setPort("3");
      portnm = "미래테마로테션공격1";
    } else if (portfolio1 === "멀티에셋인컴") {
      setPort("4");
      portnm = "미래멀티에셋인컴공1";
    } else if (portfolio1 === "AI 미국주식 투자") {
      setPort("5");
      portnm = "미래에셋AI크로스알파";
    }
    localStorage.setItem("port", portnm);
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
<Grid container spacing={3}>


<Grid item xs={12} md={6} lg={4}>
<MDBox mb={1} mt={1}>
 <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="120"
        image={img1}
        alt="Paella dish"
      />
      <Card
        sx={{ maxWidth: 345 }}
        color = "orange"
      />
      {/* <CardHeader
        title="미래에셋 자산운용 노하우가 궁금하다면?"
        subheader="September 14, 2016"
      /> */}
      <CardMedia
        component="img"
        height="270"
        image={img11}
        alt="Paella dish"
      />
      <CardContent>
        {/* <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>  */}
      </CardContent>
      <MDBox mt={4.5}>
            <Link to="/masolution">
              <MDButton variant="gradient" color="warning" fullWidth>
                로보펀드 바로가기
              </MDButton>
            </Link>
            <Routes path="/masolution" component={MAsolution1} />
          </MDBox>
      <CardActions disableSpacing>

        <ExpandMore1
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore1>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>로포펀드에 대한 자세한 설명:</Typography>
          <Typography paragraph>
            로보 펀드에 대한 설명은 다음과 같습니다.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
</MDBox>
</Grid>

<Grid item xs={12} md={6} lg={4}>
<MDBox mb={1} mt={1}>
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="120"
        image={img2}
        alt="Paella dish"
      />
      {/* <CardHeader
        title="미래에셋 자산운용 노하우가 궁금하다면?"
        subheader="September 14, 2016"
      /> */}
      <CardMedia
        component="img"
        height="230"
        image={img22}
        alt="Paella dish"
      />
      <CardContent>
        {/* <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography> */}
      </CardContent>
      <MDBox mt={4.5}>
            <Link to="/screening">
              <MDButton variant="gradient" color="success" fullWidth>
                다이렉트 인덱싱 바로가기
              </MDButton>
            </Link>
            <Routes path="/screening" component={MAsolution1} />
          </MDBox>
      <CardActions disableSpacing>
        <ExpandMore2
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore2>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>다이렉트 인덱싱에 대한 자세한 설명:</Typography>
          <Typography paragraph>
            다이렉트 인덱싱에 대한 설명은 다음과 같습니다.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
</MDBox>
</Grid>

<Grid item xs={12} md={6} lg={4}>
<MDBox mb={1} mt={1}>
        <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="120"
        image={img3}
        alt="Paella dish"
      />
      {/* <CardHeader
        title="미래에셋 자산운용 노하우가 궁금하다면?"
        subheader="September 14, 2016"
      /> */}
      <CardMedia
        component="img"
        height="250"
        image={img33}
        alt="Paella dish"
      />
      <CardContent>
        {/* <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography> */}
      </CardContent>
      <MDBox mt={4.5}>
            <Link to="/tlh_solution">
              <MDButton variant="gradient" color="error" fullWidth>
                절세전략 바로가기
              </MDButton>
            </Link>
            <Routes path="/tlh_solution" component={MAsolution1} />
          </MDBox>
      <CardActions disableSpacing>
        <ExpandMore3
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore3>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>절세전략에 대한 자세한 설명:</Typography>
          <Typography paragraph>
            절세전략에 대한 설명은 다음과 같습니다.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
    </MDBox>
</Grid>

    </Grid>
</MDBox>



      <MDBox py={3}>


        <MDBox>
          <MDBox mt={4.5}>
            <Link to="/masolution1">
              <MDButton variant="gradient" color="warning" fullWidth>
                NEXT
              </MDButton>
            </Link>
            <Routes path="/masolution1" component={MAsolution1} />
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
