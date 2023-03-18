import PropTypes from 'prop-types';
import { PDFDownloadLink, Document, Page } from '@react-pdf/renderer';
// @mui
import { IconButton, Tooltip } from '@mui/material';
// components
import Iconify from '../components/iconify';

const MyPdf = () => (
    <Document>
        <Page>
        // My document data
        </Page>
    </Document>
);

const DownloadPdf = () => (
    <PDFDownloadLink document={<MyPdf />} fileName="somename.pdf">
    {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 
        ( 
        <Tooltip title="Download">
            <IconButton 
                color= 'default'>
                    <Iconify icon="eva:download-outline" />
            </IconButton> 
        </Tooltip>
        )
    }
    </PDFDownloadLink>
);

export default DownloadPdf;

// ----------------------------------------------------------------------

DownloadPdf.propTypes = {
	directors: PropTypes.object,
	question: PropTypes.object,
    discussion: PropTypes.object,
};

// ----------------------------------------------------------------------