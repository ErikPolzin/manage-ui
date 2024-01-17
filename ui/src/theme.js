import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e2022',
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                root: { // Apply styles to the root class
                    '& .MuiListItemText-primary': { // Target the primary class inside MuiListItemText
                        fontFamily: 'Arial',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#ffffff',
                    },
                    '& .MuiListItemText-secondary': { // Target the secondary class inside MuiListItemText
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        fontSize: '1rem',
                    },
                },
            },
        },
    },
    palette: {
        primary: {
            main: '#1e2022',

        },
        secondary: {
            main: '#7456FD',

        },
        button_green: {
            main: '#33a84c',
            dark: '#1a6900'
        },
        button_red: {
            main: '#bf0000',
            dark: '#600707'
        },

    },
    typography: {
        fontFamily: [
            'Arial', // Fallback font
            'sans-serif', // Generic fallback
        ].join(','),
        h1: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '2',
            color: '#ffffff',
        },
        body: {
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
        },
        body_dark: {
            color: '#3D019F',
            fontFamily: 'Arial, sans-serif',
        },
        body_footer: {
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            fontSize: '0.75rem',
        }
    },

});

export default theme;