import React from 'react';

import { 
    Container,
    Row,
    Col,
    Input,
    Card,
    Button,
    CardBody,
    CardFooter,
    FormText,
    CardTitle,
    CustomInput,
    Label,
    FormGroup,
    Form
} from './../../../components';

import { HeaderMain } from "../../components/HeaderMain";
import { ProfileLeftNav } from "../../components/Profile/ProfileLeftNav";
import { ProfileHeader } from "../../components/Profile/ProfileHeader";

const ProfileEdit = () => (
    <React.Fragment>
        <Container>
            <HeaderMain 
                title="Profile Edit"
                className="mb-5 mt-4"
            />
            { /* START Content */}
            <Row>
                <Col lg={ 12 }>
                   <ProfileHeader />
                </Col>
                <Col lg={ 3 }>
                    <ProfileLeftNav />
                </Col>
                <Col lg={ 9 }>
                    <Card>
                        <CardBody>
                            <div className="d-flex mb-4">
                               <CardTitle tag="h6">
                                    Profile Edit
                               </CardTitle>
                                <span className="ml-auto align-self-start small">
                                    Fields mark as <span className="text-danger">*</span> is required.
                                </span>
                            </div>
                            <Form>
                                <div className="small mt-4 mb-3">
                                    Required
                                </div>
                                { /* START File Select */}
                                <FormGroup row>
                                    <Label for="uploadYourAvatar" sm={3} className="text-right">
                                        Upload Your Avatar
                                    </Label>
                                    <Col sm={8}>
                                        <CustomInput type="file" id="uploadYourAvatar" name="customFile" label="Browse for a file to upload...." />
                                        <FormText color="muted">
                                            JPG, GIF, PNG, MOV and AVI. Please choose a files under 2GB to upload. File sizes are 400 x 300px.
                                        </FormText>
                                    </Col>
                                </FormGroup>
                                { /* END File Select */}
                                { /* START Input */}
                                <FormGroup row>
                                    <Label for="Name" sm={3} className="text-right">
                                        <span className="text-danger">*</span> Name
                                    </Label>
                                    <Col sm={8}>
                                        <Input 
                                            type="text" 
                                            name="" 
                                            id="Name" 
                                            placeholder="Name..." 
                                        />
                                    </Col>
                                </FormGroup>
                                { /* END Input */}
                                { /* START Input */}
                                <FormGroup row>
                                    <Label for="Phone" sm={3} className="text-right">
                                        <span className="text-danger">*</span> Phone
                                    </Label>
                                    <Col sm={8}>
                                        <Input 
                                            type="text" 
                                            name="text" 
                                            id="Phone" 
                                            placeholder="Phone..." 
                                        />
                                    </Col>
                                </FormGroup>
                                { /* END Input */}
                               
                                
                               
                            </Form>
                            { /* END Form */}
                        </CardBody>
                        <CardFooter className="text-right">
                            <Button color="primary">
                                Update Profile
                            </Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
            { /* END Content */}

        </Container>
    </React.Fragment>
);

export default ProfileEdit;