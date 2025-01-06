import React, {useEffect, useState } from 'react';
import axios from "axios";
import config from './../../../../config';
import { 
    Container,
    Row,
    Col,
    Card,
    Table,
    Input,
    Button
} from './../../../components';
import { HeaderMain } from "../../components/HeaderMain";
import { showToast } from "./../Utils/Toast";

const RolePermission = () => {
    const [rolesData, setRolesData] = useState([]);  // Dữ liệu Role từ API
    const [featuresData, setFeaturesData] = useState([]);  // Dữ liệu tính năng
    const [permissionsData, setPermissionsData] = useState([]);  // Dữ liệu quyền
    const [selectedRole, setSelectedRole] = useState('');  // Role được chọn
    const [rolePermissions, setRolePermissions] = useState({});  // Quyền của Role
    const [loading, setLoading] = useState(false);  // Trạng thái loading

    useEffect(() => {
        const fetchRoles = async () => {
          setLoading(true);
          try {
            const response = await axios.get(`${config.apiBaseUrl}api/role-permission/roles`, {withCredentials: true});
            if (response.data.success) setRolesData(response.data.data);
            else console.error(response.data.errorMessage);
          } catch (error) {
            console.error('Error fetching roles:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchRoles();
      }, []);

        // Khi Role được chọn, lấy dữ liệu permissions theo Role
    useEffect(() => {
        if (selectedRole) {
        const fetchPermissionsByRole = async () => {
            setLoading(true);
            try {
            const response = await axios.get(`${config.apiBaseUrl}api/role-permission/permissions?role=${selectedRole}`, {withCredentials: true});
            if (response.data.success) {
                const { features, permissions, permissionsWithRole } = response.data.data;
                setFeaturesData(features);
                setPermissionsData(permissions);

                // Khởi tạo quyền mặc định (false)
                const initialPermissions = permissions.reduce((acc, permission) => {
                acc[permission.permissionId] = false;
                return acc;
                }, {});

                // Cập nhật các quyền đã được gán cho role
                permissionsWithRole.forEach((rp) => {
                initialPermissions[rp.permissionId] = true;
                });

                setRolePermissions(initialPermissions);
            } else {
                console.error(response.data.ErrorMessage);
            }
            } catch (error) {
            console.error('Error fetching permissions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissionsByRole();
        }
    }, [selectedRole]);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
      };

    const handlePermissionChange = (permissionId) => {
    setRolePermissions((prevPermissions) => ({
        ...prevPermissions,
        [permissionId]: !prevPermissions[permissionId],
    }));
    };

    const handleSave = async () => {
        try {
        setLoading(true);
        const payload = {
            roleName: selectedRole,
            permissions: Object.keys(rolePermissions).filter((id) => rolePermissions[id]),
        };

        const response = await axios.post(`${config.apiBaseUrl}api/role-permission/update`, payload, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        if (response.data.success) {
            showToast("success", response.data.data);
        } else {
            showToast("error", response.data.errorMessage);
        }
        } catch (error) {
            console.error('Error updating permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <Container>
                <HeaderMain title="Role Permission" className="mb-5 mt-4" />
                
                <Row className="align-items-center mb-3">
                    <Col lg={4}>
                        <Input type="select" value={selectedRole} onChange={handleRoleChange}>
                            <option value="">-- Select Role --</option>
                            {rolesData.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                            ))}
                        </Input>
                    </Col>
                    <Col lg={{ size: 4, offset: 4 }} style={{ textAlign: 'right' }}>
                        <Button color="primary" onClick={handleSave} disabled={!selectedRole}>
                            Save Changes
                        </Button>
                    </Col>
                </Row>
                {selectedRole && (
                <Row>
                    <Col lg={ 12 }>
                        <Card className="mb-3">
                            
                            <Table className="mb-0" responsive>
                                <thead>
                                    <tr>
                                        <th className="bt-0">Feature</th>
                                        <th className="bt-0 text-center">Permission</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {featuresData.map((feature) => (
                                        <tr key={feature.featureId}>
                                            <td>{feature.name}</td>
                                            <td>
                                                <Row>
                                                    {permissionsData
                                                    .filter((perm) => perm.featureId === feature.featureId)
                                                    .map((permission) => (
                                                        <Col xs={4} key={permission.permissionId}>
                                                            <Input
                                                                type="checkbox"
                                                                checked={rolePermissions[permission.permissionId] || false}
                                                                onChange={() => handlePermissionChange(permission.permissionId)}
                                                            />{' '}
                                                            {permission.name}
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        
                        </Card>
                    </Col>
                </Row>
                )}
            </Container>
        </React.Fragment>
    );
};

export default RolePermission;