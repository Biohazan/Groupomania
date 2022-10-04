// import fetchApi from "../utils/hooks/fetchApi"
import { ProfileContext } from "../utils/context/Profile"
import { useContext } from "react"

function Profile() {
const { profile } = useContext(ProfileContext)

    return (
        <div>
        <h1> Profile de {profile.pseudo} </h1>
        <img src={profile.picture} alt="profil" />
        </div>
    )
}

export default Profile