import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Container,
    Row,
    Col,
    Card,
    Table,
} from '../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { GroupDetailsContent } from "./components/GroupDetailsContent";

const GroupsDetails = () => {
    const location = useLocation();
    const { groupId } = location.state || {}; // Lấy groupId từ state
    const [mentorName, setMentorName] = useState('');

    return (
        <React.Fragment>
            <Container>
                <HeaderMain 
                    title={`Group Details${mentorName ? ` - Mentor: ${mentorName}` : ' - Mentor: N/A'}`} // Hiển thị mentorName nếu có
                    className="mb-5 mt-4"
                />
                <Row>
                    <Col lg={12}>
                        <Card className="mb-3">
                            <Table className="mb-0" responsive>
                                <thead>
                                    <tr>
                                        <th className="bt-0">Full Name</th>
                                        <th className="bt-0">Email</th>
                                        <th className="bt-0">Major</th>
                                        <th className="bt-0">Student Code</th>
                                        <th className="bt-0">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <GroupDetailsContent groupId={groupId} setMentorName={setMentorName} />
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default GroupsDetails;
