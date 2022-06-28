import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png"; // ../ denotes one level up

const options = {
            burgerColor : "#f1c40f",
            burgerColorHover : "#d35400",
            logo,
            logoWidth:"20vmax",
            navColor1:"white",
            logoHoverSize:"10px",
            logoHoverColor:"#F79F1F",
            link1Text:"Home",
            link2Text:"Products",
            link3Text:"Contact",
            link4Text:"About",
            link1Url:"/",
            link2Url:"/products",
            link3Url:"/contact",
            link4Url:"/about",
            link1Size:"1.3vmax",
            link1Color:"rgba(35,35,35,0.8)",
            nav1justifyContent:"flex-end",
            nav2justifyContent:"flex-end",
            nav3justifyContent:"flex-start",
            nav4justifyContent:"flex-start",
            link1ColorHover:"#B53471",
            link1Margin:"1vmax",
            profileIconUrl: "/login",
            profileIconColor:"#cd84f1",
            searchIconColor: "#f8a5c2",
            cartIconColor:"#fab1a0",
            profileIconColorHover:"#fd79a8",
            searchIconColorHover: "#7bed9f",
            cartIconColorHover:"#a4b0be",
            cartIconMargin: "1vmax",
}

const Header = () => {
    return (
        <ReactNavbar {...options}/>
    );
};

export default Header;