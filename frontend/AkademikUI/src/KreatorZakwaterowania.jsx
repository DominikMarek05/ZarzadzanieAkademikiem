import { useState, useEffect } from 'react';
import { Building2, DoorOpen, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:5084/api/zakwaterowanie';

export function KreatorZakwaterowania({ student, onZakwaterowanieSuccess, onLogout }) {
    const [step, setStep] = useState('checking');
    const [akademiki, setAkademiki] = useState([]);
    const [wybranyAkademik, setWybranyAkademik] = useState(null);
    const [pokoje, setPokoje] = useState([]);
    const [podsumowanie, setPodsumowanie] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sprawdzenie, czy kandydat ma zaakceptowany wniosek w bazie
    useEffect(() => {
        async function sprawdzWniosekIPobierzAkademiki() {
            setLoading(true);
            setError('');
            try {
                const resWniosek = await fetch(`${API_URL}/wniosek/${student.id}`);
                if (!resWniosek.ok) {
                    setStep('no-access');
                    return;
                }

                const resAkademiki = await fetch(`${API_URL}/akademiki`);
                if (!resAkademiki.ok) throw new Error('Nie udało się pobrać listy akademików.');

                const data = await resAkademiki.json();
                setAkademiki(data);
                setStep('akademiki');
            } catch (err) {
                setError(err.message || 'Błąd połączenia z serwerem.');
            } finally {
                setLoading(false);
            }
        }

        sprawdzWniosekIPobierzAkademiki();
    }, [student.id]);

    // Wybór akademika i pobranie pokoi
    async function handleWybierzAkademik(akademik) {
        setWybranyAkademik(akademik);
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/akademiki/${akademik.id}/pokoje`);
            if (!res.ok) throw new Error('Nie udało się pobrać pokoi dla wybranego akademika.');

            const data = await res.json();
            setPokoje(data);
            setStep('pokoje');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Wybór wolnego pokoju i zapis w PostgreSQL
    async function handleWybierzPokoj(pokoj) {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/przydziel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student.id,
                    roomId: pokoj.id,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                setError(data?.message || 'Nie udało się przydzielić pokoju.');
                if (wybranyAkademik) await handleWybierzAkademik(wybranyAkademik);
                return;
            }

            setPodsumowanie(data);
            setStep('podsumowanie');
        } catch {
            setError('Błąd połączenia z serwerem podczas zapisu.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-wrapper">
            <div
                className="panel profile-panel"
                style={{ maxWidth: '800px', margin: '40px auto', padding: '24px' }}
            >
                <div className="login-logo-row">
                    <div className="logo-icon">A</div>
                    <div className="logo-text">
                        <span>AKA</span>net
                        <small>PORTAL MIESZKAŃCA</small>
                    </div>
                </div>
                <div className="wizard-user-bar">
                    <div className="wizard-user-info">
                        <strong className="wizard-user-name">
                            Witaj, {student.name || 'Kandydacie'}!
                        </strong>
                        <span className="wizard-user-index">
                            Nr indeksu: {student.studentNumber}
                        </span>
                    </div>

                    <button type="button" onClick={onLogout} className="login-chip">
                        Wyloguj się
                    </button>
                </div>

                {error && (
                    <div className="login-error-alert" style={{ marginBottom: '16px' }}>
                        <AlertCircle
                            size={18}
                            style={{ marginRight: '8px', verticalAlign: 'middle' }}
                        />
                        {error}
                    </div>
                )}

                {loading && <p>Ładowanie danych z bazy...</p>}

                {/* Brak zaakceptowanego wniosku */}
                {!loading && step === 'no-access' && (
                    <div className="login-card">
                        <h3>Brak aktywnego wniosku</h3>
                        <p>
                            Nie znaleziono zaakceptowanego wniosku o przydział miejsca w akademiku
                            dla Twojego konta.
                        </p>
                    </div>
                )}

                {/* Lista domów studenckich */}
                {!loading && step === 'akademiki' && (
                    <div>
                        <h3>Krok 1: Wybierz Dom Studencki</h3>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                gap: '16px',
                                marginTop: '16px',
                            }}
                        >
                            {akademiki.map((ds) => (
                                <div
                                    key={ds.id}
                                    onClick={() => handleWybierzAkademik(ds)}
                                    style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        background: '#fff',
                                        cursor: 'pointer',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <Building2 size={24} color="#2563eb" />
                                    <h4 style={{ margin: '12px 0 4px' }}>{ds.name}</h4>
                                    <p style={{ fontSize: '14px', color: '#64748b' }}>
                                        {ds.address}, {ds.city}
                                    </p>
                                    {ds.description && (
                                        <p style={{ fontSize: '13px', marginTop: '8px' }}>
                                            {ds.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Siatka wolnych pokoi */}
                {!loading && step === 'pokoje' && (
                    <div>
                        <button
                            type="button"
                            onClick={() => setStep('akademiki')}
                            className="login-chip"
                            style={{
                                marginBottom: '16px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            <ArrowLeft size={16} /> Wróć do wyboru akademika
                        </button>

                        <h3>Krok 2: Wybierz wolny pokój ({wybranyAkademik?.name})</h3>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '12px',
                                marginTop: '16px',
                            }}
                        >
                            {pokoje.map((pokoj) => {
                                const wolneMiejsca = pokoj.capacity - pokoj.occupiedBeds;
                                const czyWolny = wolneMiejsca > 0;

                                return (
                                    <button
                                        key={pokoj.id}
                                        type="button"
                                        disabled={!czyWolny}
                                        onClick={() => handleWybierzPokoj(pokoj)}
                                        style={{
                                            border: czyWolny
                                                ? '2px solid #22c55e'
                                                : '1px solid #cbd5e1',
                                            borderRadius: '10px',
                                            padding: '16px',
                                            background: czyWolny ? '#f0fdf4' : '#f1f5f9',
                                            opacity: czyWolny ? 1 : 0.6,
                                            cursor: czyWolny ? 'pointer' : 'not-allowed',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <DoorOpen
                                            size={20}
                                            color={czyWolny ? '#16a34a' : '#64748b'}
                                        />
                                        <div
                                            style={{
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                                marginTop: '8px',
                                            }}
                                        >
                                            Pokój {pokoj.roomNumber}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                marginTop: '6px',
                                                color: czyWolny ? '#15803d' : '#dc2626',
                                            }}
                                        >
                                            {czyWolny
                                                ? `Wolne miejsca: ${wolneMiejsca}/${pokoj.capacity}`
                                                : 'Brak wolnych miejsc'}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Podsumowanie przydziału */}
                {!loading && step === 'podsumowanie' && podsumowanie && (
                    <div className="login-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <CheckCircle2 size={40} color="#16a34a" />
                        <h2 style={{ marginTop: '12px' }}>Zakwaterowanie potwierdzone!</h2>
                        <p style={{ color: '#64748b', marginBottom: '20px' }}>
                            Twój wybór został zapisany w systemie akademika.
                        </p>

                        <div
                            style={{
                                background: '#f8fafc',
                                padding: '16px',
                                borderRadius: '8px',
                                marginBottom: '20px',
                            }}
                        >
                            <p>
                                <strong>Dom Studencki:</strong> {podsumowanie.dormitoryName}
                            </p>
                            <p>
                                <strong>Adres:</strong> {podsumowanie.dormitoryAddress}
                            </p>
                            <p>
                                <strong>Przydzielony pokój:</strong> {podsumowanie.roomNumber}{' '}
                                (Piętro {podsumowanie.floor})
                            </p>
                        </div>

                        <div style={{ fontSize: '14px', color: '#475569', marginBottom: '20px' }}>
                            <strong>Informacje kwaterunkowe:</strong> Zgłoś się na portiernię z
                            dowodem osobistym oraz potwierdzeniem wpłaty kaucji w celu odbioru
                            kluczy.
                        </div>

                        <button
                            type="button"
                            className="login-submit-button"
                            onClick={() => onZakwaterowanieSuccess(podsumowanie)}
                        >
                            Przejdź do panelu mieszkańca
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
