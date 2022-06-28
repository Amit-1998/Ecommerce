import React, {Fragment, useState, useEffect} from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loader/Loader.js";
import { useHistory } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
// import LockOpenIcon from "@material-ui/icons/LockOpen";
import FaceIcon from "@material-ui/icons/Face";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PROFILE_RESET } from "../../constants/userConstants";
import MetaData from "../layout/MetaData";

const UpdateProfile = () => {
     const dispatch = useDispatch();
     const alert = useAlert();
     const history = useHistory();

     const { user } = useSelector(state => state.user);
     const { error, isUpdated, loading } = useSelector(state => state.profile);

     const [name, setName] = useState("");
     const [email, setEmail] = useState("");
     const [avatar, setAvatar] = useState();
     const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

     const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        // myForm.set("password", password);
        myForm.set("avatar", avatar);
        /* console.log("Sign Up Form Submitted"); */
        dispatch(updateProfile(myForm)); // form submit karne par dispatch kar dia yani updateProfile function calll kar dia
    }

    const updateProfileDataChange = (e) => {
        
            const reader = new FileReader();
            
            reader.onload = () => {
                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
    };
    
    // switchTabs ke upar useEffect lga dia
    useEffect(() => {
        if( user ){
           setName(user.name);
           setEmail(user.email);
           setAvatarPreview(user.avatar.url);
        }
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(isUpdated){
            alert.success("Profile Updated successfully");
            dispatch(loadUser());
            history.push("/account");
            dispatch({
                type: UPDATE_PROFILE_RESET,
            });
        }
    }, [dispatch,error,alert,history,user,isUpdated]);

    return (
    <Fragment>
         { loading ? <Loader />: ( 
           <Fragment>
                <MetaData title="Update Profile" />
                <div className="updateProfileContainer">
                    <div className="updateProfileBox">
                        <h2 className="updateProfileHeading">Update Profile</h2>

                        <form className="updateProfileForm" encType="multipart/form-data" onSubmit={updateProfileSubmit}>
                            <div className="updateProfileName">
                                <FaceIcon />
                                <input type="text" placeholder="Name" required name="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="updateProfileEmail">
                            <MailOutlineIcon />
                            <input type="email" placeholder="Email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div id="updateProfileImage">
                            <img src={avatarPreview} alt="Avatar Preview" />
                            <input type="file" name="avatar" accept="image/*" onChange={updateProfileDataChange} />
                            </div>

                            <input type="submit" value="Update" className="updateProfileBtn" />
                        </form>
                    </div>
                </div>
           </Fragment> )
         }
    </Fragment>
    );
};

export default UpdateProfile;