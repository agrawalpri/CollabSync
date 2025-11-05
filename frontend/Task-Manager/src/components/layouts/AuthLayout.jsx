

// export default AuthLayout;
// import React from "react";
// import UI_IMG from "../../assets/images/ui.jpg";

// function AuthLayout({ children }) {
//   return (
//     <div className="flex">
//       <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
//         <h2 className="text-lg font-medium text-black">Task Manager</h2>
//         {children}
//       </div>

//       <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-200 bg-[url('/bg2.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden">
//         <img src={UI_IMG} alt="UI" className="w-64 lg: w-[90%]" />
//       </div>
//     </div>
//   );
// }

// export default AuthLayout;


import React from "react";
import UI_IMG from "../../assets/images/ui.jpg";

function AuthLayout({ children }) {
  return (
    <div className="flex">
      {/* Left side (form/content) */}
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">Task Manager</h2>
        {children}
      </div>

      {/* Right side (image background) */}
      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-200 bg-[url('/bg2.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden">

        <img src={UI_IMG} alt="UI" className="w-64 lg:w-[90%]" />
      </div>
    </div>
  );
}

export default AuthLayout;
