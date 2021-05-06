import Router from 'express';
import cookieParser from 'cookie-parser';
import { SPOTIFY, JWT } from '../../config/constants';
import UsersHelper from '../../helpers/Users';
import jwt from '../../helpers/Jwt';
//import spotifyApi from '../../helpers/SpotifyApi';

const router = Router().use(cookieParser());

router.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    //const storedState = req.cookies ? req.cookies[SPOTIFY.STATE.NAME] : null;

    if (code === null || state === null) return res.status(400).json({ error: 'Invalid request' });
    if (state !== storedState) return res.status(403).json({ error: 'Forbidden' });
    //else res.clearCookie(SPOTIFY.STATE.NAME);

    spotifyApi.getProfileFromCodeGrant(req.query.code)
        .then((profile) => {
            return new UsersHelper({
                username: profile.id,
                email: profile.email,
            }).login();
        })
        .then(({ _id, username, email, refresh_token }) => {
            const access_token = jwt.signAccessToken({ username });
            return res.status(201).json({ username, email, access_token, expires_in: JWT.EXPIRES_IN, refresh_token });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send({ error: 'Internal server error' });
        })
});

export default router;