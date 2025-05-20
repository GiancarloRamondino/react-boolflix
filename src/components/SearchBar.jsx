import { useState } from "react";

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
        fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=cfff45004cf721ecf9af1ebd8f1261f1&query=${encodeURIComponent(
                searchTerm
            )}`
        )
            .then((response) => response.json())
            .then((data) => {
                const results = data && data.results ? data.results : [];
                setFilteredData(results);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
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
    };
    const countryCode = langToCountryCode[lang];
    if (!countryCode) return null;
    return (
        <img
            src={`https://flagcdn.com/32x24/${countryCode}.png`}
            alt={countryCode.toUpperCase() + " flag"}
            style={{ width: 32, height: 20, verticalAlign: "middle", objectFit: "cover", border: "1px solid #ccc" }}
            onError={e => { e.target.style.display = 'none'; }}
        />
        );
    };

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
                                    <strong>Titolo Originale:</strong> {item.original_title} 
                                    <br />

                                    <strong>Voto:</strong> {item.vote_average}
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