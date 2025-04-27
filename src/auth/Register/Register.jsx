import { useContext } from "react";
import { endpoints } from "../../utils/endpoints";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { ErrorHandlingContext } from "../../context/ErrorHandlingContext";

function Register() {
  const { showError } = useContext(ErrorHandlingContext);
  const navigate = useNavigate();

  function onRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerPayload = Object.fromEntries(formData.entries());

    async function callRegisterAPI() {
      const res = await endpoints.auth.register(registerPayload);
      console.log("res : ", res);
      const responseData = res?.data?.responseData;
      console.log("registerResData : ", responseData);

      if (responseData) {
        // set access token in cookies
        setTokenCookies(responseData);
        navigate("/", {
          state: {
            username: responseData.email
          }
        });
      } else {
        showError(["Error while registering the user. Please try again later."]);
      }

    }

    if(registerPayload.password === registerPayload.confirmPassword){
      delete registerPayload.confirmPassword
      Object.entries(registerPayload).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          delete registerPayload[key];
        }
      })
      callRegisterAPI().catch((err) => {
        console.log("Error while calling the register API : ", err);
        showError(err);
      })
    }else{
      showError(["Password and confirm password should be same."]);
    }

  };


  return (
    <div className="flex items-center justify-center  bg-yellow-100" style={{ minHeight: '90vh' }}>
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl border border-orange-300">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">Register</h2>
        <form onSubmit={onRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-orange-700 font-medium">Name*:</label>
            <input
              name="name"
              type="text"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label className="block text-orange-700 font-medium">Email Id*:</label>
            <input
              name="email"
              type="text"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Enter email id"
              required
            />
          </div>
          <div>
            <label className="block text-orange-700 font-medium">Mobile Number:</label>
            <input
              name="mobileNumber"
              type="text"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="block text-orange-700 font-medium">Password*:</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Enter password"
              required
            />
          </div>
          <div>
            <label className="block text-orange-700 font-medium">Confirm Password*:</label>
            <input
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-yellow-50"
              placeholder="Confirm password"
              required
            />
          </div>
          <button className="w-full bg-orange-400 text-white py-2 rounded-lg hover:bg-orange-500 transition font-semibold">
            Register
          </button>
        </form>
      </div>
    </div>
  );

  function setTokenCookies(responseData) {
    let acTokenKey = "_token_ac_" + window.location.hostname;
    let acTokenValue = responseData.accessToken;
    let acTokenExpiry = new Date(responseData.acExpiresIn);
    let acTokenExpiryInDays = (acTokenExpiry.getTime() - Date.now()) / 1000 * 60 * 60 * 24;
    Cookies.set(acTokenKey, acTokenValue, {
      domain: window.location.hostname,
      expires: acTokenExpiryInDays
    });

    // set refresh token in cookies
    let rfTokenKey = "_token_rf_" + window.location.hostname;
    let rfTokenValue = responseData.refreshToken;
    let rfTokenExpiry = new Date(responseData.rfExpiresIn);
    let rfTokenExpiryInDays = (rfTokenExpiry.getTime() - Date.now()) / 1000 * 60 * 60 * 24;
    Cookies.set(rfTokenKey, rfTokenValue, {
      domain: window.location.hostname,
      expires: rfTokenExpiryInDays
    });
  }
}

export default Register;
