import PropTypes from "prop-types";
import { m } from "framer-motion";
// @mui
// import { styled } from "@mui/material/styles";
import { Typography, Grid, Box, Button } from "@mui/material";
// Router
import { useRouter } from "next/router";
import { PATH_DASHBOARD } from "../../../../routes/paths";
// utils
// import { bgGradient } from "../../../../utils/cssStyles";
import { useAuthContext } from '../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

const variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
        },
    },
};

  // ----------------------------------------------------------------------

WelcomeIntro.propTypes = {
	onNextStep: PropTypes.func,
};

export default function WelcomeIntro({ onNextStep }) {

    const { user } = useAuthContext();

    const router = useRouter();
    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.steps });};


    const date = new Date();
    const hours = date.getHours();
    let greeting = "";

    if (hours >= 0 && hours < 12) {
      greeting = "Good Morning";
    } else if (hours >= 12 && hours < 18) {
      greeting = "Good Afternoon";
    } else {
      greeting = "Good Evening";
    }

    return (
      <m.div initial="hidden" animate="visible" variants={variants}>
        <Grid container spacing={6} sx={{ mt: 2, alignItems: "flex-start" }}>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <Typography variant="h3" sx={{ textAlign: "center", color: "primary.dark" }}>
              {greeting}, <Typography variant="span" sx={{ color: "primary.main" }}>{user.firstName}</Typography>
            </Typography>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color:"grey.700"  }}>
              Engage Now With Your Personal Board
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <Box sx={{ height: 200, mb: 4 }} component="img" src="/assets/illustrations/illustration_question.svg" />
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
              1. Define Your Question
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Start by crafting a clear and concise question that will guide your board&apos;s advice.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <Box sx={{ height: 200, mb: 4 }} component="img" src="/assets/illustrations/illustration_board.svg" />
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
              2. Build Your Board
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Choose your personal directors with diverse expertise that aligns with your question.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <Box sx={{ height: 200, mb: 4 }} component="img" src="/assets/illustrations/illustration_advices.svg" />
            <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
              3. Receive Actionable Advice
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Leverage Your Personal Board&apos;s Insights and use this information to develop a plan of action.
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" size="large" onClick={handleClick}>
              Get started
            </Button>
          </Grid>
        </Grid>
      </m.div>
    );    
}
