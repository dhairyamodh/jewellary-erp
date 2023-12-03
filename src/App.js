import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import SnackbarComp from './components/Snackbar';

function App() {
  const content = useRoutes(router);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SnackbarComp />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {content}
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}
export default App;
