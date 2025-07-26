import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function Login() {
  const navigate = useNavigate();

  const [loading, set_loading] = useState(false);
  const [email, set_email] = useState("");
  const [pass, set_pass] = useState("");

  const checker = async () => {
    set_loading(true);

    if (!email || !pass) {
      alert("Please enter both email and password");
      set_loading(false);
      return;
    }


    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: email,
        pass: pass
      });

      const token = response.data.token;

      set_email("");
      set_pass("");

      if (token) {
        localStorage.setItem("token", token);
        alert("Login successful");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        alert("Login failed");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err.response?.data?.message || "Unexpected error"));
      set_loading(false);
    } finally {
      setTimeout(() => {
        set_loading(false);
      }, 1000);
    }
  };

  return (
    <div className="relative h-full w-full flex justify-center items-center bg-[#CCD7F7]">
      <div className="relative h-[70%] w-[60%] border- rounded-3xl flex bg-white shadow-2xl max-sm:w-[92%] 2xl:max-w-[900px] 2xl:max-h-[800px]">
        <div className="h-full w-full text-white max-xl:hidden">
          <div className="h-full w-full bg-[#5956B1] rounded-l-3xl rounded-r-[180px] flex justify-center items-center">
            <div className="flex flex-col text-center capitalize gap-5 items-center justify-center">
              <div className="flex flex-col gap-3 w-full">
                <h1 className="text-4xl font-medium">welcome back !</h1>
                <p>
                  enter your personal details to use all site <br />
                  features
                </p>
              </div>
              <div>
                <button
                  className="px-10 capitalize rounded-[5px] font-medium py-2 border-2"
                  onClick={() => {
                    navigate("signup");
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full flex flex-col gap-5 items-center justify-center py-20">
          <div className="h-full w-full flex flex-col justify-end items-center gap-8">
            <h1 className="text-6xl capitalize font-semibold ">Sign In</h1>
            <ul className="flex gap-3">
              <li className="border-1 p-1.5 rounded-[5px]">
                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 20 20"
                  version="1.1"

                >
                  <title>google [#178]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"

                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-300.000000, -7399.000000)"
                      fill="#000000"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M263.821537,7247.00386 L254.211298,7247.00386 C254.211298,7248.0033 254.211298,7250.00218 254.205172,7251.00161 L259.774046,7251.00161 C259.560644,7252.00105 258.804036,7253.40026 257.734984,7254.10487 C257.733963,7254.10387 257.732942,7254.11086 257.7309,7254.10986 C256.309581,7255.04834 254.43389,7255.26122 253.041161,7254.98137 C250.85813,7254.54762 249.130492,7252.96451 248.429023,7250.95364 C248.433107,7250.95064 248.43617,7250.92266 248.439233,7250.92066 C248.000176,7249.67336 248.000176,7248.0033 248.439233,7247.00386 L248.438212,7247.00386 C249.003881,7245.1669 250.783592,7243.49084 252.969687,7243.0321 C254.727956,7242.65931 256.71188,7243.06308 258.170978,7244.42831 C258.36498,7244.23842 260.856372,7241.80579 261.043226,7241.6079 C256.0584,7237.09344 248.076756,7238.68155 245.090149,7244.51127 L245.089128,7244.51127 C245.089128,7244.51127 245.090149,7244.51127 245.084023,7244.52226 L245.084023,7244.52226 C243.606545,7247.38565 243.667809,7250.75975 245.094233,7253.48622 C245.090149,7253.48921 245.087086,7253.49121 245.084023,7253.49421 C246.376687,7256.0028 248.729215,7257.92672 251.563684,7258.6593 C254.574796,7259.44886 258.406843,7258.90916 260.973794,7256.58747 C260.974815,7256.58847 260.975836,7256.58947 260.976857,7256.59047 C263.15172,7254.63157 264.505648,7251.29445 263.821537,7247.00386"
                          id="google-[#178]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </li>
              <li className="border-1 p-1.5 rounded-[5px]">
                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 52 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M51.9999 27.158C51.9999 12.7102 40.5825 0.998047 26.4984 0.998047C12.4143 0.998047 0.996948 12.7102 0.996948 27.158C0.996948 40.2151 10.3225 51.0376 22.5138 53.0001V34.7198H16.0388V27.158H22.5138V21.3946C22.5138 14.8383 26.321 11.2168 32.1461 11.2168C34.9362 11.2168 37.8546 11.7277 37.8546 11.7277V18.1655H34.6389C31.471 18.1655 30.4831 20.182 30.4831 22.2508V27.158H37.5557L36.4251 34.7198H30.4831V53.0001C42.6744 51.0376 51.9999 40.2151 51.9999 27.158Z"
                    fill="black"
                  ></path>
                </svg>
              </li>
              <li className="border-1 p-1.5 rounded-[5px]">
                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 20 20"
                  version="1.1"

                >
                  <title>github [#142]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"

                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-140.000000, -7559.000000)"
                      fill="#000000"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                          id="github-[#142]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </li>
              <li className="border-1 p-1.5 rounded-[5px]">
                <svg
                  width="12px"
                  height="12px"
                  viewBox="0 0 20 20"
                  version="1.1"

                >
                  <title>linkedin [#161]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"

                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-180.000000, -7479.000000)"
                      fill="#000000"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M144,7339 L140,7339 L140,7332.001 C140,7330.081 139.153,7329.01 137.634,7329.01 C135.981,7329.01 135,7330.126 135,7332.001 L135,7339 L131,7339 L131,7326 L135,7326 L135,7327.462 C135,7327.462 136.255,7325.26 139.083,7325.26 C141.912,7325.26 144,7326.986 144,7330.558 L144,7339 L144,7339 Z M126.442,7323.921 C125.093,7323.921 124,7322.819 124,7321.46 C124,7320.102 125.093,7319 126.442,7319 C127.79,7319 128.883,7320.102 128.883,7321.46 C128.884,7322.819 127.79,7323.921 126.442,7323.921 L126.442,7323.921 Z M124,7339 L129,7339 L129,7326 L124,7326 L124,7339 Z"
                          id="linkedin-[#161]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </li>
            </ul>
            <p>or use your email for registration</p>
          </div>
          <div className="h-full w-full flex flex-col items-center gap-2 justify-center">
            <input
              type="email"
              className="h-10 w-[80%] bg-gray-200 focus:outline-blue-400 rounded-[5px] px-3"
              placeholder="Email"
              onChange={(email) => { set_email(email.target.value) }}
              value={email}
            />
            <input
              type="password"
              className="h-10 w-[80%] bg-gray-200 focus:outline-blue-400 rounded-[5px] px-3"
              placeholder="Password"
              onChange={(pass) => { set_pass(pass.target.value) }}
              value={pass}
            />
            <div className="text-[13px] capitalize">
              <p className="hover:text-red-400 mt-1"
                onClick={() => {
                  navigate("signup");
                }}
              >
                Not have a account ?
              </p>
            </div>
          </div>

          <div className="h-full w-full flex justify-center items-start">
            {loading ? (
              <ClipLoader
                color="#4E20A7"
                loading={loading}
                size={50}
              />
            ) : (
              <button
                type="submit"
                className="px-10 uppercase rounded-[5px] font-medium py-2 border-2 mt-5 bg-[#4E20A7] text-white"
                onClick={checker}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
