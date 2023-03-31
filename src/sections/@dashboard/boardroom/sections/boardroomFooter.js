// @mui
import { Stack, Chip } from '@mui/material';
// Router
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

export default function BoardroomFooter() {

    const router = useRouter();
    const handleNewAdvice = () => {
        router.push({ pathname: PATH_DASHBOARD.welcome });
    };

    const handleRequestFeature = () => {
        window.open('https://xmllse17mqf.typeform.com/to/tvBvCeiY', '_blank');
    };

    return (
        <Stack direction="row" spacing={1} 
            sx={{ 
                p: 2.5, 
                flexShrink: 0,
                borderTop: 1,
                borderColor: "grey.300"
            }}>
            <Chip label="Ask a new advice" color="primary" onClick={handleNewAdvice} />
            <Chip label="Request a new feature" color="primary" onClick={handleRequestFeature} />
        </Stack>
    );
}


