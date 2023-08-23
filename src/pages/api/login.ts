import { BASE_URL } from '@/constants/api';
import { postRequest } from '@/lib/api';
import { sessionOptions } from '@/lib/session';
import axios from 'axios';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = await req.body;

  try {
    const response = await axios.post(BASE_URL + '/auth/login', { email, password });

    const { jwt, user } = response.data as Session;

    req.session.user = {
      jwt,
      user,
      isLoggedIn: jwt ? true : false,
    };
    await req.session.save();
    return res.json({ data: response.data });
  } catch (error: any) {
    res.status(500).json(error.response?.data);
  }
}
