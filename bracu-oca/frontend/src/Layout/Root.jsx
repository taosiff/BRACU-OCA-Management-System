import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <>
      <div className="font-poppins min-h-screen" data-theme="messi" style={{
        background: "linear-gradient(180deg, #5BC0EB 0%, #A8E6FF 40%, #FFFFFF 100%)"
      }}>
        <Outlet />
      </div>
    </>
  );
};

export default Root;
