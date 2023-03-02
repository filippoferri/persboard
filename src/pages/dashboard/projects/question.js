import * as React from 'react';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useScrollTrigger } from '@mui/material';
import { m } from 'framer-motion';
import { animated } from 'framer-motion';
// next
import Head from 'next/head';
import Link from 'next/link';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Container, Grid, Button, Stack, Box, Typography, Divider, CardActionArea, Paper, FormControl, TextField, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
// layouts
import StepperLayout from '../../../layouts/stepper';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { FIREBASE_API } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Image from '../../../components/image';
// components
import { useSettingsContext } from '../../../components/settings';


// ----------------------------------------------------------------------

const StyledItem = styled('div')(({ theme }) => ({
	color: theme.palette.grey.darker,
	backgroundColor: "#F4F6F8",
	'&:hover, ListItemButton': {backgroundColor: "##DFE3E8"},
	borderRadius: Number(theme.shape.borderRadius) * 2,
	marginBottom: theme.spacing(1),
	padding: theme.spacing(1),
}));

// ----------------------------------------------------------------------

PageNewQuestion.getLayout = (page) => <StepperLayout step={1}>{page}</StepperLayout>;

// ----------------------------------------------------------------------

export default function PageNewQuestion() {
		const { themeStretch } = useSettingsContext();
		const router = useRouter();
		const { d } = router.query;

		const app = initializeApp(FIREBASE_API);
		const db = getFirestore(app);
		const { user } = useAuthContext();

		const [text, setText] = useState('');
		const [charCount, setCharCount] = useState(100);
		const [questions, setQuestion] = useState([]);

		const handleTextChange = (event) => {
			setText(event.target.value.slice(0, 100));
		};

		const handleListItemClick = (content) => {
			setText(content);
		};

		const handleContinue = () => {
			if (!text) {
				return;
			}
		
			const encodedText = btoa(text);
			const nextPageUrl = `${PATH_DASHBOARD.projects.advice}?d=${d}&q=${encodedText}`;
			router.push(nextPageUrl);
		};
		

		const [workQuestions, setWorkQuestions] = useState([]);
		const [loveQuestions, setLoveQuestions] = useState([]);
		const [healthQuestions, setHealthQuestions] = useState([]);

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
				setWorkQuestions(workQuestionsData);
				setLoveQuestions(loveQuestionsData);
				setHealthQuestions(healthQuestionsData);
			});
			return unsubscribe;
		}, [db]);

	return (
		<>
			<Head>
				<title> New Question | Personal Board</title>
			</Head>

			<Container maxWidth={themeStretch ? false : 'xl'} sx={{ pt: 4, pb: 15 }}>
				<Stack
					direction="row"
					alignItems="center"
					sx={{
						mt: 2,
						mb: 6,
					}}
				>
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant="h4" gutterBottom>
							Ask Your Board
						</Typography>
						<Typography variant="p" gutterBottom>
							Now that you’ve mapped out your Board of Directors, it’s time to engage them!
						</Typography>
					</Box>
					<Box sx={{ flexShrink: 0 }}>
					<Button variant="contained" size="large" onClick={handleContinue} disabled={!text}>
						Get Advices
					</Button>

					</Box>
				</Stack>

				<Grid container spacing={2}>
					<Stack
						direction="column"
						sx={{
							mt: 2,
							width: '100%',
						}}
					>
						<FormControl fullWidth sx={{ m: 1 }} variant="standard">
							<TextField
								label="Your life question starts here..."
								variant="outlined"
								multiline
								rows={5}
								onChange={handleTextChange}
								sx={{ fontSize: 30 }}
								value={text}
							/>
						</FormControl>
						<Typography variant="p" sx={{ ml: 2 }}>
							Characters remaining: {charCount}
						</Typography>
					</Stack>
				</Grid>

				<Stack
					direction="row"
					alignItems="center"
					sx={{
						mt: 4,
			mb: 2
				}}
				>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h4">Ideas</Typography>
			</Box>
			<Box sx={{ flexShrink: 0 }}></Box>
				</Stack>

				<Grid container spacing={3} direction="row">
					<Grid item xs={4}>
						<Typography variant="caption" sx={{fontWeight: "bold"}}>WORK</Typography>
						<Divider sx={{mb: 1}} />
						<List>
							{workQuestions.map((question) => (
								<ListItem disablePadding key={question.id}>
									<StyledItem>
										<ListItemButton onClick={() => handleListItemClick(question.question)}>
											<ListItemText primary={question.question} />
										</ListItemButton>
									</StyledItem>
								</ListItem>
							))}
						</List>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="caption" sx={{fontWeight: "bold"}}>HEALTH</Typography>
						<Divider sx={{mb: 1}} />
						<List>
							{healthQuestions.map((question) => (
								<ListItem disablePadding key={question.id}>
									<StyledItem>
										<ListItemButton onClick={() => handleListItemClick(question.question)}>
											<ListItemText primary={question.question} />
										</ListItemButton>
									</StyledItem>
								</ListItem>
							))}
						</List>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="caption" sx={{fontWeight: "bold"}}>LOVE</Typography>
						<Divider sx={{mb: 1}} />
						<List>
							{loveQuestions.map((question) => (
								<ListItem disablePadding key={question.id}>
									<StyledItem>
										<ListItemButton onClick={() => handleListItemClick(question.question)}>
											<ListItemText primary={question.question} />
										</ListItemButton>
									</StyledItem>
								</ListItem>
							))}
						</List>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}

