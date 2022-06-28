import React from 'react';
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";

const About = () => {
  
  const visitInstagram = () => {
      window.location = "https://www.instagram.com/19amit98/";
  }
  return (
    <div className="aboutSection">
           <div></div>
           <div className="aboutSectionGradient"></div>
           <div className="aboutSectionContainer">
                 <Typography component="h1">About Us</Typography>
                 <div>
                      <div>
                          <Avatar 
                            style={{width: "10vmax", height: "10vmax", margin: "2vmax 0"}}
                            src="https://res.cloudinary.com/dwz7ufsh9/image/upload/v1653466276/avatars/sotaijvgtlt6jqh0k6np.jpg"
                            alt="Founder"
                           />
                           <Typography>Amit Kumar</Typography>
                           <Button onClick={visitInstagram} color="primary">Visit Instagram</Button>
                           <span>This is Eshopping Website made by me@AmitKumar. Only in the hope of doing some fun stuff</span>
                      </div>

                      <div className="aboutSectionContainer2">
                           <Typography component="h2">Our Brands</Typography>
                           <a href="https://www.linkedin.com/in/amit-kumar-400157148/" target="blank">
                              <LinkedInIcon className="linkedinSvgIcon" />
                           </a>
                           <a href="https://www.instagram.com/19amit98/" target="blank">
                                <InstagramIcon className="instagramSvgIcon"/>
                           </a>
                      </div>
                 </div>
           </div>

    </div>
  );
};

export default About;