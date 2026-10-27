import { useState, useEffect } from 'react';

function App() {
    const [pokoje, setPokoje] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stany dla pól formularza
    const [numerPokoju, setnumerPokoju] = useState('');
    const [pietro, setpietro] = useState(0);
    const [liczbaOsob, setliczbaOsob] = useState(2);

    const API_URL = 'http://localhost:5256/api/pokoje';
    // Pobieranie pokoi z bazy danych
    const pobierzPokoje = () => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Problem z pobraniem danych');
                return res.json();
            })
            .then((data) => {
                setPokoje(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Błąd API:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        pobierzPokoje();
    }, []);

    // Wysyłanie nowego pokoju do bazy
    const handleSubmit = (e) => {
        e.preventDefault();

        const nowyPokoj = {
            numerPokoju: numerPokoju,
            pietro: parseInt(pietro),
            liczbaOsob: parseInt(liczbaOsob),
            czyWolneLozka: true,
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nowyPokoj),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Błąd podczas dodawania');
                return res.json();
            })
            .then(() => {
                // Czyszczenie formularza po sukcesie
                setnumerPokoju('');
                // Ponowne odświeżenie listy z bazy danych
                pobierzPokoje();
            })
            .catch((err) => alert('Nie udało się dodać pokoju: ' + err.message));
    };

    return (
        <div
            style={{
                padding: '30px',
                fontFamily: 'Segoe UI, Arial, sans-serif',
                maxWidth: '800px',
                margin: '0 auto',
            }}
        >
            <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>
                System Zarządzania Akademikiem
            </h1>
            <p style={{ textAlign: 'center', color: '#7f8c8d' }}>Moduł Zarządzania Pokojami</p>

            <div
                style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
            >
                <h3>Dodaj nowy pokój do bazy danych</h3>
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end',
                    }}
                >
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Numer pokoju:
                        </label>
                        <input
                            type="text"
                            value={numerPokoju}
                            onChange={(e) => setnumerPokoju(e.target.value)}
                            required
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                            }}
                            placeholder="np. 104A"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Piętro:</label>
                        <input
                            type="number"
                            value={pietro}
                            onChange={(e) => setpietro(e.target.value)}
                            required
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                width: '70px',
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>
                            Miejsca (Pojemność):
                        </label>
                        <input
                            type="number"
                            value={liczbaOsob}
                            onChange={(e) => setliczbaOsob(e.target.value)}
                            required
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                width: '70px',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '9px 15px',
                            background: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        Zapisz
                    </button>
                </form>
            </div>

            <h3>Lista pokoi w akademiku</h3>
            {loading ? (
                <p>Ładowanie danych z bazy PostgreSQL...</p>
            ) : pokoje.length === 0 ? (
                <p style={{ color: '#e74c3c' }}>
                    Baza danych jest pusta. Dodaj pierwszy pokój powyżej!
                </p>
            ) : (
                <table
                    border="1"
                    cellPadding="12"
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    }}
                >
                    <thead style={{ background: '#2c3e50', color: 'white' }}>
                        <tr>
                            <th>ID z bazy</th>
                            <th>Numer Pokoju</th>
                            <th>Piętro</th>
                            <th>Pojemność</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pokoje.map((pokoj) => (
                            <tr key={pokoj.id} style={{ textAlign: 'center' }}>
                                <td>
                                    <strong>{pokoj.id}</strong>
                                </td>
                                <td style={{ fontWeight: '600' }}>{pokoj.numerPokoju}</td>
                                <td>{pokoj.pietro}</td>
                                <td>{pokoj.liczbaOsob} os.</td>
                                <td>
                                    <span
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            background: pokoj.isAvailable ? '#e8f8f5' : '#feadad',
                                            color: pokoj.isAvailable ? '#117a65' : '#c0392b',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {pokoj.isAvailable ? 'Wolny' : 'Zajęty'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default App;
