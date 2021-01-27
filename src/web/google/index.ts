import { useContext, useEffect } from 'react';
import { AuthContext, AuthProfile, useAuthLogin, Validation } from '../../AuthContext';
import loadScript from '../../utils/load_script';
import removeScript from '../../utils/remove_script';

const GAPI_SRC = 'https://apis.google.com/js/api.js';
const AUTH_ID = 'google';

function toAuthProfile(user: gapi.auth2.GoogleUser) {
  if (!user) return null;
  const profile = user.getBasicProfile();

  return {
    id: profile.getId(),
    type: 'google',
    name: profile.getName(),
    picture: profile.getImageUrl(),
    email: profile.getEmail(),
    token: user.getAuthResponse().id_token,
  };
}

export function useGoogleAuth({ clientId }: { clientId: string }, validation?: Validation) {
  const authManager = useContext(AuthContext);
  
  useEffect(() => {
    const auth = authManager.register(AUTH_ID);

    loadScript(document, 'script', 'google-login', GAPI_SRC, () => {
      const params = {
        client_id: clientId,
        fetch_basic_profile: true,
      }
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init(params).then(auth2 => {
          const provider = {
            type: AUTH_ID,

            login: async () => {
              const user = await auth2.signIn();
              authManager.activate(provider, validation);
              return toAuthProfile(user);
            },
            logout: () => {
              auth2.signOut();
              authManager.activate(null);
            },
            getProfile: () => {
              return toAuthProfile(auth2.currentUser.get())
            },
          }
          auth.setup(provider, auth2.isSignedIn.get(), validation);
        },
          err => {
            auth.clear(err.error);
          })
      })
    }, gapiError => {
      auth.clear(gapiError.message);
    });

    return () => {
      auth.clear();
      removeScript(document, 'google-login')
    }
  }, []);
}

export const useGoogleLogin = useAuthLogin.bind(null, AUTH_ID);
