import Router from 'express';
import cookieParser from 'cookie-parser';
import { SPOTIFY } from '../../config/constants';
import usersHelper from '../../helpers/Users';
import jwt from '../../helpers/Jwt';
import spotifyApi from '../../helpers/SpotifyApi';

const router = Router().use(cookieParser());

router.get('/spotify', (req, res) => {
    var state = spotifyApi.genState();

    res.cookie(SPOTIFY.STATE.NAME, state, { maxAge: SPOTIFY.STATE.COOKIE_MAX_AGE, httpOnly: true });
    return res.redirect(spotifyApi.createAuthorizeURL(state));
});

router.get('/spotify/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[SPOTIFY.STATE.NAME] : null;

    if (code === null || state === null) return res.status(400).send('Invalid Request');
    if (state !== storedState) return res.status(403).send('Forbidden');
    else res.clearCookie(SPOTIFY.STATE.NAME);

    spotifyApi.getProfileFromCodeGrant(req.query.code)
    .then((profile) => {
        return usersHelper.createUser({ 
            username: profile.id, 
            email: profile.email,
        })
    })
    .then((doc) => {
        const access_token = jwt.sign({ _id : doc._id });
        return res.status(201).json({
            username: doc.username,
            email: doc.email,
            access_token: access_token,
        });
    })
    .catch((error) => {
        res.status(500).send('Internal Server Error');
        console.error(error);
    })
});

export default router;