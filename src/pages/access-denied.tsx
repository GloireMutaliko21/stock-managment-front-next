import AccessDenied from '@/components/AccessDenied';
import { withSessionSsr } from '@/lib/withSession';
import { GetServerSideProps, NextPage } from 'next';

const Home: NextPage = () => {
  return <AccessDenied />;
};

export const getServerSideProps: GetServerSideProps = withSessionSsr(async (context) => {
  const { req } = context;

  if (!req.session?.user?.isLoggedIn) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});

export default Home;
