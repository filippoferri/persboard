import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Grid, Stack, Box, Typography, Tabs, Tab, IconButton } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';

import BoardFromScratch from './welcomeboard/boardfromscratch';
import BoardFromDirectors from './welcomeboard/boardfromdirectors';
import BoardFromSelection from './welcomeboard/boardfromselection';

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

		const [value, setValue] = React.useState(0);

		const isDesktop = useResponsive('up', 'md');

		const handleChange = (event, newValue) => { setValue(newValue); };
		
		const handleSubmit = (data) => {
			onNextStep(data);
		};

		// recover preferences
		const [mode, setMode] = useState({
			quality: true,
			toneCoincise: true,
			humanled: true,
		});
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
					<Tab 
						fullWidth 
						label={mode.humanled ? "From Scratch" : "From AI Selection" }
						sx={{ 
							justifyContent: "left",
						}}
						{...a11yProps(mode.humanled ? 2 : 0)} />
					<Tab 
						fullWidth 
						label="From AI Directors"
						sx={{ 
							justifyContent: "left",
						}}
						{...a11yProps(1)} />
					<Tab 
						fullWidth 
						label={mode.humanled ? "From AI Selection" : "From Scratch" }
						sx={{ 
							justifyContent: "left",
						}}
						{...a11yProps(mode.humanled ? 0 : 2)} />
				</Tabs>
			</Grid>
			<Grid item xs={12} md={10}>
				<TabPanel value={value} index={mode.humanled ? 2 : 0}>
					<BoardFromSelection onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />	
				</TabPanel>
				<TabPanel value={value} index={1}>
					<BoardFromDirectors onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />
				</TabPanel>
				<TabPanel value={value} index={mode.humanled ? 0 : 2}>
					<BoardFromScratch onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />
				</TabPanel>
			</Grid>
		</Grid>
	</>
	);
}