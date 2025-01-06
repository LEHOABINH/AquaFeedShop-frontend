import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import thư viện cookie
import PropTypes from 'prop-types';
import config from './../../../../../config'; // Đảm bảo rằng bạn có file cấu hình với đường dẫn API

const DlRowAddress = ({ leftSideClassName, rightSideClassName }) => {
  const [location, setLocation] = useState(''); // Chỉ lưu location
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm state để theo dõi trạng thái tải dữ liệu

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${config.apiBaseUrl}api/user/ProfileUser`, {
          withCredentials: true,
        });

        const campusLocation = response.data.campus?.location; // Lấy location từ campus
        if (campusLocation) {
          setLocation(campusLocation); // Lưu location vào state
        } else {
          setError('Không tìm thấy thông tin địa điểm');
        }
      } catch (err) {
        setError('Lỗi khi lấy thông tin địa điểm từ API');
        console.error('Error fetching location:', err);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    fetchLocation(); // Gọi API khi component render lần đầu
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Hiển thị khi dữ liệu đang tải
  }

  if (error) {
    return <div>{error}</div>; // Hiển thị thông báo lỗi
  }

  return (
    <React.Fragment>
      <dl className="row">
        <dt className={`col-sm-3 ${leftSideClassName}`}>Location</dt>
        <dd className={`col-sm-9 ${rightSideClassName}`}>{location || 'No location information yet'}</dd>
      </dl>
    </React.Fragment>
  );
};

DlRowAddress.propTypes = {
  leftSideClassName: PropTypes.string,
  rightSideClassName: PropTypes.string,
};

DlRowAddress.defaultProps = {
  leftSideClassName: "",
  rightSideClassName: ""
};

export { DlRowAddress };
