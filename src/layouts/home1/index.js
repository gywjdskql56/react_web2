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
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MAsolution1 from "layouts/masolution1";
import DIsolution from "layouts/screening";
import TLHsolution from "layouts/tlh_solution";
import { Routes, Link } from "react-router-dom";
import { useState } from "react";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import img1 from "assets/images/img111.png";
import img2 from "assets/images/img222.png";
import img3 from "assets/images/img333.png";
import img11 from "assets/images/img1.png";
import img22 from "assets/images/img2.png";
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
    let portnm = "?????????????????????1";
    if (portfolio1 === "?????????") {
      setPort("1");
      portnm = "?????????????????????1";
    } else if (portfolio1 === "???????????????") {
      setPort("2");
      portnm = "???????????????????????????1";
    } else if (portfolio1 === "???????????????") {
      setPort("3");
      portnm = "???????????????????????????1";
    } else if (portfolio1 === "??????????????????") {
      setPort("4");
      portnm = "???????????????????????????1";
    } else if (portfolio1 === "AI ???????????? ??????") {
      setPort("5");
      portnm = "????????????AI???????????????";
    }
    localStorage.setItem("port", portnm);
  });

  const strategyList = [
    {strategy: '???????????? ????????????', img :img1, ex_title: '??????????????? ?????? ????????? ??????:', ex_content:'?????? ????????? ?????? ????????? ????????? ????????????.', color :"warning", component:MAsolution1, path:'/masolution' },
    {strategy: '???????????? ????????? ????????????', img :img2, ex_title: '???????????? ???????????? ?????? ????????? ??????:', ex_content:'???????????? ???????????? ?????? ????????? ????????? ????????????.', color : "success", component: DIsolution, path:'/screening'},
    {strategy: '???????????? ????????????', img :img3, ex_title: '??????????????? ?????? ????????? ??????:', ex_content:'??????????????? ?????? ????????? ????????? ????????????.', color : "error", component:TLHsolution, path:'/tlh_solution' },
    ]

  function onClickNext(e) {
    console.log('next??? ??????????????????.');
  }


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
<Grid container spacing={3}>
    {strategyList.map(strategy =>
        <Grid item xs={12} md={6} lg={4}>
        <MDBox mb={1} mt={1}>
         <Card sx={{ maxWidth: 500 }}>
              <CardMedia
                component="img"
                height="600"
                image={strategy.img}
                alt="Paella dish"
              />
              <Card
                sx={{ maxWidth: 500 }}
                color = "orange"
              />
              <MDBox mt={4.5}>
                    <Link to={strategy.path}>
                      <MDButton variant="gradient" color={strategy.color} fullWidth>
                        {strategy.strategy}
                      </MDButton>
                    </Link>
                    <Routes path={strategy.path} component={strategy.component} />
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
                  <Typography paragraph>{strategy.ex_title}</Typography>
                  <Typography paragraph>
                    {strategy.ex_content}
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>
        </MDBox>
        </Grid>
      )}
    </Grid>
</MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
