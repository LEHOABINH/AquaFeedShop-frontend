import React, { useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { SidebarMenu } from './../../components';
import useAuth from './../../../hooks/useAuth';
import menuConfig from "./menuConfig";

export const SidebarMiddleNav = () => {
    const history = useHistory();
    const { role, hasPermission } = useAuth();

    useEffect(() => {
        if (!role) {
            history.push("/auth/signin");
        }
    }, [role, history]);

    const renderMenu = () => {
        return menuConfig
            .filter(
                (menu) =>
                    (menu.roles && menu.roles.includes(role)) ||
                    (menu.permissions && menu.permissions.some(hasPermission))
            )
            .map((menu, index) =>
                menu.items.map((item, itemIndex) =>
                    item.subItems ? (
                        <SidebarMenu.Item key={`${index}-${itemIndex}`} icon={item.icon} title={item.title}>
                            {item.subItems.map((subItem, subIndex) => (
                                <SidebarMenu.Item key={`${index}-${itemIndex}-${subIndex}`} title={subItem.title} to={subItem.to} />
                            ))}
                        </SidebarMenu.Item>
                    ) : (
                        <SidebarMenu.Item key={`${index}-${itemIndex}`} icon={item.icon} title={item.title} to={item.to} />
                    )
                )
            );
    };

    return <SidebarMenu>{renderMenu()}</SidebarMenu>;
};
