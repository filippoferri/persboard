import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';

// form
import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, Card, Paper, Box, Typography, Button, MenuItem } from '@mui/material';
import FormProvider, { RHFTextField } from '../../../../../components/hook-form';

// ----------------------------------------------------------------------

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    width: 100,
}));

// ----------------------------------------------------------------------

const FormFields = ({ methods, dataFromPrevStep, onNextStep }) => {

  // Show advanced fields
  const [showAdvanced, setShowAdvanced] = useState(false);

  // const handleAdvancedSubmit = (data) => {    
  //   onSubmit(data);
  //   setShowAdvanced(false);
  // };

  // Form validation schema
  const [formFields, setFormFields] = useState([
    { fullName: '', role: 'Mentor', area: 'Advocacy', quality: 'Vision' },
    { fullName: '', role: 'Mentor', area: 'Advocacy', quality: 'Vision' },
    { fullName: '', role: 'Mentor', area: 'Advocacy', quality: 'Vision' },
  ]);

  // Manage form fields
  const handleFormChange = (index, event) => {
    let fieldsData = [...formFields];
    fieldsData[index][event.target.name] = event.target.value;
    setFormFields(fieldsData);
  }

  // Add new form fields
  const addFields = () => {
    let object = { fullName: '', role: 'Mentor', area: 'Advocacy', quality: 'Vision' }
    setFormFields([...formFields, object])
  }

  // Validate form fields
  const isFormValid = formFields.every(field => field.fullName !== '');

  const [boardData, setBoardData] = useState([]);

  const NextStep = () => {
    const directors = { directors: formFields };
    const boardData = [
      dataFromPrevStep,
      directors,
    ];
    setBoardData(boardData);
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
              justifyContent: "flex-end",
              color: "#3f51b5",
            }}
            onClick={handleAdvanced}
          >{showAdvanced ? 'Simple AI' : 'Advanced AI'}</Typography>
      </Box>
      {formFields.map((input, index) => {
        return (
          <Card key={index} sx={{ p: 2, mb: 1 }}>
                    <Stack direction="row" spacing={2} spacing={1}>
                        <StyledPaper
                            sx={{
                                display: 'flex',
                                backgroundColor: '#D1E9FC',
                                borderRadius: 1,
                                width: '50px',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} >
                                <Typography variant="h5">{index+1}</Typography>
                        </StyledPaper>

                        <StyledPaper sx={{ flexGrow: 6 }}>
                            <RHFTextField 
                              name="fullName"
                              label="Full Name" 
                              helperText="Fake or Real Full Name (also famous)" 
                              value={input.fullName}
                              onChange={event => handleFormChange(index, event)}
                            />
                        </StyledPaper>

                    {showAdvanced && (
                    <>
                      <StyledPaper sx={{ flexGrow: 1 }}>
                        <RHFTextField
                          select
                          name="role"
                          helperText="Role Director"
                          value={input.role}
                          onChange={event => handleFormChange(index, event)}
                        >
                          {roles.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </RHFTextField>
                      </StyledPaper>

                      <StyledPaper sx={{ flexGrow: 1 }}>
                        <RHFTextField
                          select
                          name="area"
                          helperText="Area Expertise"
                          value={input.area}
                          onChange={event => handleFormChange(index, event)}
                        >
                          {areas.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </RHFTextField>
                      </StyledPaper>
                      
                      <StyledPaper sx={{ flexGrow: 1 }}>
                        <RHFTextField
                          select
                          name="quality"
                          helperText="Key Quality"
                          value={input.quality}
                          onChange={event => handleFormChange(index, event)}
                        >
                          {qualities.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </RHFTextField>
                      </StyledPaper>
                    </>
                  )}
                    </Stack>
                
          </Card>
        );
      })}
      </FormProvider>
      {formFields.length < 5 && isFormValid && (
        <Box sx={{pt: 2}}>
          <Button onClick={addFields}>Add director</Button>
        </Box>
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
            mt: 3,
            mb: 4,
      }}
        >
          <Box sx={{ flexShrink: 1 }}>
              <Button disabled={!isFormValid}  variant="contained" size="large" onClick={NextStep} >
                  Ask Your Board
              </Button>
          </Box>
      </Stack>
    </>
  );
};

const roles = [
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
    value: 'Mentor',
    label: 'Mentor',
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
    value: 'Senior-to-You Leader',
    label: 'Senior-to-You Leader',
},
{
    value: 'Adversary',
    label: 'Adversary',
},
];

const areas = [
{
    value: 'Advocacy',
    label: 'Advocacy',
},
{
    value: 'Social Support',
    label: 'Social Support',
},
{
    value: 'Career Advice',
    label: 'Career Advice',
},
{
    value: 'Expertise',
    label: 'Expertise',
},
{
    value: 'Network',
    label: 'Network',
},
{
    value: 'Feedback',
    label: 'Feedback',
},
];

const qualities = [
    {
        value: 'Leadership',
        label: 'Leadership',
    },
    {
        value: 'Vision',
        label: 'Vision',
    },
    {
        value: 'Diligence',
        label: 'Diligence',
    },
    {
        value: 'Passion',
        label: 'Passion',
    },
    {
        value: 'Knowledge',
        label: 'Knowledge',
    },
    {
        value: 'Discretion',
        label: 'Discretion',
    },
    {
        value: 'Governance',
        label: 'Governance',
    },
    {
        value: 'Collegiality',
        label: 'Collegiality',
    },
];

const BoardFromScratch = ({onNextStep, dataFromPrevStep}) => {
    // const UpdateBoardSchema = Yup.object().shape({
    //     fullName1: Yup.string().required('Name is required'),
    //     fullName2: Yup.string().required('Name is required'),
    //     fullName3: Yup.string().required('Name is required'),
    // });

    // const methods = useForm({
    //     resolver: yupResolver(UpdateBoardSchema),
    // });

    return (
    <>
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mt: 1,
                mb: 4,
            }}
        >
            <Box sx={{ flexGrow: 1 }}>
                Add from 3 to 5 worldwide celebrities who will be on your board.
            </Box>
        </Stack>
        
        <FormFields methods={useForm()} dataFromPrevStep={dataFromPrevStep} onNextStep={onNextStep}/>
    </>
    );
};

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