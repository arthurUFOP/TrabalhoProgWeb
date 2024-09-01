import { useNavigate } from "react-router-dom";
import bobby from '../assets/bobby.png'
import './Navbar.css'

export default () => {

    const navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="logo" onClick={() => {navigate("/")}}>
                <img src={bobby} alt="Uma imagem do Bobby Singer de Supernatural"></img>
                <h1>SingerFiles</h1>
            </div>
            <h1 onClick={() => navigate("/sobre")}>Sobre</h1>
        </div>
    );
}