import { createTheme } from "@mui/material/styles";

//전체 프로젝트에서 사용할 theme을 지정.
export const theme = createTheme({
    palette: {
      primary: {
        main: "#008CFF",
      },
      secondary: {
        main: "#FF7300",
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
  });