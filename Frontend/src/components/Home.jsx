import './Home.css'
import { useNavigate } from "react-router-dom";
import filtro from '../assets/filtro.png'
import ok_img from '../assets/ok.png'
import Navbar from './Navbar';
import { useEffect, useState } from 'react';

export default () => {
    const navigate = useNavigate();
    const [queryParams, setQueryParams] = useState({});
    const [isFiltering, setIsFiltering] = useState(false);

    const handleSubmit = () => {
        const textarea = document.querySelector('#searchArea');
        let qString = `/pesquisa?texto=${textarea.value}`

        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== "") {
                qString += `&${key}=${value}`
            }
        }

        navigate(qString);
    }

    // Botao de filtro
    const FilterButton = () => {
        return <img onClick={() => {setIsFiltering(true)}} src={filtro} className={'filterButton'}></img>
    }

    // Campo para alteracao de um query param
    const FilterField = (props) => {
        const type = props.type

        const fieldName = (props.type !== "date" && props.type !== "number") ? props.name : (props.name + "_start")
        const fieldName2 = (props.type !== "date" && props.type !== "number") ? props.name : (props.name + "_end")

        const [value, setValue] = useState(queryParams[fieldName] ? queryParams[fieldName] : "")
        const [value2, setValue2] = useState(queryParams[fieldName2] ? queryParams[fieldName2] : "")

        useEffect(() => {
            const newParams = queryParams;
            newParams[fieldName] = value;
            setQueryParams(newParams);
        }, [value]);

        useEffect(() => {
            const newParams = queryParams;
            newParams[fieldName2] = value2;
            setQueryParams(newParams);
        }, [value2]);

        return (
            <div className='filterField'>
                <h2>{props.displayName}</h2>
                <input placeholder={props.placeholder} value={value} onChange={(event) => 
                {
                    event.preventDefault();
                    setValue(event.target.value);
                }} type={type}></input>
                
                {(type === "date" || type === "number") ? <input placeholder={props.placeholder} value={value2} onChange={(event) => 
                {
                    event.preventDefault();
                    setValue2(event.target.value);
                }} type={type}></input> : <></>}
            </div>
        );
    }

    // Tela para os filtros
    const FilterScreen = () => {
        return (
        <>
        <div className='filterOverlay'>
            <div className='filterScreen'>
                <header>
                    <img onClick={() => {setIsFiltering(false)}} src={ok_img} className={'closeFilter'}></img>
                    <h1>Publicações</h1>
                </header>
                <FilterField displayName="Data:" name="date" type="date"></FilterField>
                <FilterField placeholder="Palavra1, Palavra2, ..." displayName="Palavras-chave:" name="keywords" type="text"></FilterField>
                <FilterField placeholder="Ex.: PT, EN, ..." displayName="Idiomas:" name="idioms" type="text"></FilterField>
            </div>

            <div className='filterScreen'>
                <header>
                    <img onClick={() => {setIsFiltering(false)}} src={ok_img} className={'closeFilter'}></img>
                    <h1>Autores</h1>
                </header>
                <FilterField displayName="Índice H: " name="h-index" type="number"></FilterField>
                <FilterField displayName="Trabalhos: " name="works" type="number"></FilterField>
                <FilterField displayName="Citações: " name="citations" type="number"></FilterField>
                <FilterField placeholder="Ex.: BR, US, ..." displayName="País: " name="country" type="text"></FilterField>
            </div>
        </div>
        </>
        );
    }


    // onKeyDown permite pesquisar utilizando o enter
    return (
        <>
        {isFiltering ? <FilterScreen></FilterScreen> : <></>}
        <Navbar></Navbar>
        <div className='home'>
            <form onSubmit={handleSubmit} onKeyDown={(event) => {if (event.which === 13) {event.preventDefault(); handleSubmit();}}}> 
                <textarea id='searchArea' rows="4" placeholder="Pesquise nos SingerFiles"></textarea>
            </form>
            <h2>Que tal <a href='/pesquisa?texto=Winchester'>Winchester?</a></h2>
            <FilterButton></FilterButton>
        </div>
        </>
    )
}