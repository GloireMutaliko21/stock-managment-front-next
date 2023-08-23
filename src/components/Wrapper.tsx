import { theme } from '@/utils/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { NextPage } from 'next';
import { useDarkMode } from 'next-dark-mode';
import NextNprogress from 'nextjs-progressbar';
import * as React from 'react';
import Head from 'next/head';
import ToastNotification from '@/components/ToastNotification';

const Wrapper: NextPage<{
  children: React.ReactElement | React.ReactElement[];
}> = ({ children }) => {
  const { darkModeActive } = useDarkMode();
  const mode = darkModeActive ? 'dark' : 'light';

  return (
    <ThemeProvider theme={theme(mode)}>
      <CssBaseline />
      <NextNprogress
        color={theme(mode).palette.primary.main}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={false}
        options={{ easing: 'ease', speed: 500 }}
      />
      <Head>
        <title>La Merva Shop</title>
      </Head>
      <ToastNotification />
      {children}
    </ThemeProvider>
  );
};

export default Wrapper;
