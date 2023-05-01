import { createTheme } from "@mui/material/styles";
import Button from '@mui/material/Button';

//전체 프로젝트에서 사용할 theme을 지정.
export const theme = createTheme({
    palette: {
      primary: {
        main: "#008CFF",
        light: "#a9a9a9",
        dark: "#999999"
      },
      secondary: {
        main: "#dfe6ba",
        light: "#eeeeee",
        dark: "#777777"
      },
      background: {
        default: "#ffffff",
      },
      error: {
        main: "#b71c1c",
      },
      warning: {
        main: "#ffd740",
      },
      success: {
        main: "#43a047",
      },
      info: {
        main: "#2a46e4",
      },
    },

    //Typography 글자크기 커스텀.
    typography: {
      h1: {
        fontSize: "4.5rem" //72px
      },
      h2: {
        fontSize: "3.75rem" //60px
      },
      h3: {
        fontSize: "3rem" //48px
      },
      h4: {
        fontSize: "2rem" //32px
      },
      h5: {
        fontSize: "1.5rem" //24px
      },
      h6: {
        fontSize: "1.25rem" //20px
      },
      subtitle1: {
        fontSize: "1.125rem" //18px
      },
      subtitle2: {
        fontSize: "1rem" //16px
      }
    },

    //MUI TextField 커스텀
    components: {    
      MuiTextField: {      
        defaultProps: {        
          variant: "outlined",        
          fullWidth: true,      
          sx: { mt: 2 },
        },
      },
      MuiTypography: { 
        styleOverrides: { 
          root: {
            wordWrap: "break-word"
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            '&.navButton': {
              width: '6rem',
              backgroundColor: 'transparent',
              padding: '0.2rem',
              color: 'black',
              fontSize: '0.9rem',
              disableRipple: true,
              disableTouchRipple: true,
              disableElevation: true,
              outline: 'none',
              '&:hover': {
                fontSize: '1rem',
              },
              '&:active': {
                fontSize: '1rem',
              },
            },
            '&.loginButton': {
              backgroundColor: 'transparent',
              color: '#008CFF',
              fontSize: '0.9rem',
              disableRipple: true,
              disableTouchRipple: true,
              outline: 'none',
            },
            '&. startButton': {
              width:600,
                height: 80,
                "&:hover, &.Mui-focusVisible": {
                  zIndex: 2,
                  backgroundColor: '#f7f7f7',
                  transform: 'translateY(-7%)',
                },
                borderRadius: 20,
                border: '2px solid #777777'

            }
          }
        }
      },
    },
  });