import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Media, Avatar, AvatarAddOn } from "./../../../../components";
import axios from "axios";
import Cookies from "js-cookie";
import config from './../../../../../config'; 
import { showToast } from "./../../Utils/Toast";

const ProfileHeader = () => {
    const [userData, setUserData] = useState({ fullName: "", avatar: "", roleName: "" });
    const [fileInput, setFileInput] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}api/user/ProfileUser`, {
                    withCredentials: true,
                });
                const { fullName, avatar, role } = response.data;
                setUserData({ fullName, avatar, roleName: role.name });
            } catch (error) {
                console.error("Error fetching user profile:", error.response?.data || error.message);
                showToast("error", "Không thể tải thông tin hồ sơ.");
            }
        };

        fetchProfile();
    }, []);

    const handleAvatarClick = () => {
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            
            try {
                const response = await axios.put(`${config.apiBaseUrl}api/user/UploadProfileAvatar`, formData, {
                    withCredentials: true,
                });
                setUserData(prevState => ({ ...prevState, avatar: response.data.data }));
                showToast("success", "Profile picture updated successfully!");
            } catch (error) {
                console.error("Error uploading avatar:", error.response?.data || error.message);
                showToast("error", "Lỗi khi tải lên ảnh đại diện.");
            }
        }
    };

    return (
        <React.Fragment>
            <style>{`
                .avatar-container {
                    position: relative;
                    display: inline-block;
                    cursor: pointer;
                }

                .avatar-container .change-text {
                    position: absolute;
                    bottom: 15px;
                    left: 45%;
                    transform: translateX(-50%);
                    opacity: 0;
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                    transition: opacity 0.3s, transform 0.3s;
                }

                .avatar-container:hover .change-text {
                    opacity: 1;
                    transform: translate(-50%, -10px);
                }

                .avatar-container:hover .avatar-image {
                    filter: blur(2px);
                    transform: scale(1.1);
                }
            `}</style>

            <Media className="mb-3">
                <Media left middle className="mr-3 align-self-center">
                    <div className="avatar-container" onClick={handleAvatarClick}>
                        <Avatar.Image
                            size="lg"
                            src={userData.avatar || "https://res.cloudinary.com/dan0stbfi/image/upload/v1722340236/xhy3r9wmc4zavds4nq0d.jpg"}
                            className="mr-2 avatar-image"
                            addOns={[
                                <AvatarAddOn.Icon
                                    className="fa fa-circle"
                                    color="white"
                                    key="avatar-icon-bg"
                                />,
                                <AvatarAddOn.Icon
                                    className="fa fa-circle"
                                    color="success"
                                    key="avatar-icon-fg"
                                />,
                            ]}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            ref={input => setFileInput(input)}
                            onChange={handleFileChange}
                        />
                        <div className="change-text">Change</div>
                    </div>
                </Media>
                <Media body>
                    <h5 className="mb-1 mt-0">
                        <Link to="/Views/Profile/ProfileDetails">
                            {userData.fullName || "Loading..."}
                        </Link>{" "}
                        <span className="text-muted mx-1"> / </span> Profile Edit
                    </h5>
                    <Badge color="primary" pill className="mr-2">
                        {userData.roleName || "Premium"}
                    </Badge>
                </Media>
            </Media>
        </React.Fragment>
    );
};

export { ProfileHeader };
