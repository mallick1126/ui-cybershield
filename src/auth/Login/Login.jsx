import { useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { endpoints } from "../../utils/endpoints";
import Cookies from 'js-cookie';
import { setTokenInCookies } from '../../utils/TokenUtil';
import { CommonContants } from '../../utils/Constants';
import { ErrorHandlingContext } from '../../context/ErrorHandlingContext';
import Loader from '../../common-components/Loader';

function Login() {
  const { showError } = useContext(ErrorHandlingContext);
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const code = queryParams.get('code');
  const state = queryParams.get('state')

  // check if redirected from the oauth flow if so then get the access token and 
  // refresh token and redirect to home page
  try {
    if (code && state && Cookies.get(CommonContants.oauthCachedKey)) {
      let payload = {
        authCachedKey: Cookies.get(CommonContants.oauthCachedKey),
        authCode: code,
        returnedState: state
      }

      async function loginUsingAuthCode() {
        const res = await endpoints.auth.login(payload);
        const responseData = res?.data?.responseData;
        setTokenInCookies(responseData);
        Cookies.remove(CommonContants.oauthCachedKey);

        navigate("/", {
          state: {
            username: responseData.username
          }
        });
      };

      loginUsingAuthCode().catch((err) => {
        console.log("err : ", err);
        Cookies.remove(CommonContants.oauthCachedKey);
        showError(["Error while calling the token API using code and state!"]);
      });

    }
  } catch (error) {
    console.log("OauthCallback_error : ", error);
    Cookies.remove(CommonContants.oauthCachedKey);
    showError(["Error while calling the token API using code and state !"]);
  }



  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jsonDataPayLoad = Object.fromEntries(formData.entries());

    try {
      const loginRes = async () => {
        let loginRes = await endpoints.auth.login(jsonDataPayLoad);
        console.log("loginRes : ", loginRes);
        let responseData = loginRes?.data?.responseData;
        setTokenInCookies(responseData);

        navigate("/", {
          state: {
            username: responseData.username
          }
        });
      };

      loginRes().catch((err) => {
        console.log("rejected promise : ", err);
        showError(["Error while logging in. Please try again later. (pressing login button)"]);
      });

    } catch (error) {
      console.log("Error_login_API : ", error);
      showError(["Error while logging in. Please try again later. (pressing login button)"]);
    };
  };

  function handleOauthRedirect(e) {
    try {
      e.preventDefault();
      const eProvider = e.currentTarget.id;
      console.log("provider : ", eProvider);

      async function getTheAuthCodeUrl(provider) {
        const authCodeUrlRes = await endpoints.auth.authorize(provider);
        console.log("authCodeUrlRes : ", authCodeUrlRes);
        const authCodeRedirectData = authCodeUrlRes?.data?.responseData;

        // Set cachedKey in cookies
        let cachedKey = CommonContants.oauthCachedKey;
        let cachedKeyValue = authCodeRedirectData.cachedKey;
        let cahedKeyExpiresIn = (1 / 96); // expires in 15 mins
        Cookies.set(cachedKey, cachedKeyValue, {
          domain: window.location.hostname,
          expires: cahedKeyExpiresIn
        });

        window.location.href = authCodeRedirectData.authorizeUrl;
      }

      getTheAuthCodeUrl(eProvider).catch((err) => {
        console.log("error : ", err);
        showError(["Error while getting the auth code url. Please try again later."]);
      })

    } catch (error) {
      console.log("handleOauthRedirect_error : ", error);
      showError(["Error while getting the auth code url. Please try again later."]);
    }
  }

  if (code && state && Cookies.get(CommonContants.oauthCachedKey)) {
    return <Loader/>
  }

  return (
    <div className="flex items-center justify-center bg-yellow-100" style={{ minHeight: '90vh' }}>
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl border border-orange-300">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-orange-700 font-medium">Email:</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Enter email"
              name='username'
              required
            />
          </div>
          <div>
            <label className="block text-orange-700 font-medium">Password:</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Enter password"
              name='password'
              required
            />
          </div>
          <button type='submit' className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 transition font-semibold">
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-orange-700 font-medium">Or sign in with</div>
        <div className="flex justify-center gap-10 mt-4">
          <button onClick={handleOauthRedirect} id='google' key='google' className="`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition border-3 border-white hover:border-3 hover:border-amber-600/50 ">
            <img src="/google-logo.png" alt="google-logo.png" className="w-10 h-10 rounded-lg" />
            {/* <span>Google</span> */}
          </button>
          <button onClick={handleOauthRedirect} id='github' key='github' className="`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition border-3 border-white hover:border-3 hover:border-amber-600/50 ">
            <img src="/github-logo.png" alt="github-logo.png" className="w-10 h-10 rounded-lg" />
            {/* <span>Github</span> */}
          </button>
          <button onClick={handleOauthRedirect} id='facebook' key='facebook' className="`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition border-3 border-white hover:border-3 hover:border-amber-600/50 ">
            <img src="/facebook-logo.png" alt="facebook-logo.png" className="w-10 h-10 rounded-lg" />
            {/* <span>Facebook</span> */}
          </button>
        </div>
        <p className="text-center mt-4 text-orange-700">
          Not a member? <Link to="/auth/register" className="text-orange-500 hover:underline">Register now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
