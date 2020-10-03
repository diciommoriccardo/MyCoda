import SpotifyWebApi from 'spotify-web-api-node';
import crypto from 'crypto';
import { SPOTIFY } from '../config/constants';

class customSpotifyApi extends SpotifyWebApi {
    genState() {
        return crypto.randomBytes(SPOTIFY.STATE.LENGTH).toString('hex');
    }
    createAuthorizeURL(state) {
        return super.createAuthorizeURL(SPOTIFY.SCOPES, state);
    }
    getProfileFromCodeGrant(code) {
        return this.authorizationCodeGrant(code)
            .then((codeGrantRes) => {
                return codeGrantRes.body;
            })
            .then((codeGrant) => {
                this.setAccessToken(codeGrant.access_token);
                return this.getMe();
            })
            .then((profileRes) => {
                return profileRes.body;
            })
    }
}

const spotifyApi = new customSpotifyApi({
    clientId: SPOTIFY.CLIENT_ID,
    clientSecret: SPOTIFY.SECRET,
    redirectUri: SPOTIFY.REDIRECT_URI,
});

export default spotifyApi;