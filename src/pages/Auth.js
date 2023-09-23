import React from "react";
import AuthForm from "../components/Auth/AuthForm";
import ThemeChange from "../components/Layout/ThemeChange";

const AuthPage=()=>{
    return (
    <>
    <div className="d-flex justify-content-center mt-3">
    <ThemeChange/>
    </div>
    <AuthForm/>
    </>
    )
};

export default AuthPage;