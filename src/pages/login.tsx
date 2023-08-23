// import { withSessionSsr } from '@/lib/withSession';
import { withSessionSsr } from 'lib/withSession';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

const Login = dynamic(import('@/screens/Login'));

const Home = () => {
  return <Login />;
};

export const getServerSideProps: GetServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;

  if (req.session?.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Home;
