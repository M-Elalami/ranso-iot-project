import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import DetectionComponent from './DetectionComponent';

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

function App() {
  const [selectedTitle, setSelectedTitle] = useState("Ransomware Detection");

  const handleTitleClick = (title) => {
    setSelectedTitle(title);
  };

  return (
    <ThemeProvider theme={theme}>
      <header style={{ textAlign: 'center', padding: '20px' }}>
        <span 
          style={{ marginRight: '20px', paddingBottom: '5px', borderBottom: selectedTitle === "Ransomware Detection" ? '2px solid green' : 'none', cursor: 'pointer' }}
          onClick={() => handleTitleClick("Ransomware Detection")}
        >
          Ransomware Detection
        </span>
        <span 
          style={{ marginLeft: '20px', color: 'black', borderBottom: selectedTitle === "IoT Botnets Detection" ? '2px solid green' : 'none', cursor: 'pointer' }}
          onClick={() => handleTitleClick("IoT Botnets Detection")}
        >
          IoT Botnets Detection
        </span>
      </header>
      <DetectionComponent 
        title={selectedTitle} 
        apiUrl={selectedTitle === "Ransomware Detection" ? "http://localhost:5000/predict" : "IOT_API_URL"} 
      />
    </ThemeProvider>
  );
}

export default App;