import { cleanupCurrentUser, setCurrentUser } from '@/features/currentUser/currentUser';
import MainContainer from '@/layouts/MainContainer';
import { withSessionSsr } from '@/lib/withSession';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useDispatch } from 'react-redux';

const Sales = dynamic(import('@/screens/sales/Sales'), { ssr: false, loading: () => null });

const Home: NextPage<{ data: { jwt: string; user: User } }> = ({ data }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setCurrentUser(data));
    return () => {
      dispatch(cleanupCurrentUser());
    };
  }, []);

  return (
    <MainContainer>
      <Sales />
    </MainContainer>
  );
};

export const getServerSideProps: GetServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;

  if (req.session?.user?.user?.role === 'SELLER') {
    return {
      redirect: {
        destination: '/access-denied',
        permanent: false,
      },
    };
  }

  if (!req.session?.user?.isLoggedIn) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: req.session?.user,
    },
  };
});


export default Home;
