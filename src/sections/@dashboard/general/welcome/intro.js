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

    const router = useRouter();
    const handleClick = () => {
        router.push({ pathname: PATH_DASHBOARD.steps });};

        return (
          <m.div initial="hidden" animate="visible" variants={variants}>
            <Grid container spacing={6} sx={{ mt: 2, alignItems: "flex-start" }}>
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <Typography variant="h3" gutterBottom sx={{ textAlign: "center" }}>
                  Engage With Your Board
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                <Box sx={{ height: 200, mb: 4 }} component="img" src="/assets/illustrations/illustration_question.svg" />
                <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
                  1. Define Your Question
                </Typography>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  Start by crafting a clear and concise question that will guide your board's advice.
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
                  Leverage Your Personal Board's Insights and use this information to develop a plan of action.
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
