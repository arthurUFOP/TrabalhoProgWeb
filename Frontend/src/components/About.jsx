import "./About.css"
import Navbar from "./Navbar";
import bobby from '../assets/bobby.png'

export default () => {
    return (
        <>
        <Navbar></Navbar>
        <div className="about">
            <img src={bobby}></img>
            <div className="faqs">
                <section>
                    <h1>Quem é Bobby Singer?</h1>
                    <p>Bobby Singer é um personagem da série Supernatural. Ela gira entorno de dois irmãos, Sam e Dean, caçadores de monstros e assombrações, os quais são filhos de consideração de Bobby.</p>
                </section>
                <section>
                    <h1>Por que Bobby Singer?</h1>
                    <p>Bobby é conhecido na série por ser uma enciclopédia humana no assunto de caça aos monstros. É recorrente que personagens da trama recorram a Bobby para descobrir como combater monstros específicos que encontram em seu caminho.</p>
                </section>
                <section>
                    <h1>Por que SingerFiles?</h1>
                    <p>Assim como Bobby supre a necessidade e anseio por informação por parte dos hunters, nós suprimos a sua necessidade de informação científica de qualidade para combater a desinformação e as fake news!</p>
                </section>
                <section>
                    <h1>Agradecimentos</h1>
                    <ul>
                        <li>OpenAlex</li>
                        <li>Flaticon</li>
                        <li>Pixlr</li>
                        <li>Você, caro usuário!</li>
                    </ul>
                </section>
            </div>
        </div>
        </>
    );
}