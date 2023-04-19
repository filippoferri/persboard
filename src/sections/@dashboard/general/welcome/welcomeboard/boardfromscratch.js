import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import * as Yup from 'yup';
import { styled } from '@mui/material/styles';
// form
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Card, Paper, Box, Typography, Button, MenuItem } from '@mui/material';
import FormProvider, { RHFTextField } from '../../../../../components/hook-form';
// hooks
import useResponsive from '../../../../../hooks/useResponsive';
// components
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

const StyledPaper = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	color: theme.palette.text.secondary,
	width: 100,
}));

// ----------------------------------------------------------------------

const FormFields = ({ methods, dataFromPrevStep, onNextStep }) => {

	const isDesktop = useResponsive('up', 'md');

  	// Show advanced fields
	const [showAdvanced, setShowAdvanced] = useState(false);

//   const handleAdvancedSubmit = (data) => {    
//     onSubmit(data);
//     setShowAdvanced(false);
//   };

  // Form validation schema
	const [formFields, setFormFields] = useState([
		{ fullName: '', role: 'Inspirer'},
		{ fullName: '', role: 'Inspirer' },
		{ fullName: '', role: 'Inspirer' },
	]);

  	// Manage form fields
	const handleFormChange = (index, event) => {
	const fieldsData = [...formFields];
		fieldsData[index][event.target.name] = event.target.value;
		setFormFields(fieldsData);
	}

  	// Add new form fields
	const addFields = () => {
	const object = { fullName: '', role: 'Inspirer' }
		setFormFields([...formFields, object])
	}

	// Validate form fields
	const isFormValid = formFields.every(field => field.fullName !== '');

	// const [boardData, setBoardData] = useState([]);

	const NextStep = () => {
		const directors = { directors: formFields };
		const boardData = [
			dataFromPrevStep,
			directors,
		];
		// setBoardData(boardData);
		onNextStep(boardData);
	};
	
	const handleAdvanced = () => {
		setShowAdvanced(!showAdvanced);
	};

	return (
	<>
	<FormProvider methods={useForm()}>
		<Box sx={{pr:2, mb: 1}}>  
			<Typography sx={{
				variant: "caption",
				cursor: "pointer",
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-start",
				color: "primary.dark",
				}}
				onClick={handleAdvanced}
			><Iconify icon={showAdvanced ? 'eva:eye-off-outline' : 'eva:eye-outline'} sx={{ ml: 2, mr: 1 }}/> {showAdvanced ? 'Hide Roles' : 'Show Roles (optional)'}</Typography>
		</Box>
		{formFields.map((input, index) => (
			<Card key={index} sx={{ p: 2, mb: isDesktop ? 1 : 4 }}>
				<Stack 
					direction={isDesktop ? "row" : "column"} 
					spacing={1}
				>
					<StyledPaper
					sx={{
						display: 'flex',
						backgroundColor: 'primary.lighter',
						borderRadius: 1,
						width: isDesktop ? "50px" : "100%",
						justifyContent: 'center',
						alignItems: 'center',
						mb: isDesktop ? 0 : 1,
					}}
					>
					<Typography variant="h5">{index+1}</Typography>
					</StyledPaper>

					<StyledPaper sx={{ 
							flexGrow: 6, 
							width: isDesktop ? undefined : "100%", 
						}}>
						<RHFTextField 
							name="fullName"
							label="Full Name" 
							helperText="Fake or Real Full Name (also famous)" 
							value={input.fullName}
							onChange={event => handleFormChange(index, event)}
						/>
					</StyledPaper>

					{showAdvanced && (
						<StyledPaper sx={{ flexGrow: 1, width: isDesktop ? undefined : "100%" }}>
							<RHFTextField
								select
								name="role"
								helperText="Role Director"
								value={input.role}
								onChange={event => handleFormChange(index, event)}
							>
								{roles.map((option, roleIndex) => (
								<MenuItem key={roleIndex} value={option.value}>
									{option.label}
								</MenuItem>
								))}
							</RHFTextField>
						</StyledPaper>
					)}
				</Stack>
			</Card>
		))}
		</FormProvider>
		{formFields.length < 5 && isFormValid && (
			<Box sx={{pt: isDesktop ? 2 : 0, textAlign: isDesktop ? "left" : "center"}}>
				<Button onClick={addFields}>Add director</Button>
			</Box>
		)}
		<Stack
			direction="row"
			alignItems="center"
			sx={{
				mt: 3,
				mb: 4,
				justifyContent: isDesktop ? "flex-end" : "center",
		}}
			>
			<Box sx={{ flexShrink: 1 }}>
				<Button 
					disabled={!isFormValid}  
					variant="contained" size="large" 
					onClick={NextStep} 
					fullWidth={!isDesktop ? true : undefined}
					>
					Ask Your Board
				</Button>
			</Box>
		</Stack>
	</>
	);
};

const roles = [
	{
		value: 'Inspirer',
		label: 'Inspirer',
	},
	{
		value: 'Mentor',
		label: 'Mentor',
	},
	{
		value: 'Executive Coach',
		label: 'Executive Coach',
	},
	{
		value: 'Life Coach',
		label: 'Life Coach',
	},
	{
		value: 'Sport Coach',
		label: 'Sport Coach',
	},
	{
		value: 'Sponsor',
		label: 'Sponsor',
	},
	{
		value: 'Challenger',
		label: 'Challenger',
	},
	{
		value: 'Supporter',
		label: 'Supporter',
	},
	{
		value: 'Adversary',
		label: 'Adversary',
	},
];

const BoardFromScratch = ({onNextStep, dataFromPrevStep}) => (
	<>
		<Stack
		direction="row"
		alignItems="center"
		sx={{
			mt: 1,
			mb: 3,
		}}
		>
		<Box sx={{ flexGrow: 1, pl: 2 }}>
			Add from 3 to 5 worldwide celebrities who will be on your board.
		</Box>
		</Stack>

		<FormFields methods={useForm()} dataFromPrevStep={dataFromPrevStep} onNextStep={onNextStep}/>
	</>
);


export default BoardFromScratch;

// ----------------------------------------------------------------------

BoardFromScratch.propTypes = {
  onNextStep: PropTypes.func.isRequired,
  dataFromPrevStep: PropTypes.object.isRequired,
};

FormFields.propTypes = {
  methods: PropTypes.object.isRequired,
  dataFromPrevStep: PropTypes.object.isRequired,
  onNextStep: PropTypes.func.isRequired,
};

// ----------------------------------------------------------------------