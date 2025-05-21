import { useState } from "react";
import Card from "./Card";

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
        ta: "in",
        cs: "cz",
        fi: "fi",
        ml: "in",
        no: "no",
        ne: "np",
        ro: "ro",
        bn: "bd",
        th: "th",
        hu: "hu",
        vi: "vn",
        xx: "xx",

    };
    const countryCode = langToCountryCode[lang];
    if (!countryCode) return null;
    return (
        <img
            src={`https://flagcdn.com/32x24/${countryCode}.png`} //API per le bandiere
            alt={countryCode.toUpperCase() + " flag"}
            className="flag"
            onError={e => { e.target.style.display = 'none'; }}
        />
        );
    }; // fine funzione bandiera

    const [showResults, setShowResults] = useState(false);

    const handleSearchClick = () => {
        setShowResults(true);
        handleSearch();
    };

    return (
        <>
            <header  className="row justify-space-between">
                <div className="col-4"> ciao </div>
                <div className="col-4">
                    <input
                        type="text"
                        placeholder="Cerca un film..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setShowResults(true);
                                handleSearch();
                            }
                        }}
                        
                        style={{
                            padding: "8px",
                            fontSize: 16,
                            width: "100%",
                            maxWidth: 200,
                            marginBottom: 16,
                    }}
                    />
                    <button onClick={handleSearchClick} style={{ padding: "8px 16px", fontSize: 16 }}>
                        Cerca
                    </button>
                </div>
                
                
            </header>
            <main >
                {showResults && (
                    loading ? (
                        <div>Caricamento...</div>
                    ) : (
                        <ul className="row justify-space-around wrap" >
                            {filteredData.map(
                                (item) => (
                                    item && item.id ? (
                                        <li className="col-3" key={item.id} style={{ listStyle: "none", marginBottom: 16 }}>
                                            <Card
                                               item={item}
                                               getFlagEmoji={getFlagEmoji}
                                            />
                                        </li>
                                    ) : null
                                )
                            )}
                        </ul>
                    )
                )}
            </main>
        </>
    );
};

export default SearchBar;
