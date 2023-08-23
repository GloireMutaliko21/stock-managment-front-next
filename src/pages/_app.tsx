import Wrapper from '@/components/Wrapper';
import { store } from '@/redux/store';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc';
import withDarkMode from 'next-dark-mode';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../styles/globals.css';
dayjs.extend(utc);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Wrapper>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
          <Component {...pageProps} />
        </LocalizationProvider>
      </Wrapper>
    </Provider>
  );
}

export default withDarkMode(MyApp);
