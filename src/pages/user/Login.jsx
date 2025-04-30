import anh from "@/assets/image-form.png";
import { login } from "@/services/authServices";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { useGoogleLogin } from "@react-oauth/google";
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import * as authServices from "@/services/authServices";
import { setToken } from "@/lib/token";
const Login = () => {
  const [fields, setFields] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await login({
      ...fields,
    });
    
    if (res.status === 200) {
      // set token to local storage
      setToken(res.data.token);
      navigate("/");
      setError("");
    } else {
      setError(res.data.message);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      // call API
      const res = await authServices.loginGoogle({
        code: tokenResponse.code,
      })

      console.log(res);
    },
  });
  const handleFacebookCallback = (response) => {
    console.log(response);
    // call API
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 dark:bg-gray-900 bg-gray-50">
      <div className="max-w-4xl w-full flex rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 bg-white">
        {/* Image Section */}
        <div className="w-1/2 bg-blue-50 hidden md:block">
          <div className="relative h-full flex items-center justify-center">
            <img
              src={anh}
              alt="Shopping cart with smartphone and shopping bags"
              className="object-cover w-full rounded-lg"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2 dark:text-white text-gray-900">
              Log in to Exclusive
            </h2>
            <p className="text-sm mb-6 dark:text-gray-400 text-gray-600">
              Enter your details below
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={fields.username}
                  onChange={(e) =>
                    setFields({ ...fields, username: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={fields.password}
                  onChange={(e) =>
                    setFields({ ...fields, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg outline-none transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Log in
                </button>

                <a
                  href="#"
                  className="text-sm hover:underline dark:text-red-400 text-red-500"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="space-y-4 w-full max-w-sm mx-auto">
                <Button
                  variant="outline"
                  className="w-full flex gap-2 items-center justify-center"
                  onClick={googleLogin}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <ReactFacebookLogin
                  appId="581350394609511"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookCallback}
                  render={renderProps => (
                    <Button
                      variant="outline"
                      className="w-full flex gap-2 items-center justify-center bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
                      onClick={renderProps.onClick}
                    >
                      <Facebook className="w-5 h-5" />
                      Continue with Facebook
                    </Button>
                  )}
                />
                <div>
                  <p className="text-sm text-center">
                    Don't have an account?{" "}
                    <Link
                      to={routes.signUp}
                      className="text-sm hover:underline dark:text-red-400 text-red-500"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
