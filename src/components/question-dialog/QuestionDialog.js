import React, { useState, useEffect } from "react";

import { Dialog, DialogTitle, DialogContent, Box, Card, CardContent, List, ListItem, ListItemText, Typography, Grid, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';

const style = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    height: "600px",
    maxHeight: "75vh",
    overflow: "scroll",
    fontSize: "0.8rem",
};

export default function QuestionDialog({ open, handleClose, onNextStep }) {
    const [questions, setQuestions] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);

    useEffect(() => {
    async function fetchData() {
        const response = await fetch("/questions.json");
        const data = await response.json();
        setQuestions(data);
        setSelectedArea(Object.keys(data)[0]);
    }

    fetchData();
    }, []);

    return (
    <div>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            fullWidth
            maxWidth="lg"
        >
            <DialogContent  sx={{ p:0 }}>

                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    sx={{
                    position: 'absolute',
                    top: 8,
                    right: 16,
                    }}
                >
                    <Close />
                </IconButton>

                <Box sx={style}>
                    <Box sx={{ width: "20%", backgroundColor: "primary.lighter", p:2, pt: 4 }}>
                        <Typography id="dialog-description" variant="h6" sx={{ pl:2 }}>
                            Ideas
                        </Typography>
                        {questions && (
                        <List>
                            {Object.keys(questions).map((area, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => setSelectedArea(area)}
                                sx={{
                                    backgroundColor: area === selectedArea ? "primary.light" : "transparent",
                                    '&:hover': {
                                        backgroundColor: "primary.light",
                                    },
                                    borderRadius: 1,
                                    mb: 1,
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography 
                                            variant="body1" 
                                            color="text.primary" 
                                            sx={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: "bold",
                                            }}>
                                            {area}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            ))}
                        </List>
                        )}
                    </Box>
                    <Box sx={{ width: "80%", p:3 }}>
                        <Typography id="dialog-description" variant="h6" sx={{ pl:2, mt: 1, mb: 2 }}>
                            {selectedArea}
                        </Typography>
                        <Grid container spacing={2} sx={{ alignItems: "center" }}>
                        {selectedArea &&
                        questions[selectedArea].map((question, index) => (
                            <Grid item xs={12} mg={3} lg={4} key={index}>
                                <Card 
                                    sx={{  height: 150, display: "flex", justifyContent:"center", cursor: "pointer",
                                    border: 1, borderColor: "transparent", 
                                    '&:hover': { borderColor: "primary.main" },
                                    }}
                                    onClick={() => onNextStep(question)}
                                >
                                    <CardContent>
                                        <Typography variant="body2">
                                            {question}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    </div>
    );
}