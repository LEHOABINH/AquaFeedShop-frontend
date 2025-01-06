import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import thư viện cookie
import PropTypes from 'prop-types';
import config from './../../../../../config'; // Đảm bảo rằng bạn có file cấu hình với đường dẫn API

const DlRowContacts = ({ leftSideClassName, rightSideClassName }) => {
    const [contactData, setContactData] = useState({ phone: '', email: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContactData = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/user/ProfileUser`, {
                    withCredentials: true,
                });
                const { phone, email } = response.data;
                setContactData({ phone, email }); // Lưu số điện thoại và email vào state
            } catch (err) {
                setError('Lỗi khi lấy thông tin liên hệ');
                console.error('Error fetching contact info:', err);
            }
        };

        fetchContactData(); // Gọi hàm để lấy dữ liệu khi component mount
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!contactData.phone && !contactData.email) {
        return <div>Loading...</div>; // Hiển thị trong khi chờ dữ liệu
    }

    return (
        <React.Fragment>
            <dl className="row">
                <dt className={`col-sm-3 ${leftSideClassName}`}>Phone</dt>
                <dd className={`col-sm-9 ${rightSideClassName}`}>{contactData.phone || 'No phone number information yet'}</dd>
                <dt className={`col-sm-3 ${leftSideClassName}`}>Email</dt>
                <dd className={`col-sm-9 ${rightSideClassName}`}>
                    <a href={`mailto:${contactData.email}`}>{contactData.email || 'No email information yet'}</a>
                </dd>
            </dl>
        </React.Fragment>
    );
};

DlRowContacts.propTypes = {
    leftSideClassName: PropTypes.node,
    rightSideClassName: PropTypes.node,
};

DlRowContacts.defaultProps = {
    leftSideClassName: "text-right",
    rightSideClassName: "text-left",
};

export { DlRowContacts };
