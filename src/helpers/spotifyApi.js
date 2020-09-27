import SpotifyWebApi from 'spotify-web-api-node';
import crypto from 'crypto';
import { SPOTIFY } from '../config/constants';

class customSpotifyApi extends SpotifyWebApi {
    createAuthorizeURL(state) {
        return super.createAuthorizeURL(SPOTIFY.SCOPES, state);
    }
    genState() {
        return crypto.randomBytes(SPOTIFY.STATE.LENGTH).toString('hex');
    }
}

const spotifyApi = new customSpotifyApi({
    clientId: SPOTIFY.CLIENT_ID,
    clientSecret: SPOTIFY.SECRET,
    redirectUri: SPOTIFY.REDIRECT_URI,
});

export default spotifyApi;