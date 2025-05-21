import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function AuthLayout({ children }) {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>
      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('@images/bgImage.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <DotLottieReact
          src="https://lottie.host/802c71b3-d04f-45b8-8199-057a2416fc2a/Esuh1XDh7Y.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}

export default AuthLayout;
