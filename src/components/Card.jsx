import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Assicurati che getFlagEmoji sia importata o definita nel file

function Card({ item = {}, getFlagEmoji = () => "" }) {
    const isSerieTV = item.name || item.original_name;

    return (
        <div className="card">
            {item.poster_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title || item.name || "Poster"}
                    style={{ width: 342, borderRadius: 8, margin: "8px 0" }}
                />
            ) : (
                <span>Nessuna immagine</span>
            )}
            <div className="card-content d-flex justify-left flex-column">
                <br />
                <strong>Titolo:</strong> {item.title || item.name || "N/A"}
                <br />
                <strong>Titolo Originale:</strong> {item.original_title || item.original_name || "N/A"}
                <br />
                <strong>Voto:</strong>{" "}
                {[...Array(Math.max(1, Math.ceil((item.vote_average ?? 0) / 2)))]
                .map((_, i) => (
                    <FontAwesomeIcon icon={faStar} key={i} className="star" />
                ))}
                <br />
                <strong>Tipologia:</strong>{" "}
                {isSerieTV ? "Serie TV" : "Film"}
                <br />
                <strong>Overview:</strong>{" "}
                {item.overview || "N/A"}
                <br />
                <strong>Lingua:</strong>{" "}
                {getFlagEmoji(item.original_language) ? (
                <span >
                    {getFlagEmoji(item.original_language)}
                </span>
                ) : (
                <span >
                    {item.original_language || "N/A"}
                </span>
              )}
            </div>
            
        </div>
    );
}

export default Card;