import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Typography, Container, CircularProgress, Button, Card, CardContent, Snackbar, Grid, Backdrop, LinearProgress, Paper, createTheme, ThemeProvider, Box } from '@mui/material';
import { green } from '@mui/material/colors';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Transition } from 'react-transition-group';
import Modal from 'react-modal';
import styled from 'styled-components';
import { IoCloseOutline } from 'react-icons/io5';
const StyledTypography = styled(Typography)({
  marginBottom: '20px', // Adjust this value to increase or decrease the space
});
const StyledModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 4px;
  padding: 20px;
  width: 300px;
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ResultText = styled(Typography)`
  margin-top: 20px;
`;
const StyledButton = styled(Button)({
  marginTop: '20px', // Adjust this value to increase or decrease the space
});
const theme = createTheme({
  palette: {
    primary: green,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 35,
          padding: '10px 25px',
          fontSize: '18px',
          textTransform: 'none',
        },
      },
    },
  },
});

function DetectionComponent({ title, apiUrl }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const resetTest = () => {
    setFile(null);
    setResult(null);
    setOpen(false);
  };
  const onFileUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
    };
    axios.post(apiUrl, formData, config)
      .then(response => {
        setResult(response.data);
        setLoading(false);
        setOpen(true);
      })
      .catch(error => {
        console.error("Error uploading file: ", error);
        setLoading(false);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundImage: 'url(YOUR_BACKGROUND_IMAGE_URL)',
            backgroundSize: 'cover',
            borderRadius: 2,
            width: '50%', // Adjust this value to your liking
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {title}
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <motion.div
                    {...getRootProps()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      border: '2px dashed #eeeeee',
                      borderRadius: '5px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isDragActive ? '#fafafa' : 'white',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <input {...getInputProps()} />
                    {file ? (
                      <Box display="flex" alignItems="center">
                        <CheckCircleOutlineIcon color="success" />
                        <Typography variant="body1" style={{ marginLeft: '10px' }}>
                          {file.name}
                        </Typography>
                      </Box>
                    ) : isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    )}
                  </motion.div>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={onFileUpload} disabled={loading || !file} fullWidth startIcon={<CloudUploadIcon />}>
                    Upload
                  </Button>
                </Grid>
                {loading && (
                  <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={progress} />
                  </Grid>
                )}
                

                

                {result && (
  <StyledModal isOpen={open}>
    <CloseButton onClick={resetTest}>
      <IoCloseOutline />
    </CloseButton>
    <StyledTypography variant="h6" component="h2">
      Test Result
    </StyledTypography>
    <Transition in={result.prediction[0] === 0} timeout={800}>
      {state => (
        <CircularProgressbarWithChildren
          value={result.probability * 100}
          styles={buildStyles({
            pathColor: result.prediction[0] === 0 ? 'green' : 'red',
            trailColor: 'lightgrey',
            transition: 'stroke-dashoffset 0.5s ease 0s',
            pathTransition: state === 'entered' ? 'stroke-dashoffset 0.5s ease 0s' : 'none',
          })}
        >
          <ResultText variant="h6" component="p" color={result.prediction[0] === 0 ? 'green' : 'red'}>
            {result.prediction[0] === 0 ? 'Legitimate' : 'Ransomware'}
          </ResultText>
          <Typography variant="body1" component="p">
            Probability: {Math.round(result.probability * 100)}%
          </Typography>
        </CircularProgressbarWithChildren>
      )}
    </Transition>
    <StyledButton onClick={resetTest} color="primary">
      Perform Another Test
    </StyledButton>
  </StyledModal>
)}


              </Grid>
            </CardContent>
          </Card>
          <Snackbar open={open} onClose={handleClose} message="File uploaded successfully!" />
          <Backdrop open={loading} style={{ color: '#fff', zIndex: 1201 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default DetectionComponent;