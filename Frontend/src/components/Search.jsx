import { useSearchParams } from "react-router-dom";
import "./Search.css"
import { useEffect, useState } from "react";
import Navbar from './Navbar';
import bobby from '../assets/bobby.png'
import sam from '../assets/SAM.png'
import dean from '../assets/DEAN.png'

export default () => {

    /*
    queryParams =>
        --author
        citations_end: "" 
        citations_start: "" 
        country: "" 
        h-index_end: "" 
        h-index_start: "" 
        works_end: "" 
        works_start: "" 

        -- works
        idioms: ""
        keywords: ""
        date_end: ""
        date_start: ""
    */
    const [queryParams, _] = useSearchParams();
    const [authorData, setAuthorData] = useState([]);
    const [worksData, setWorksData] = useState([]);
    const [loading, setLoading] = useState(true);

    function makeAuthorUrl() {
        let author_url = "https://api.openalex.org/authors?search="+queryParams.get('texto')+"&filter=";
        if (queryParams.get("citations_start")) {
            author_url += `cited_by_count:>${parseInt(queryParams.get("citations_start"))-1},`
        }

        if (queryParams.get("citations_end")) {
            author_url += `cited_by_count:<${parseInt(queryParams.get("citations_end"))+1},`
        }

        if (queryParams.get("country")) {
            let countryList = queryParams.get("country");
            countryList = countryList.replace(/ /g, '').split(",");
            author_url += "affiliations.institution.country_code:";
            for (let i=0; i<countryList.length-1; i++) {
                author_url += `${countryList[i]}|`
            }
            author_url += `${countryList[countryList.length-1]},`
        }

        if (queryParams.get("h-index_start")) {
            author_url += `summary_stats.h_index:>${parseInt(queryParams.get("h-index_start"))-1},`
        }

        if (queryParams.get("h-index_end")) {
            author_url += `summary_stats.h_index:<${parseInt(queryParams.get("h-index_end"))+1},`
        }

        if (queryParams.get("works_start")) {
            author_url += `works_count:>${parseInt(queryParams.get("works_start"))-1},`
        }

        if (queryParams.get("works_end")) {
            author_url += `works_count:<${parseInt(queryParams.get("works_end"))+1},`
        }

        if (author_url[author_url.length-1] === ",") 
            author_url = author_url.substring(0, author_url.length - 1); // Remover a virgula ao final
        return author_url;
    }

    function makeWorksUrl() {
        let works_url = "https://api.openalex.org/works?search="+queryParams.get('texto')+"&filter=";

        if (queryParams.get("keywords")) {
            let keywords = queryParams.get("keywords");
            keywords = keywords.split(",");
            works_url += "keyword.search:";
            for (let i=0; i<keywords.length-1; i++) {
                works_url += `${keywords[i]}|`
            }
            works_url += `${keywords[keywords.length-1]},`
        }

        if (queryParams.get("idioms")) {
            let idiomsList = queryParams.get("idioms");
            idiomsList = idiomsList.replace(/ /g, '').split(",");
            works_url += "language:";
            for (let i=0; i<idiomsList.length-1; i++) {
                works_url += `${idiomsList[i]}|`
            }
            works_url += `${idiomsList[idiomsList.length-1]},`
        }

        if (queryParams.get("date_start")) {
            works_url += `from_publication_date:${queryParams.get("date_start")},`
        }

        if (queryParams.get("date_end")) {
            works_url += `to_publication_date:${queryParams.get("date_end")},`
        }

        if (works_url[works_url.length-1] === ",") 
            works_url = works_url.substring(0, works_url.length - 1); // Remover a virgula ao final
        return works_url;
    }

    async function makeSearch() {

        // Pesquisando pelo autor
        const authorUrl = makeAuthorUrl();
        const authorResponse = await fetch(authorUrl);
        const authorJson = await authorResponse.json();
        setAuthorData(authorJson.results); // Lista de autores, cada autor é um objeto

        // Pesquisando por trabalhos
        const worksUrl = makeWorksUrl();
        const worksResponse = await fetch(worksUrl);
        const worksJson = await worksResponse.json();
        setWorksData(worksJson.results); // Lista de trabalhos, cada trabalho é um objeto

        setLoading(false);
    }

    useEffect(() => {makeSearch();}, []);

    const WorkBox = (props) => {
        
        const data = props.data;

        return (
            <div className="work-box">
                <a href={data.doi ? data.doi : data.id}>
                    <h3>{data.title}</h3>
                    {data.authorships[0] ? <p>{data.authorships[0].author.display_name}{data.authorships.length > 1 ? " et al." : ""}</p> : ""}
                </a>
            </div>
        );
    }

    const AuthorBox = (props) => {
        const data = props.data;

        return (
            <div className="author-box">
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

    return (
        <>
        <Navbar></Navbar>
        <div className="search">
            {
            loading ? 
            <img src={bobby} alt="Uma imagem do Bobby Singer de Supernatural" className="loading"></img> : 
            <> 
            <section className="result-container" id="works">
                <h1>Publicações</h1>
                {worksData.map((data) => {
                    return <WorkBox key={data.id} data={data}></WorkBox>
                })}
            </section>

            <section className="result-container" id="authors">
                <h1>Autores</h1>
                {authorData.map((data) => {
                    return <AuthorBox key={data.id} data={data}></AuthorBox>
                })}
                
            </section>
            </>
            }
        </div>
        </>
    );
}