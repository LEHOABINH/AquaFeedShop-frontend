import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import config from './../../../../../config';
import { jwtDecode } from "jwt-decode";
import styles from "./SignIn.module.css";

import {
    Form,
    FormGroup,
    FormText,
    Input,
    CustomInput,
    Button,
    Label,
    EmptyLayout,
    ThemeConsumer
} from './../../../../components';

import { HeaderAuth } from "../../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../../components/Pages/FooterAuth";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: config.googleClientId,
                callback: handleGoogleLogin
            });

            window.google.accounts.id.renderButton(
                document.getElementById('googleSignInDiv'),
                { theme: 'outline', size: 'large', text: 'signin_with' }
            );
        };

        return () => {
            const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (scriptElement) {
                document.body.removeChild(scriptElement);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/auth/login`, 
                {
                    email: email,
                    password: password,
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {
                history.push('/views/home');
                //alert("Đăng nhập thành công");
            } else {
                setError(response.data.errorMessage || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || 'Login failed');
            console.error('Error during login:', err);
        }
    };

    const handleGoogleLogin = async (response) => {
        try {
            const res = await axios.post(
                `${config.apiBaseUrl}api/auth/google-login`, 
                {
                    token: response.credential
                },
                {
                    withCredentials: true
                }
            );

            if (res.data.success) {
                handleLoginSuccess(res.data.data);
            } else {
                setError(res.data.errorMessage || 'Sign in with Google failed');
            }
        } catch (err) {
            setError(err.response?.data?.errorMessage || 'Error when signing in with Google');
            console.error('Error during Google login:', err);
        }
    };

    const handleLoginSuccess = (token) => {
        sessionStorage.setItem("AccessToken", token);

        try {
            const decoded = jwtDecode(token);
            const role =
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                console.log("Role: ", role);
            // Chuyển hướng dựa trên vai trò
            switch (role) {
                case "Admin":
                    history.push('/views/role-permission');
                    break;
                case "Manager":
                    history.push('/dashboards/manager');
                    break;
                case "Mentor":
                    history.push('/dashboards/mentor');
                    break;
                case "Sponsor":
                    history.push('/Views/Students/Groups');
                    break;
                case "Student":
                    history.push('/apps/syllabus/exe');
                    break;
                default:
                    setError("Vai trò không hợp lệ");
                    history.push('/pages/error-404');
                    break;
            }
        } catch (error) {
            console.error("Invalid token:", error);
            setError("Lỗi trong quá trình xử lý token");
        }
    };

    return (
        <EmptyLayout>
            <div className={styles.signinPage}>
            <div className={styles.signinWrapper}>
                <div className={styles.signinLogoSection} style={{backgroundColor: "#f9e0cf"}}>
                    <img 
                        src="https://res.cloudinary.com/dan0stbfi/image/upload/v1733752123/logo_uniexetask_background_removal_vqirgk.png" 
                        alt="UniEXETask Logo" 
                        className={styles.signinLogo}
                    />
                </div>
                <div className={styles.signinFormSection}>
                    <div className={styles.signinContainer}>
                        <h1 className={styles.signinTitle}>Sign In to UniEXETask</h1>
                        <p className={styles.signinSubtitle}>
                            Access your account with your email or FPT Mail.
                        </p>
                        <form className={styles.signinForm} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="emailAdress">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="emailAdress"
                                    placeholder="Enter email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <div className={styles.errorMessage}>{error}</div>}
                            <button type="submit" className={styles.signinButton}>Sign In</button>
                        </form>

                        <div id="googleSignInDiv" className={styles.googleSignin}></div>
                        <Link to="/auth/forgotpassword" className={styles.signinForgotPassword}>
                            Forgot Password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        </EmptyLayout>
    );
};

export default SignIn;