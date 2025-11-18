import axios from "axios";
import '../../CSSFolder/login.css';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { connectWebSocket , disconnectWebSocket} from "../../JSFolder/websocket";
import {apiUrl} from "../../JSFolder/ApiLink";




function Login({ setUser, setUserDetails }) {
    const [CheckSignInorSignup, setCheckSignInorSignup] = useState(true);
    const [step, setStep] = useState(0);
    const [eye, setEye] = useState(true);
    const [eye2, setEye2] = useState(true);
    const [loadprofile, setLoadprofile] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [userDataForWS, setUserDataForWS] = useState(null);

    // useEffect(() => {
    //     if (userDataForWS?.username) {
    //         if (userDataForWS?.username) {
    //             connectWebSocket(
    //                 userDataForWS.username
    //             );
    //         }
    //     }
    // }, [userDataForWS]);

    useEffect(() => {
        if (!userDataForWS?.username) return;

        connectWebSocket(
            userDataForWS.username
        );

        // return () => disconnectWebSocket();
    }, [userDataForWS]);


    const [loginform, setLoginform] = useState({
        email: "",
        password: ""
    });

    const [RePassword, setRePassword] = useState("");

    const [form, setForm] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        profilePic: ""
    });

    const defaultPic = "Image\\defaultPro.jpeg";

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append("file", file);

        const res = await axios.post(`${apiUrl}/api/user/uploadProfilePic/1`, data);
        if (res.data) {
            form.profilePic = res.data;
            setLoadprofile(true);
        }
    };

    const changebtnForEye01 = () => {
        setEye(!eye);
    };

    const changebtnForEye02 = () => {
        setEye2(!eye2);
    };

    const changebtnIN = () => {
        setCheckSignInorSignup(true);
    };
    const changebtnUP = () => {
        setCheckSignInorSignup(false);
    };
    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const submitSignInData = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post(`${apiUrl}/api/user/login`, loginform);
            // console.log(result.data.userFount._id);
            if (result) {
                setUser(result.data.email);
                setUserDetails(result.data);
                setUserDataForWS(result.data);
                console.log("signin success");
                navigate("/Home");
            }
        } catch (error) {
            console.log(error);
        }
    };


    const submitSignUpData = async (e) => {
        e.preventDefault();
        if (form.password !== RePassword) {
            console.log("not match pwd");
            return;
        }
        try {

            const result = await axios.post(`${apiUrl}/api/user/signup`, form);
            console.log("signup success");
            navigate("/Home");
        } catch (error) {
            console.log("something went wrong", error);
        }
    };

    return (
        <div className="loginMain">
            <div className="loginForm">
                <form className="formForLogin" onSubmit={CheckSignInorSignup ? submitSignInData : submitSignUpData}>
                    <div className="formTitle">
                        <div className="Psignin" >
                            {CheckSignInorSignup ? (<p>Login.<span>.</span>.<span>.</span></p>) : (<p>SignUp.<span>.</span>.<span>.</span></p>)}
                        </div>
                    </div>
                    <div className="loginSlider">
                        <div className="innerSlider">
                            <span onClick={changebtnIN} className={CheckSignInorSignup ? "inloginSlider sliderCommon selectedOption" : "insignupSlider sliderCommon unselectedOption"}>Login</span>
                            <span onClick={changebtnUP} className={CheckSignInorSignup ? "inloginSlider sliderCommon unselectedOption" : "insignupSlider sliderCommon selectedOption"}>SignUp</span>
                        </div>
                    </div>
                    {CheckSignInorSignup ? (
                        <div className="formFields loginPro">
                            <label htmlFor="email">Email Id</label>
                            <input type="email" className="username inputCommon" name="email" id="email" value={loginform.email} onChange={e => setLoginform({ ...loginform, email: e.target.value })} placeholder="xyz@gmail.com" />
                            <label htmlFor="Password">Password</label>
                            <div className="passwordField">
                                <input type={eye == true ? "password" : "text"} className="Password inputCommon" name="Password" id="Password" value={loginform.password} onChange={e => setLoginform({ ...loginform, password: e.target.value })} placeholder="Password!" />
                                <img src={eye == true ? "Image\\icons8-closed-eye-16.png" : "Image\\icons8-eye-16.png"} alt="" onClick={changebtnForEye01} />
                            </div>
                            <input type="submit" className="Submit" value={CheckSignInorSignup ? "Login" : "SignUp"} />
                        </div>
                    ) : (
                        <>
                            <div className="formFields loginPro signupCss" style={{ display: step === 0 ? "flex" : "none" }}>
                                <label htmlFor="username">UserName</label>
                                <input type="text" className="username inputCommon" name="username" id="username" placeholder="Abc1234" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                                <label htmlFor="firstname">FirstName</label>
                                <input type="text" className="firstname inputCommon" name="firstname" id="firstname" placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                                <label htmlFor="lastname">LastName</label>
                                <input type="text" className="lastname inputCommon" name="lastname" id="lastname" placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                                <div className="nextorback">
                                    <div onClick={handleBack} className="back commonNorB" style={{ display: step === 0 ? "none" : "flex" }}>Back</div>
                                    <div onClick={handleNext} className="next commonNorB" style={{ display: step === 2 ? "none" : "flex" }}>Next</div>
                                </div>
                            </div>
                            <div className="formFields loginPro signupCss" style={{ display: step === 1 ? "flex" : "none" }}>
                                <label htmlFor="email">Email Id</label>
                                <input type="email" className="username inputCommon" name="email" id="email" placeholder="xyz@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                <label htmlFor="Password">Password</label>
                                <input type={eye2 == true ? "password" : "text"} className="Password inputCommon" name="Password" id="Password" placeholder="Password!" value={RePassword} onChange={(e) => setRePassword(e.target.value)} />
                                <label htmlFor="Password">Re-Password</label>
                                <div className="passwordField">
                                    <input type={eye2 == true ? "password" : "text"} className="Password inputCommon" name="re-Password" id="re-Password" placeholder="Re-Password!" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                    <img src={eye2 == true ? "Image\\icons8-closed-eye-16.png" : "Image\\icons8-eye-16.png"} alt="" onClick={changebtnForEye02} />
                                </div>
                                <div className="nextorback">
                                    <div onClick={handleBack} className="back commonNorB" style={{ display: step === 0 ? "none" : "flex" }}>Back</div>
                                    <div onClick={handleNext} className="next commonNorB" style={{ display: step === 2 ? "none" : "flex" }}>Next</div>
                                </div>
                            </div>
                            <div className="formFields loginPro signupCss profileheight" style={{ display: step === 2 ? "flex" : "none" }}>
                                <div className="profileupload">
                                    <div className="selectedImg">
                                        <img src={loadprofile == false ? defaultPic : form.profilePic} alt="Image\defaultPro.jpeg" />
                                    </div>
                                    <div className="addProfile">
                                        <input type="file" className="profileDefault" ref={fileInputRef} onChange={handleFileChange} />
                                        <div className="uploadBtn" onClick={() => fileInputRef.current.click()}>
                                            Upload
                                        </div>
                                    </div>
                                    <div className="suggestionField">Please upload a 1:1 (square) photo.</div>
                                </div>
                                <div className="nextorback profileCss">
                                    <div onClick={handleBack} className="back commonNorB" style={{ display: step === 0 ? "none" : "flex" }}>Back</div>
                                    <div onClick={handleNext} className="next commonNorB" style={{ display: step === 2 ? "none" : "flex" }}>Next</div>
                                </div>
                                <input type="submit" className="Submit signupsplCss" value={CheckSignInorSignup ? "Login" : "SignUp"} />
                            </div>
                        </>
                    )}

                </form>
            </div>
        </div>
    );
}

export default Login;