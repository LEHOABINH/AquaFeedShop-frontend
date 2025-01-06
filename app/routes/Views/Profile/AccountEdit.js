import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Row,
    Col,
    Input,
    Button,
    FormGroup,
    Label,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Form
} from './../../../components';
import { showToast } from "./../Utils/Toast"; // Nhập showToast
import { HeaderMain } from "../Profile/components/HeaderMain";
import { ProfileLeftNav } from "../Profile/components/ProfileLeftNav";
import { ProfileHeader } from "../Profile/components/ProfileHeader";
import config from './../../../../config';

const AccountEdit = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault(); // Ngừng hành động mặc định (reload trang)

        if (newPassword !== confirmPassword) {
            showToast("error", "New password and confirm password do not match.");
            return;
        }

        try {
            const response = await axios.put(`${config.apiBaseUrl}api/user/ChangePassword`, {
                oldPassword,
                newPassword
            }, {
                withCredentials: true,
            });

            if (response.data.success) {
                showToast("success", "Password changed successfully!");
            } else {
                showToast("error", "Unable to change password.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.errorMessage || "Failed to change password.";
            showToast("error", errorMessage);
        }
    };


    return (
        <Container>
            <HeaderMain
                title="Change Password"
                className="mb-5 mt-4"
            />
            <Row>
                <Col lg={12}>
                    <ProfileHeader />
                </Col>
                <Col lg={3}>
                    <ProfileLeftNav />
                </Col>
                <Col lg={9}>
                    <Card className="mb-3">
                        <CardBody>
                            <div className="d-flex mb-4">
                                <CardTitle tag="h6">Change Password</CardTitle>
                                <span className="ml-auto align-self-start small">
                                    Fields marked with <span className="text-danger">*</span> are required.
                                </span>
                            </div>
                            <Form onSubmit={handleChangePassword}>
                                <FormGroup row>
                                    <Label for="oldPassword" sm={3} className="text-right">
                                        <span className="text-danger">*</span> Old Password
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            type="password"
                                            id="oldPassword"
                                            placeholder="Old password..."
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="newPassword" sm={3} className="text-right">
                                        <span className="text-danger">*</span> New Password
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            type="password"
                                            id="newPassword"
                                            placeholder="New password..."
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="confirmPassword" sm={3} className="text-right">
                                        <span className="text-danger">*</span> Confirm New Password
                                    </Label>
                                    <Col sm={8}>
                                        <Input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="Confirm new password..."
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Col sm={8} className="ml-auto">
                                        <Button color="primary" type="submit">
                                            Update Password
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                        <CardFooter className="small">
                            <i className="fa fa-fw fa-support text-muted mr-2"></i>
                            If you have any issues, please contact us. <a href="#">unitask68@gmail.com</a>
                        </CardFooter>
                    </Card>

                    {/* Other sections (e.g., change username, delete account) */}
                    {/* <Card className="mb-3">
                        <CardBody>
                           <CardTitle tag="h6">
                                Change Username
                           </CardTitle>
                            <p>
                                Changing your username is not recommended as it may cause some issues.
                            </p>
                            <Button color="secondary" outline>
                                Change Username
                            </Button>
                        </CardBody>
                    </Card>

                    <Card className="mb-3 b-danger">
                        <CardBody>
                           <CardTitle tag="h6" className="text-danger">
                                Delete Account
                           </CardTitle>
                            <p>
                                Once you delete your account, there is no going back. Please be sure before proceeding.
                            </p>
                            <Button color="danger" outline>
                                Yes, Delete Account
                            </Button>
                        </CardBody>
                        <CardFooter className="small">
                            <i className="fa fa-fw fa-support text-muted mr-2"></i>
                            Are you sure you don’t want to downgrade your account to a <strong>Free Account</strong>? We won’t charge your PayPal account anymore.
                        </CardFooter>
                    </Card> */}
                </Col>
            </Row>
        </Container>
    );
};

export default AccountEdit;
