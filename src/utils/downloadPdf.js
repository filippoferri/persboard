import PropTypes from 'prop-types';
import { PDFDownloadLink, Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
// @mui
import { IconButton, Tooltip } from '@mui/material';
// components
import Iconify from '../components/iconify';

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 12,
        marginBottom: 2,
    },
    subText: {
        fontSize: 10,
        marginBottom: 10,
    },
    author: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    columns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftColumn: {
        width: '30%',
        borderRight: '1pt solid black',
        paddingRight: 10, // Add some padding to separate content from the border
    },
    rightColumn: {
        width: '70%',
        paddingLeft: 10, // Add some padding to separate content from the border
    },
    noMargin: {
        margin: 0,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        fontSize: 10,
        textAlign: 'center',
    },
});

const MyPdf = ({ question, directors, discussion, takeaways }) => (
    <Document>
        <Page style={styles.page}>

            <Text style={styles.title}>Boardroom Report</Text>

            <View style={styles.columns}>

                <View style={[styles.section, styles.leftColumn]}>
                    <View style={styles.section}>
                        <Text style={styles.subTitle}>Your Bord</Text>
                        {directors && Object.entries(directors).map(([index, director]) => (
                            <View key={index} style={styles.marginBottom}>
                                <Text style={styles.text}>{director.fullName}</Text>
                                <Text style={styles.subText}>{director.role}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.subTitle}>Key Takeaways</Text>
                        {takeaways && takeaways.map((takeaway, index) => (
                            <View key={index}>
                                <Text style={styles.subText}>{takeaway.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={[styles.section, styles.rightColumn]}>
                    <View style={styles.section}>
                        <Text style={styles.subTitle}>Question</Text>
                        <Text style={styles.text}>{question}</Text>
                    </View>

                    <View style={styles.section}>
                        {discussion && discussion.map((advice, index) => (
                            <View key={index} style={styles.noMargin}>
                                <Text style={styles.text}>{advice.text}</Text>
                                <Text style={styles.author}>{advice.fullName}</Text>
                                <Text style={styles.author}>{advice.role}</Text>
                            </View>
                        ))}
                    </View>
                </View>

            </View>

            <View style={styles.footer}>
                <Text>Personal Board AI | PersonalBoard.ai</Text>
            </View>

        </Page>
    </Document>
);


const DownloadPdf = ({ question, directors, discussion, takeaways }) => (
    <PDFDownloadLink document={
            <MyPdf 
                question={question}
                directors={directors}
                discussion={discussion}
                takeaways={takeaways}
            />
        } fileName="somename.pdf">
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
	question: PropTypes.string,
    directors: PropTypes.array,
    discussion: PropTypes.object,
    takeaways: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string
    })),
};

// ----------------------------------------------------------------------