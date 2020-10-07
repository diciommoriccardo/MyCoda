import Router from 'express';
import cookieParser from 'cookie-parser';
import { SPOTIFY } from '../../../config/constants';
import spotifyApi from '../../../helpers/SpotifyApi';

const router = Router().use(cookieParser());

router.get('/', (req, res) => {
    var state = spotifyApi.genState();
    res.cookie(SPOTIFY.STATE.NAME, state, { maxAge: SPOTIFY.STATE.COOKIE_MAX_AGE, httpOnly: true });
    return res.redirect(spotifyApi.createAuthorizeURL(state));
});

export default router;