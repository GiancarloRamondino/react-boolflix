import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredData([]);
            return;
        }
        setLoading(true);

        // FILM API
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=cfff45004cf721ecf9af1ebd8f1261f1&query=${encodeURIComponent(
            searchTerm
        )}`;

        // SERIE API
        const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=cfff45004cf721ecf9af1ebd8f1261f1&language=it_IT&query=${encodeURIComponent(
            searchTerm
        )}`;

        fetch(movieUrl)
            .then(movieRes => movieRes.json())
            .then(movieData => {
            fetch(tvUrl)
                .then(tvRes => tvRes.json())
                .then(tvData => {
                const movieResults = movieData && movieData.results ? movieData.results : [];
                const tvResults = tvData && tvData.results
                    ? tvData.results.map(tv => ({
                    ...tv,
                    title: tv.name,
                    original_title: tv.original_name,
                    }))
                    : [];
                setFilteredData([...movieResults, ...tvResults]);
                setLoading(false);
                })
                .catch(error => {
                console.error("Error fetching TV data:", error);
                setFilteredData([]);
                setLoading(false);
                });
            })
            .catch(error => {
            console.error("Error fetching movie data:", error);
            setFilteredData([]);
            setLoading(false);
            });
    };

    // Funzione di utilità per ottenere la bandiera dalla lingua
    const getFlagEmoji = (lang) => {
    if (!lang) return null;
    // Mappa delle lingue più comuni a codice paese
    const langToCountryCode = {
        en: "us",
        it: "it",
        fr: "fr",
        es: "es",
        de: "de",
        ja: "jp",
        ko: "kr",
        zh: "cn",
        ru: "ru",
        pt: "pt",
        hi: "in",
        el: "gr",
        ar: "ae",
        tr: "tr",
        nl: "nl",
        pl: "pl",
        da: "dk",
        sv: "se",
    };
    const countryCode = langToCountryCode[lang];
    if (!countryCode) return null;
    return (
        <img
            src={`https://flagcdn.com/32x24/${countryCode}.png`} //API per le bandiere
            alt={countryCode.toUpperCase() + " flag"}
            style={{ width: 32, height: 20, verticalAlign: "middle", objectFit: "cover", border: "1px solid #ccc" }}
            onError={e => { e.target.style.display = 'none'; }}
        />
        );
    }; // fine funzione bandiera

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <input
                    type="text"
                    placeholder="Cerca un film..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    style={{ flex: 1, padding: 8, fontSize: 16 }}
                />
                <button onClick={handleSearch} style={{ padding: "8px 16px", fontSize: 16 }}>
                    Cerca
                </button>
            </div>
            {loading ? (
                <div>Caricamento...</div>
            ) : (
                <ul>
                    {filteredData.map(
                        (item) =>
                            item && item.id ? (
                                <li key={item.id} style={{ marginBottom: 16 }}>
                                    <strong>Titolo:</strong> {item.title} 
                                    <br />
                                    {item.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                                            alt={item.title}
                                            style={{ width: 120, borderRadius: 8, margin: "8px 0" }}
                                        />
                                    ) : (
                                        <span style={{ color: "#888" }}>Nessuna immagine</span>
                                    )}
                                    <br />
                                    <strong>Titolo Originale:</strong> {item.original_title} 
                                    <br />

                                    <strong>Voto:</strong>{" "}
                                    {[...Array(Math
                                        .max(1, Math.ceil((item.vote_average ?? 0) / 2)))]
                                        .map((_, i) => (
                                        <FontAwesomeIcon icon={faStar} key={i} style={{ color: "#FFD700", marginRight: 2 }} />
                                    ))}
                                    <br />
                                    <strong>Tipologia:</strong>{" "}
                                    {item.name && item.original_name ? "Serie TV" : "Film"}
                                    <br />
                                    <strong>Lingua:</strong>{" "}
                                    {getFlagEmoji(item.original_language) ? (
                                        <span style={{ fontSize: 24 }}>
                                            {getFlagEmoji(item.original_language)}
                                        </span>
                                    ) : (
                                        <span style={{ color: "#888" }}>
                                            {item.original_language}
                                        </span>
                                    )}
                                </li>
                            ) : null
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;