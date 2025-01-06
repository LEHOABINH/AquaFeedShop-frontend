import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from './../../../../components';
import StudentFormModal from './StudentFormModal';
import MentorFormModal from './MentorFormModal';
import UserFormModal from './UserFormModal';

const RoleSelectionModal = ({ isOpen, toggle, roles, onUserSaved }) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const handleRoleClick = (role) => {
        setSelectedRole(role);
        if (role.name === 'Student') {
            toggle();
            setIsStudentModalOpen(true);
        } else if (role.name === 'Mentor') {
            toggle();
            setIsMentorModalOpen(true);
        } else {
            toggle();
            setIsUserModalOpen(true);
        }
    };

    const closeStudentModal = () => {
        setIsStudentModalOpen(false);
        toggle();
        setSelectedRole(null);
    };

    const closeMentorModal = () => {
        setIsMentorModalOpen(false);
        toggle();
        setSelectedRole(null);
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        toggle();
        setSelectedRole(null);
    };

    const filteredRoles = roles.filter(role => role.name !== 'Admin');

    return (
        <>
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Select Role</ModalHeader>
                <ModalBody style={{ padding: '20px' }}>
                    <p>Please select a role below:</p>
                    <ListGroup style={{ marginBottom: '20px' }}>
                        {filteredRoles.map(role => (
                            <ListGroupItem
                                key={role.roleId}
                                onClick={() => handleRoleClick(role)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedRole?.roleId === role.roleId ? '' : '',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#d3f9d8'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = ''}
                            >
                                <strong>{role.name}</strong> - {role.description}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </ModalBody>
            </Modal>

            {isStudentModalOpen && (
                <StudentFormModal isOpen={isStudentModalOpen} toggle={closeStudentModal} onStudentSaved={onUserSaved} />
            )}

            {isMentorModalOpen && (
                <MentorFormModal isOpen={isMentorModalOpen} toggle={closeMentorModal} onMentorSaved={onUserSaved} />
            )}

            {isUserModalOpen && (
                <UserFormModal isOpen={isUserModalOpen} toggle={closeUserModal} onUserSaved={onUserSaved} />
            )}
        </>
    );
};

RoleSelectionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
};

export default RoleSelectionModal;
