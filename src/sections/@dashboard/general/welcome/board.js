import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Grid, Stack, Box, Typography, Tabs, Tab, IconButton, CircularProgress } from '@mui/material';
// firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_API } from '../../../../config-global';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// hooks
import useResponsive from '../../../../hooks/useResponsive';

// import BoardFromScratch from './welcomeboard/boardfromscratch';
import BoardFromDirectors from './welcomeboard/boardfromdirectors';
import BoardFromSelection from './welcomeboard/boardfromselection';
import YourBoard from './welcomeboard/yourboard';

// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

function a11yProps(index) {
	return {
	id: `simple-tab-${index}`,
	'aria-controls': `simple-tabpanel-${index}`,
	};
}  

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
		{value === index && (
			<Box sx={{ pt: 3 }}>
				{children}
			</Box>
		)}
		</div>
	);
	}

// ----------------------------------------------------------------------

WelcomeBoard.propTypes = {
	dataFromPrevStep: PropTypes.object,
	onNextStep: PropTypes.func,
	onPrevStep: PropTypes.func,
};

TabPanel.propTypes = {
		children: PropTypes.node,
		index: PropTypes.number.isRequired,
		value: PropTypes.number.isRequired,
	};

// ----------------------------------------------------------------------

export default function WelcomeBoard({ dataFromPrevStep, onNextStep, onPrevStep }) {

		const [value, setValue] = useState(0);
		const [hasBoard, setHasBoard] = useState(false);
		const [isLoading, setIsLoading] = useState(true);

		const isDesktop = useResponsive('up', 'md');

		const app = initializeApp(FIREBASE_API);
		const db = getFirestore(app);
		const { user } = useAuthContext();

		const handleChange = (event, newValue) => { setValue(newValue); };

		const checkHasBoard = useCallback(async () => {
			const myBoardRef = collection(db, 'users', user && user.uid, 'myBoard');
			const querySnapshot = await getDocs(myBoardRef);
			if (!querySnapshot.empty) {
				setHasBoard(true);
			}
			setIsLoading(false);
		}, [user, db]);

		// recover board
		useEffect(() => {
			checkHasBoard();
		}, [checkHasBoard, setIsLoading]);
		
		const handleSubmit = (data) => {
			onNextStep(data);
		};

		// recover preferences
		// const [mode, setMode] = useState({
		// 	quality: true,
		// 	toneCoincise: true,
		// 	humanled: true,
		// });

		useEffect(() => {
			const savedMode = JSON.parse(localStorage.getItem('mode'));
			if (savedMode) {
				setMode(savedMode);
			}
		}, []);

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
                        onClick={onPrevStep}>
                        <Iconify icon="eva:arrow-ios-back-fill" />
                    </IconButton>
					{ isDesktop ? null : <Typography variant="body2" onClick={onPrevStep}>Back</Typography>}
                </Grid>
				<Grid item sx={{ flexGrow: 1 }}>
					<Typography variant="h4" gutterBottom>
						Invite Your Board
					</Typography>
					<Typography variant="p" gutterBottom>
						Map out your Personal Board of Directors, and engage them!
					</Typography>
				</Grid>
			</Grid>
		</Stack>

		{!isLoading ? (
			<Grid container spacing={5} sx={{ display: "flex", flexGrow: 1 }}>
				<Grid item xs={12} md={2} >
					<Tabs 
						value={value} 
						onChange={handleChange} 
						aria-label="tabs"
						orientation= { isDesktop ? "vertical" : "horizontal" } 
						sx={
							isDesktop ?
							{ borderRight: 1, borderColor:"grey.300", } : null
						}
					>
						{ hasBoard ? (
							<Tab 
								fullWidth 
								label="Your Board" 
								sx={{ 
									justifyContent: "left",
								}}
								{...a11yProps(0)} />
						) : (
							<Tab 
								fullWidth 
								label="From AI Selection"
								sx={{ 
									justifyContent: "left",
								}}
								{...a11yProps(0)} />
						)}

						<Tab 
							fullWidth 
							label="Temporary Board"
							sx={{ 
								justifyContent: "left",
							}}
							{...a11yProps(1)} />
	
					</Tabs>
				</Grid>
				<Grid item xs={12} md={10}>
					{ hasBoard ? (
						<TabPanel value={value} index={0}>
							<YourBoard onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />	
						</TabPanel>
					) : (
						<TabPanel value={value} index={0}>
							<BoardFromSelection onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />	
						</TabPanel>
					)}

					<TabPanel value={value} index={1}>
						<BoardFromDirectors onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />
					</TabPanel>

				</Grid>
			</Grid>
		) : (
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<CircularProgress />
			</Box>
		)}
	</>
	);
}