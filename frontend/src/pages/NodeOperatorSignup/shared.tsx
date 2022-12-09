import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Grid } from "@mui/material";
import ReactMarkdown from 'react-markdown';

interface NodeOperatorSignupPageProps {
    title: string;
    beforeButtonMarkdown: string;
    afterButtonMarkdown: string;
}

export default function NodeOperatorSignupPage({
    title,
    beforeButtonMarkdown,
    afterButtonMarkdown,
}: NodeOperatorSignupPageProps) {
    return (
        <Box>
            <Typography variant="h3" component="h3" marginBottom={4}>
                {title}
            </Typography>
            <ReactMarkdown>{beforeButtonMarkdown}</ReactMarkdown>
            <Grid container justifyContent="center">
                <Grid item xs={4}>
                    <Box textAlign='center'>
                        <a href="#" style={{ textDecoration: "none" }}>
                            <Button variant="primary">Sign Up (Coming Soon!)</Button>
                        </a>
                    </Box>
                </Grid>
            </Grid>
            <ReactMarkdown>{afterButtonMarkdown}</ReactMarkdown>
        </Box>
    );
}
