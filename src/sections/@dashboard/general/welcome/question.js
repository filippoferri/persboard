import * as React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// import { styled } from '@mui/material/styles';
// import { useScrollTrigger } from '@mui/material';
// next
// import Head from 'next/head';
// import Link from 'next/link';
// @mui
// import { alpha, useTheme } from '@mui/material/styles';
import { Grid, Button, Stack, Box, Typography, FormControl, TextField, IconButton } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
// routes
import { useRouter } from 'next/router';
// firebase api
import { FIREBASE_API } from '../../../../config-global';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// auth
// import { useAuthContext } from '../../../../auth/useAuthContext';
// import Image from '../../../../components/image';
// components
// import { useSettingsContext } from '../../../../components/settings';
import Iconify from '../../../../components/iconify';
import QuestionDialog from "../../../../components/question-dialog";



// ----------------------------------------------------------------------

WelcomeQuestion.propTypes = {
	dataFromPrevStep: PropTypes.object,
	onNextStep: PropTypes.func,
	// onPrevStep: PropTypes.func,
};

export default function WelcomeQuestion({ dataFromPrevStep, onNextStep }) {
		// const { themeStretch } = useSettingsContext();

		const isDesktop = useResponsive('up', 'md');

		const router = useRouter();
		const handleBack = () => {
			router.push({ pathname: PATH_DASHBOARD.welcome });};

		const app = initializeApp(FIREBASE_API);
		const db = getFirestore(app);

		const [text, setText] = useState('');
		const [charCount, setCharCount] = useState(250);
		// const [questions, setQuestion] = useState([]);

		const handleTextChange = (event) => {
			const inputText = event.target.value.slice(0, 250);
			setText(inputText);
			setCharCount(250 - inputText.length);
		};

		const handleListItemClick = (content) => {
			onNextStep({ question: content });
		};

		const handleSubmit = () => {
			onNextStep({ question: text });
		};

		const [open, setOpen] = useState(false);

		const handleOpen = () => setOpen(true);
		const handleClose = () => setOpen(false);

		// Get questions from firebase
		useEffect(() => {
			const questionsRef = collection(db, 'questions');
			const unsubscribe = onSnapshot(questionsRef, (snapshot) => {
				const workQuestionsData = [];
				const loveQuestionsData = [];
				const healthQuestionsData = [];
				snapshot.forEach((doc) => {
					const questionData = { id: doc.id, ...doc.data() };
					switch (questionData.area) {
						case 'work':
							workQuestionsData.push(questionData);
							break;
						case 'love':
							loveQuestionsData.push(questionData);
							break;
						case 'health':
							healthQuestionsData.push(questionData);
							break;
						default:
							break;
					}
				});
			});
			return unsubscribe;
		}, [db]);

	return (
		<>			
			<Stack
				direction="row"
				alignItems="center"
				sx={{
					mt: 2,
					mb: 4,
				}}
			>
				<Grid container spacing={0}>
					<Grid item sx={{display: "flex", alignItems: isDesktop ? "flex-start" : "center" }}>
                        <IconButton 
                            color= 'default' 
                            onClick={handleBack}>
                            <Iconify icon="eva:arrow-ios-back-fill" />
                        </IconButton>
						{!isDesktop && <Typography>Back</Typography>}
					</Grid>
					<Grid item sx={{ flexGrow: 1 }}>
						<Typography variant="h4" gutterBottom>
							Ask Your Board
						</Typography>
						<Typography variant="p" gutterBottom>
							Craft your question to get valuable advice from your Personal Board
						</Typography>
					</Grid>
				</Grid>
			</Stack>

			<Grid container spacing={2}>
				<Stack
					direction="column"
					sx={{
						mt: 2,
						width: '100%',
					}}
				>
					<FormControl fullWidth sx={{ m: 1, position: "relative" }} variant="standard">
						<TextField
							label="Your life question starts here..."
							variant="outlined"
							multiline
							rows={4}
							onChange={handleTextChange}
							sx={{
								fontSize: 30,
								'& .MuiOutlinedInput-root': {
								'&.Mui-focused fieldset': {
									borderColor: 'primary.light',
								},
								'&:hover fieldset': {
									borderColor: 'primary.light',
								},
								},
							}}
							value={text}
						/>
						{isDesktop && (
						<Button
							variant="outlined"
							color="primary"
							onClick={handleOpen}
							sx={{
							position: "absolute",
							bottom: 0,
							left: 0,
							mb: 1,
							ml: 1
							}}
						>
							Browse Ideas
						</Button>
						)}
					</FormControl>

					<QuestionDialog open={open} handleClose={handleClose} onNextStep={handleListItemClick} />
				</Stack>
			</Grid>

			<Stack
				direction="row"
				alignItems="flex-start"
				sx={{
					mt: 1,
					mb: 4,
				}}
			>
				<Box sx={{ flexGrow: 1 }}>
					Characters remaining: {charCount}
				</Box>
				<Box sx={{ flexShrink: 0 }}>
				<Button variant="contained" size="large" onClick={handleSubmit} disabled={!text}>
					Invite Your Board
				</Button>
				</Box>
			</Stack>
		</>
	);
}

