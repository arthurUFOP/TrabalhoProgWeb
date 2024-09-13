import { useParams } from "react-router-dom"
import Navbar from './Navbar';
import "./Author.css"
import { useEffect, useState } from "react";
import bobby from '../assets/bobby.png'
import WorkBox from "./WorkBox";
import AuthorBox from "./AuthorBox";

export default () => {
    const {authorId} = useParams();
    const [loading, setLoading] = useState(true);
    const [authorData, setAuthorData] = useState({});
    const [pubData, setPubData] = useState([]);
    const [coAuthorData, setCoAuthorData] = useState({});
    const [coAuthorsId, setCoAuthorsId] = useState({});

    const maxTopics = 5;

    async function getData() {

        // Dados do autor em si
        const authorUrl = `https://api.openalex.org/authors/${authorId}`;
        const authorResponse = await fetch(authorUrl);
        const authorResponseJson = await authorResponse.json();
        setAuthorData(authorResponseJson);

        // Dados de suas publicações
        const pubsUrl = `https://api.openalex.org/works?filter=authorships.author.id:${authorId}`;
        const pubsResponse = await fetch(pubsUrl);
        const pubsResponseJson = await pubsResponse.json();
        setPubData(pubsResponseJson.results);

        // Dados de coautores
        // Sua relevancia será analisada pelo número de aparições conjuntas ao autor
        const coAuthors = {};
        const coAuthorsCount = {};
        const coAuthorsId = {};
        const authorIdUrl = `https://openalex.org/${authorId}`
        let idxMax = 0;

        for (let i=0; i<pubsResponseJson.results.length; i++) {
            const work = pubsResponseJson.results[i];
            for (let j=0; j<work.authorships.length; j++) {
                if (work.authorships[j] && work.authorships[j].author) {
                    const author = work.authorships[j].author;
                    if (author && (author.id !== authorIdUrl)) { // Nao é o próprio autor da pagina
                        coAuthorsId[author.display_name] = author.id;

                        // Contagem individual
                        if (coAuthors[author.display_name]) 
                            coAuthors[author.display_name] += 1;
                        else 
                            coAuthors[author.display_name] = 1;

                        if (coAuthors[author.display_name] > idxMax)
                            idxMax = coAuthors[author.display_name];
                        
                        // Contagem ranqueada
                        if (coAuthorsCount[coAuthors[author.display_name]]) {
                            coAuthorsCount[coAuthors[author.display_name]].add(author.display_name)
                        }
                        else {
                            coAuthorsCount[coAuthors[author.display_name]] = new Set([author.display_name]);
                        }
                    }
                }
            }
        }

        let coAuthorsSet = new Set();
        let citIdx = idxMax;
        while (coAuthorsSet.size < maxTopics && citIdx>=1) {
            coAuthorsSet = coAuthorsSet.union(coAuthorsCount[citIdx]);
            citIdx--;
        }

        console.log(coAuthorsCount);
        console.log(Array.from(coAuthorsSet));

        setCoAuthorsId(coAuthorsId);
        setCoAuthorData(Array.from(coAuthorsSet).splice(0, maxTopics));

        setLoading(false);
    }

    // Carregando dados do autor
    useEffect(() => {getData()}, []);

    return (
        <>
        <Navbar></Navbar>
        {
        loading ?
        <div className="loading-screen">
            <img src={bobby} alt="Uma imagem do Bobby Singer de Supernatural" className="loading-research"></img>
        </div>
        :
        <div className="searched-author">
            <section id="author-profile" className="author-container">
                <AuthorBox data={authorData}></AuthorBox>
                <div id="interest-topics" className="topics">
                    <h2>Tópicos de Interesse</h2>
                    {authorData.topics.slice(0, maxTopics).map((topic) => {
                        return (
                            <div key={topic.id} className="topic-container">
                                <a href={topic.id}><b>{topic.display_name}</b></a>
                            </div>
                        );
                    })}
                </div>
                <div id="co-authors" className="topics">
                    <h2>Co-autores</h2>
                    {coAuthorData.map((topic) => {
                        return (
                            <div key={topic} className="topic-container">
                                <a href={`/autor/${coAuthorsId[topic].split('/')[coAuthorsId[topic].split('/').length-1]}`}><b>{topic}</b></a>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="work-container" id="works">
                <h1>Publicações</h1>
                {pubData.map((data) => {
                    return <WorkBox key={data.id} data={data}></WorkBox>
                })}
            </section>
        </div>
        }
        </>
    );
}