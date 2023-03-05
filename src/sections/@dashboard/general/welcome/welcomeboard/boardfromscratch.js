import React, { useState } from 'react';
import * as Yup from 'yup';
import { styled } from '@mui/material/styles';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack, Card, Paper, Box, Typography, Button, MenuItem } from '@mui/material';
import FormProvider, { RHFTextField } from '../../../../../components/hook-form';


// ----------------------------------------------------------------------

const StyledPaper = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    width: 200,
}));

const Item = ({ number }) => {

    const [showAdvanced, setShowAdvanced] = useState(false);

    const [inputFields, setInputFields] = useState([
      {
        fullName: '', 
        role: 'Mentor',
        area: 'Advocacy',
        quality: 'Vision',
      }
    ])

    const { register, handleSubmit, watch } = useForm({
      resolver: yupResolver(
        Yup.object().shape({
          fullName: Yup.string().when(['role', 'area', 'quality'], {
            is: (role, area, quality) => role || area || quality,
            then: Yup.string().required('Name is required'),
          }),
        })
      ),
    });

    const handleAdvancedSubmit = (data) => {
      onSubmit(data);
      setShowAdvanced(false);
    };

    const handleFormChange = (index, event) => {
      let data = [...inputFields];
      data[index][event.target.name] = event.target.value;
      setInputFields(data);
    }

    return (
      <Card sx={{ p: 2, mb: 1 }}>
          <FormProvider methods={useForm()}>
              {inputFields.map((input, index) => {
                return (
                <Stack key={index} direction="row" spacing={2} spacing={1}>
                    <StyledPaper
                        sx={{
                            display: 'flex',
                            backgroundColor: '#D1E9FC',
                            borderRadius: 1,
                            width: '50px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }} >
                            <Typography variant="h5">{number}</Typography>
                    </StyledPaper>

                    <StyledPaper sx={{ flexGrow: 6 }}>
                        <RHFTextField 
                          name={'fullName'} 
                          label="John Doe" 
                          helperText="Fake or Real Full Name (also famous)" 
                          value={input.fullName}
                          onChange={event => handleFormChange(index, event)}
                        />
                    </StyledPaper>

                {showAdvanced ? (
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
              ) : (
                <StyledPaper
                  sx={{ alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => setShowAdvanced(true)}
                >
                  <Typography sx={{
                    variant: "caption",
                    cursor: "pointer",
                    display: "flex",
                    height: "56px",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#3f51b5",
                  }}>Advanced AI</Typography>
                </StyledPaper>
              )}

                </Stack>
                )
              })}
          </FormProvider>
      </Card>
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
    const UpdateBoardSchema = Yup.object().shape({
        fullName1: Yup.string().required('Name is required'),
        fullName2: Yup.string().required('Name is required'),
        fullName3: Yup.string().required('Name is required'),
    });

    const defaultValues = {
        fullName1: '',
        fullName2: '',
        fullName3: '',
        fullName4: '',
        fullName5: '',
    };

    const methods = useForm({
        resolver: yupResolver(UpdateBoardSchema),
        defaultValues,
    });

    const [boardData, setBoardData] = useState([]);

    const MAX_ITEMS = 5;
    const [count, setCount] = useState(3);

    const handleAdd = () => {
      if (count < MAX_ITEMS) {
        setCount((prevCount) => prevCount + 1);
      }
    };

    const items = [];
    for (let i = 1; i <= count; i++) {
        items.push(<Item key={i} number={i} />);
    }

    const handleClick = () => {
      setBoardData((dataFromPrevStep) => [
        ...dataFromPrevStep,
        {
          fullName: '',
          role: 'Mentor',
          area: 'Advocacy',
          quality: 'Leadership',
        },
      ]);
      onNextStep();
    };

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
                Add from 3 to 5 people who will be on your board.
            </Box>
            <Box sx={{ flexShrink: 0 }}></Box>
        </Stack>
        {items}
        <Box sx={{mt: 2}}>
            {count < MAX_ITEMS && <Button onClick={handleAdd}>Add Director</Button>}
        </Box>
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mt: 1,
                mb: 4,
            }}
        >
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box sx={{ flexShrink: 0 }}>
                <Button variant="contained" size="large" onClick={handleClick} >
                    Ask Your Board
                </Button>
            </Box>
        </Stack>
    </>
    );
};

export default BoardFromScratch;
