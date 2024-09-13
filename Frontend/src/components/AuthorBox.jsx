import "./AuthorBox.css"
import sam from '../assets/SAM.png'
import dean from '../assets/DEAN.png'
import bobby from '../assets/bobby.png'
import { useNavigate } from "react-router-dom";

export default (props) => {
    const navigate = useNavigate();
    const data = props.data;
    
    function handleRedirect(openAlexId) {
        const splitted = openAlexId.split("/");
        const id = splitted[splitted.length-1];
        navigate(`/autor/${id}`);
    }
    
    return (
        <div onClick={() => {handleRedirect(data.id);}} className="author-box">
                {data.summary_stats.h_index < 15 ? <img src={dean} alt="Uma imagem do Dean Winchester de Supernatural" className="author-photo"></img> :
                 data.summary_stats.h_index < 35 ? <img src={sam} alt="Uma imagem do Sam Winchester de Supernatural" className="author-photo"></img> :
                 <img src={bobby} alt="Uma imagem do Bobby Singer de Supernatural" className="author-photo"></img>
                }
            <div className="author-info">
                <p>
                    <b>{data.display_name}</b>
                    <br></br>
                    {data.last_known_institutions[0] ? <i>{data.last_known_institutions[0].display_name} - {data.last_known_institutions[0].country_code}</i> : ""}
                    <br></br>
                    Número de Trabalhos: {data.works_count}
                    <br></br>
                    Citado por: {data.cited_by_count}
                    <br></br>
                    Índice-H: {data.summary_stats.h_index}
                </p>
            </div>
        </div>
    );
}