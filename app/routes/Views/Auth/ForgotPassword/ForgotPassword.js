import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import config from './../../../../../config';
import { showToast } from "../../Utils/Toast";


import {
    Form,
    FormGroup,
    Input,
    Button,
    Label,
    EmptyLayout,
} from './../../../../components';

import { HeaderAuth } from "../../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../../components/Pages/FooterAuth";

const ForgotPassword = () => {
    const [stage, setStage] = useState('request'); // 'request', 'verify', or 'reset'
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/auth/forgotPassword`, 
                JSON.stringify(email),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.message) {
                setStage('verify');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while sending the request.');
            console.error('Error during password reset request:', err);
        }
    };

    const handleCodeChange = (index, value) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto focus next input if value is entered
        if (value && index < 4) {
            document.getElementById(`code-${index + 1}`).focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
    
        const code = verificationCode.join('');
        if (code.length !== 5) {
            setError('Please enter the full 5 digit code');
            return;
        }
    
        try {
            const response = await axios.post(
                `${config.apiBaseUrl}api/auth/verifyCode`, 
                {
                    email: email,
                    code: code
                }
            );
    
            console.log('Verify Response:', response); // Add this line
            console.log('Response Data:', response.data); // Add this line
    
            // Check the exact structure of the success condition
            if (response.data.message === "Code verified successfully.") {
                setStage('reset');
            } else {
                setError('Authentication failed');
            }
        } catch (err) {
            console.error('Full Error Object:', err); // Add this line
            setError(err.response?.data?.message || 'Authentication failed');
            console.error('Error during code verification:', err);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        // Basic password validation
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            const response = await axios.put(
                `${config.apiBaseUrl}api/auth/ChangePassword`, 
                {
                    oldPassword: null, // Not needed for forgot password flow
                    newPassword: newPassword
                },
                {
                    params: { email: email }
                }
            );
            console.log('Verify ChangePassword:', response.data.success); // Add this line

            if (response.data.success !== false) {
                // Redirect to login or show success message
                history.push('/auth/signin');
                showToast("success", "Change Password successfully!");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Password reset failed');
            console.error('Error during password reset:', err);
            history.push('/auth/signin');
            showToast("error", "Error during password reset!");
        }
    };

    const renderRequestStage = () => (
        <Form className="mb-3" onSubmit={handleEmailSubmit}>
            <FormGroup>
                <Label for="emailAddress">Email Address</Label>
                <Input
                    type="email"
                    name="email"
                    id="emailAddress"
                    placeholder="Enter your email..."
                    className="bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </FormGroup>

            {error && <div className="text-danger mb-3">{error}</div>}

            <Button color="primary" block type="submit">
                Submit
            </Button>
        </Form>
    );

    const renderVerifyStage = () => (
        <Form className="mb-3" onSubmit={handleVerify}>
            <div className="text-center mb-3">
                <p>Enter the verification code sent to {email}</p>
            </div>

            <FormGroup className="d-flex justify-content-center">
                {verificationCode.map((digit, index) => (
                    <Input
                        key={index}
                        type="text"
                        maxLength="1"
                        id={`code-${index}`}
                        className="text-center mx-1"
                        style={{ width: '50px' }}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        pattern="\d*"
                        required
                    />
                ))}
            </FormGroup>

            {error && <div className="text-danger mb-3 text-center">{error}</div>}

            <Button color="primary" block type="submit">
                Confirm
            </Button>

            <div className="text-center mt-3">
                <a href="#" onClick={() => setStage('request')} className="text-muted">
                    Re-send code
                </a>
            </div>
        </Form>
    );

    const renderResetStage = () => (
        <Form className="mb-3" onSubmit={handleResetPassword}>
            <div className="text-center mb-3">
                <p>Reset new password for {email}</p>
            </div>

            <FormGroup>
                <Label for="newPassword">New Password</Label>
                <Input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter new password..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </FormGroup>

            <FormGroup>
                <Label for="confirmPassword">Confirm Password</Label>
                <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Re-enter password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </FormGroup>

            {error && <div className="text-danger mb-3 text-center">{error}</div>}

            <Button color="primary" block type="submit">
                Reset Password
            </Button>
        </Form>
    );

    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                <HeaderAuth 
                    title={
                        stage === 'request' 
                            ? "Forgot Password" 
                            : stage === 'verify' 
                                ? "Verify code" 
                                : "Reset Password"
                    } 
                    text={
                        stage === 'request' 
                            ? "Enter Email address to reset password" 
                            : stage === 'verify' 
                                ? `Please enter the verification code sent to ${email}` 
                                : "Enter new password"
                    }
                />
                
                {stage === 'request' 
                    ? renderRequestStage() 
                    : stage === 'verify' 
                        ? renderVerifyStage() 
                        : renderResetStage()}

                <FooterAuth />
            </EmptyLayout.Section>
        </EmptyLayout>
    );
};

export default ForgotPassword;