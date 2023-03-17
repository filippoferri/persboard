import * as React from 'react';
import PropTypes from 'prop-types';

import { Grid, Stack, Box, Typography, Tabs, Tab, IconButton } from '@mui/material';

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

		const handleChange = (event, newValue) => { setValue(newValue); };
		
		const handleSubmit = (data) => {
			onNextStep(data);
		};

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
				<Grid item sx={{display: "flex", alignItems:"flex-start" }}>
                    <IconButton 
                        color= 'default' 
                        onClick={onPrevStep}>
                        <Iconify icon="eva:arrow-ios-back-fill" />
                    </IconButton>
                </Grid>
				<Grid item sx={{ flexGrow: 1 }}>
					<Typography variant="h4" gutterBottom>
						Invite Your Board
					</Typography>
					<Typography variant="p" gutterBottom>
						Map out your Personal Board of Directors, and engage them!
					</Typography>
				</Grid>
				<Grid item sx={{ flexShrink: 0 }}>
				{/* <Button variant="contained" size="large" onClick={handleContinue} disabled={!text}>
					Get Advices
				</Button> */}
				</Grid>
			</Grid>
		</Stack>

		<Grid container spacing={5} sx={{ display: "flex", flexGrow: 1 }}>
			<Grid item xs={2} >
				<Tabs 
					value={value} 
					onChange={handleChange} 
					aria-label="tabs"
					orientation="vertical"
					sx={{ borderRight: 1, borderColor:"grey.300", }}
				>
					<Tab 
						fullWidth 
						label="From Scratch"
						sx={{ 
							justifyContent: "left",
						}}
						{...a11yProps(0)} />
					<Tab 
						fullWidth 
						label="From AI Directors"
						sx={{ 
							justifyContent: "left",
						}}
						{...a11yProps(1)} />
					<Tab 
						fullWidth 
						label="From AI Selection"
						sx={{ 
							justifyContent: "left",
						}}
						{...a11yProps(2)} />
				</Tabs>
			</Grid>
			<Grid item xs={10}>
				<TabPanel value={value} index={0}>
					<BoardFromScratch onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<BoardFromDirectors onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<BoardFromSelection onNextStep={handleSubmit} dataFromPrevStep={dataFromPrevStep} />	
				</TabPanel>
			</Grid>
		</Grid>

	</>
	);
}