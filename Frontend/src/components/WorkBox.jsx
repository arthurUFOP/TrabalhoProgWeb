import "./WorkBox.css"

export default (props) => {
        
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