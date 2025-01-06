import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
} from './../../../components';

import { HeaderAuth } from "../../components/Pages/HeaderAuth";
import { FooterAuth } from "../../components/Pages/FooterAuth";

const Login = () => {
    const [email, setEmail] = useState(''); // Quản lý email
    const [password, setPassword] = useState(''); // Quản lý mật khẩu
    const [error, setError] = useState(''); // Quản lý lỗi
    const history = useHistory(); // Hook để điều hướng trang

    // Hàm xử lý khi người dùng submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn việc reload trang

        try {
            // Gọi API đăng nhập
            const response = await axios.post('${config.apiBaseUrl}api/auth/login', {
                email: email,
                password: password,
            });

            if (response.data.success) {
                document.cookie = `AccessToken=${response.data.data.accessToken}; path=/; secure;`;
                document.cookie = `RefreshToken=${response.data.data.refreshToken}; path=/; secure;`;

                // Điều hướng đến trang home sau khi đăng nhập thành công
                history.push('/tables/tables');
            } else {
                setError('Email or password is incorrect');
            }
        } catch (err) {
            setError('Lỗi khi gọi API đăng nhập');
        }
    };

    return (
        <EmptyLayout>
            <EmptyLayout.Section center>
                { /* START Header */}
                <HeaderAuth title="Sign In to Application" />
                { /* END Header */}

                { /* START Form */}
                <Form className="mb-3" onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="emailAdress">Email Address</Label>
                        <Input
                            type="email"
                            name="email"
                            id="emailAdress"
                            placeholder="Enter email..."
                            className="bg-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormText color="muted">
                            We'll never share your email with anyone else.
                        </FormText>
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password..."
                            className="bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormGroup>

                    {error && <div className="text-danger mb-3">{error}</div>} {/* Hiển thị lỗi nếu có */}

                    <FormGroup>
                        <CustomInput type="checkbox" id="rememberPassword" label="Remember Password" inline />
                    </FormGroup>

                    <ThemeConsumer>
                        {({ color }) => (
                            <Button color={color} block type="submit">
                                Sign In
                            </Button>
                        )}
                    </ThemeConsumer>
                </Form>
                { /* END Form */}

                { /* START Bottom Links */}
                <div className="d-flex mb-5">
                    <Link to="/pages/forgotpassword" className="text-decoration-none">
                        Forgot Password
                    </Link>
                    <Link to="/pages/register" className="ml-auto text-decoration-none">
                        Register
                    </Link>
                </div>
                { /* END Bottom Links */}

                { /* START Footer */}
                <FooterAuth />
                { /* END Footer */}
            </EmptyLayout.Section>
        </EmptyLayout>
    );
};

export default Login;
