import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Media, Avatar, AvatarAddOn } from "./../../../components";
import axios from "axios";
import Cookies from "js-cookie";

const ProfileHeader = () => {
    const [userData, setUserData] = useState({ fullName: "", avatar: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("${config.apiBaseUrl}api/user/ProfileUser", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('AccessToken')}`
                    }
                });
                const { fullName, avatar } = response.data;
                setUserData({ fullName, avatar });
            } catch (error) {
                console.error("Error fetching user profile:", error.response?.data || error.message);
            }
        };

        fetchProfile();
    }, []);

    return (
        <React.Fragment>
            {/* START Header */}
            <Media className="mb-3">
                <Media left middle className="mr-3 align-self-center">
                    <Avatar.Image
                        size="lg"
                        src={userData.avatar || "https://res.cloudinary.com/dan0stbfi/image/upload/v1722340236/xhy3r9wmc4zavds4nq0d.jpg"}
                        className="mr-2"
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
                </Media>
                <Media body>
                    <h5 className="mb-1 mt-0">
                        <Link to="/apps/profile-details">
                            {userData.fullName || "Loading..."}
                        </Link>{" "}
                        <span className="text-muted mx-1"> / </span> Profile Edit
                    </h5>
                    <Badge color="primary" pill className="mr-2">
                        Premium
                    </Badge>
                    <span className="text-muted">Edit Your Name, Avatar, etc.</span>
                </Media>
            </Media>
            {/* END Header */}
        </React.Fragment>
    );
};

export { ProfileHeader };
