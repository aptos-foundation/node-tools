import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Divider, Grid } from "@mui/material";
import DividerHero from "../../components/DividerHero";

export default function LandingPage() {
  return (
    <Box>
      <Typography variant="h3" component="h3" marginBottom={4}>
        Aptos Node Tools
      </Typography>
      <h2>BETA</h2>
      <DividerHero />
      <Grid container justifyContent="center">
        <Grid item xs={4}>
          <Box textAlign='center'>
            <a href="/#/node_checker" style={{ textDecoration: "none" }}>
              <Button variant="primary">Node Checker</Button>
            </a>
          </Box>
        </Grid>
      </Grid>
      <Box m={5}>
      <Divider />
      </Box>
      <Grid container justifyContent="center">
        <Grid item xs={4}>
          <Box textAlign='center'>
            <a href="/#/node_operator_signup/mainnet" style={{ textDecoration: "none" }}>
              <Button variant="primary">Mainnet Node Operator Signup</Button>
            </a>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box textAlign='center'>
            <a href="/#/node_operator_signup/testnet" style={{ textDecoration: "none" }}>
              <Button variant="primary">Testnet Node Operator Signup</Button>
            </a>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
