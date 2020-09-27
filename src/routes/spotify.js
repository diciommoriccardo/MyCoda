import Router from 'express';
import cookieParser from 'cookie-parser';
import User from '../models/user.model';
import { SPOTIFY } from '../config/constants';
import spotifyApi from '../helpers/spotifyApi';
import jwt from '../helpers/jwt';

const router = Router().use(cookieParser());

router.get('/auth', (req, res) => {
    var state = spotifyApi.genState();

    res.cookie(SPOTIFY.STATE.NAME, state, { maxAge: 60 * 1000, httpOnly: true });
    return res.redirect(spotifyApi.createAuthorizeURL(state));
});

router.get('/auth/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[SPOTIFY.STATE.NAME] : null;

    if (code === null || state === null) return res.status(400).send('Invalid Request');
    if (state !== storedState) return res.status(403).send('Forbidden');
    else res.clearCookie(SPOTIFY.STATE.NAME);

    spotifyApi.authorizationCodeGrant(req.query.code)
    .then((codeGrantRes) => {
        return codeGrantRes.body;
    })
    .then((codeGrant) => {
        spotifyApi.setAccessToken(codeGrant.access_token);
        return spotifyApi.getMe();
    })
    .then((profileRes) => {
        return profileRes.body;
    })
    .then((profile) => {
        var user = new User({
            username: profile.id,
            email: profile.email,
        });
        return user.save();
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

module.exports = router;