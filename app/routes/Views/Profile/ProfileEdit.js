import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Container,
    Row,
    Col,
    Input,
    Card,
    Button,
    CardBody,
    CardFooter,
    FormGroup,
    Form,
    Label,
    CardTitle,
} from './../../../components';
import { HeaderMain } from "../Profile/components/HeaderMain";
import { ProfileLeftNav } from "../Profile/components/ProfileLeftNav";
import { ProfileHeader } from "../Profile/components/ProfileHeader";
import Cookies from 'js-cookie';
import config from './../../../../config'; 
import { showToast } from "./../Utils/Toast"; 

const ProfileEdit = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [reloadKey, setReloadKey] = useState(0); 

    const reloadProfileHeader = () => {
        setReloadKey(prevKey => prevKey + 1); 
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/user/ProfileUser`, {
                    withCredentials: true,
                });
                const { fullName, phone } = response.data; 
                setFullName(fullName); 
                setPhone(phone); 
            } catch (error) {
                console.error("Error fetching user profile:", error.response?.data || error.message);
                showToast("error", "Could not load profile information."); // Hiển thị thông báo lỗi
            }
        };

        fetchProfile(); 
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault(); // Ngừng hành động mặc định (reload trang)
        
        try {
            const response = await axios.put(`${config.apiBaseUrl}api/user/UpdateProfile`, {
                FullName: fullName,
                Phone: phone,
            }, {
                withCredentials: true,
            });

            if (response.data.success) {
                showToast("success", "Profile updated successfully!"); 
                reloadProfileHeader(); 
            }
        } catch (err) {
            console.error(err.response?.data || err.message);

            const errorMessages = err.response?.data?.errors;
            const firstErrorMessage = errorMessages
                ? Object.values(errorMessages)[0][0] 
                : "Error updating profile."; 

            showToast("error", firstErrorMessage);
        }
    };

    return (
        <React.Fragment>
            <Container>
                <HeaderMain 
                    title="Edit Profile"
                    className="mb-5 mt-4"
                />
                <Row>
                    <Col lg={12}>
                        <ProfileHeader key={reloadKey} /> 
                    </Col>
                    <Col lg={3}>
                        <ProfileLeftNav />
                    </Col>
                    <Col lg={9}>
                        <Card>
                            <CardBody>
                                <div className="d-flex mb-4">
                                    <CardTitle tag="h6">Edit Profile</CardTitle>
                                    <span className="ml-auto align-self-start small">
                                        Fields marked with <span className="text-danger">*</span> are required.
                                    </span>
                                </div>
                                <Form onSubmit={handleUpdateProfile}>
                                    <div className="small mt-4 mb-3">Required</div>
                                    <FormGroup row>
                                        <Label for="Name" sm={3} className="text-right">
                                            <span className="text-danger">*</span> Name
                                        </Label>
                                        <Col sm={8}>
                                            <Input 
                                                type="text" 
                                                id="Name" 
                                                placeholder="Name..." 
                                                value={fullName} 
                                                onChange={(e) => setFullName(e.target.value)} 
                                                required
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="Phone" sm={3} className="text-right">
                                            <span className="text-danger">*</span> Phone
                                        </Label>
                                        <Col sm={8}>
                                            <Input 
                                                type="text" 
                                                id="Phone" 
                                                placeholder="Phone..." 
                                                value={phone} 
                                                onChange={(e) => setPhone(e.target.value)} 
                                                required
                                            />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col sm={8} className="ml-auto">
                                            <Button color="primary" type="submit">
                                                Update Profile
                                            </Button>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default ProfileEdit;
