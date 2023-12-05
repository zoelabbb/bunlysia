import { Elysia } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { jwt } from '@elysiajs/jwt';

const app = new Elysia()
  .use(
    jwt({
      name: 'romanov',
      secret: 'mowzaski',
    })
  )
  .use(cookie())
  .get('/sign/:name', async ({ romanov, cookie, setCookie, params }) => {
    const token = await romanov.sign(params);

    setCookie('auth', token, {
      httpOnly: true,
      maxAge: 7 * 86400,
    });

    return `Sign in as ${params.name}, your token is ${cookie.auth}`;
  })
  .get('/profile', async ({ romanov, set, cookie: { auth } }) => {
    try {
      const profile = await romanov.verify(auth);

      if (!profile) {
        set.status = 401;
        return 'Unauthorized';
      }

      return `Hello ${profile.name}`;
    } catch (error) {
      set.status = 500;
      return 'Internal Server Error';
    }
  })
  .listen(8080);

const test = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: 'kunikuzushi',
      exp: '7d',
    })
  )
  .get('/sign/:name', async ({ jwt, params }) => jwt.sign(params));

console.log('Listening on http://localhost:8080');