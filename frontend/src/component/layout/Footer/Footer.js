import playStore from "../../../images/playstore.png";
import appStore from "../../../images/applestore.png";
import "./Footer.css"

const Footer = () => {
   return (
       <footer id="footer">
           <div className="leftFooter">
               <h4>DOWNLOAD OUR APP</h4>
               <p>Download App for Android and IOS mobile phone</p>
               <img src={playStore} alt="playstore" />
               <img src={appStore} alt="Appstore" />
           </div>

           <div className="midFooter">
                <h1>ECOMMERCE</h1>
                <p>High Quality is our first priority</p>
                <p>Copyrights 2022 &copy; MeAmitKumar</p>
           </div>
           
           <div className="rightFooter">
               <h4>Follow Us</h4>
               <a href="https://www.instagram.com/19amit98/">Instagram</a>
               <a href="https://www.linkedin.com/in/amit-kumar-400157148/">LinkedIn</a>
               <a href="https://www.facebook.com/profile.php?id=100020050802770">Facebook</a>
           </div>
       </footer>
   );
};

export default Footer;