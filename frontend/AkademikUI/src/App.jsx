import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    WashingMachine,
    Dumbbell,
    Wrench,
    FileText,
    Bell,
    UserRound,
    LogOut,
    Menu,
    ChevronRight,
    CalendarDays,
    Megaphone,
    Plus,
    Clock,
    User,
    LogIn,
} from 'lucide-react';

import './App.css';

// Konfiguracja adresów API backendu .NET
const API_BASE = 'http://localhost:5084/api';
const SPORTS_API_URL = `${API_BASE}/sportcourts`;
const EQUIPMENT_API_URL = `${API_BASE}/equipmentreservations`;
const AUTH_API_URL = `${API_BASE}/auth`;

const menuItems = [
    { id: 'dashboard', label: 'Panel główny', icon: LayoutDashboard },
    { id: 'laundry', label: 'Pralnie i suszarnie', icon: WashingMachine },
    { id: 'sports', label: 'Boiska sportowe', icon: Dumbbell },
    { id: 'repairs', label: 'Zgłoszenia usterek', icon: Wrench },
    { id: 'applications', label: 'Wnioski', icon: FileText },
    { id: 'announcements', label: 'Ogłoszenia', icon: Bell },
];

/**
 * Widok logowania studenta
 * Weryfikuje numer indeksu wyłącznie w tabeli 'students' bazy PostgreSQL
 */
function LoginView({ onLoginSuccess }) {
    const [studentNumber, setStudentNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const demoAccounts = [
        { studentNumber: '123456', name: 'Jan' },
        { studentNumber: '234567', name: 'Anna' },
        { studentNumber: '345678', name: 'Piotr' },
        { studentNumber: '456789', name: 'Maria' },
    ];

    async function handleLogin(e) {
        if (e) e.preventDefault();
        const trimmed = studentNumber.trim();
        if (!trimmed) {
            setError('Podaj numer indeksu/albumu studenta.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Zapytanie do backendu sprawdzające tabelę students
            const res = await fetch(`${AUTH_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentNumber: trimmed }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.message || 'Błąd logowania. Sprawdź numer indeksu.');

            onLoginSuccess(data.student);
        } catch (err) {
            setError(err.message || 'Błąd połączenia z backendem.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-logo-row">
                    <div className="logo-icon">A</div>
                    <div className="logo-text">
                        <span>AKA</span>net
                        <small>PORTAL MIESZKAŃCA</small>
                    </div>
                </div>

                <div className="login-heading">
                    <h1>Logowanie studenta</h1>
                    <p>Wpisz numer indeksu, aby uzyskać dostęp do rezerwacji.</p>
                </div>

                {error && <div className="login-error-alert">{error}</div>}

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="login-field">
                        <label htmlFor="login-student-number">Numer indeksu (tabela students)</label>
                        <input
                            id="login-student-number"
                            type="text"
                            placeholder="np. 123456"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            maxLength={10}
                            autoFocus
                        />
                    </div>

                    <button type="submit" className="login-submit-button" disabled={loading || !studentNumber.trim()}>
                        <LogIn size={18} />
                        {loading ? 'Weryfikacja w bazie...' : 'Zaloguj się'}
                    </button>
                </form>

                <div className="login-quick-accounts">
                    <p>Konta testowe z bazy danych:</p>
                    <div className="login-chips">
                        {demoAccounts.map((acc) => (
                            <button
                                key={acc.studentNumber}
                                type="button"
                                className="login-chip"
                                onClick={() => setStudentNumber(acc.studentNumber)}
                            >
                                <strong>{acc.studentNumber}</strong> · {acc.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Pasek boczny nawigacji z obsługą zwijania i wylogowania
 */
function Sidebar({ activeView, setActiveView, onLogout }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">A</div>
                    {!collapsed && (
                        <div className="logo-text">
                            <span>AKA</span>net
                            <small>PORTAL MIESZKAŃCA</small>
                        </div>
                    )}
                </div>

                <button
                    className="icon-button collapse-button"
                    onClick={() => setCollapsed(!collapsed)}
                    title="Zwiń menu"
                >
                    <Menu size={20} />
                </button>
            </div>

            {!collapsed && <p className="menu-caption">MENU GŁÓWNE</p>}

            <nav className="sidebar-nav">
                {menuItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`nav-item ${activeView === id ? 'active' : ''}`}
                        onClick={() => setActiveView(id)}
                        title={collapsed ? label : undefined}
                    >
                        <Icon size={20} />
                        {!collapsed && <span>{label}</span>}
                        {!collapsed && activeView === id && <ChevronRight size={17} className="nav-arrow" />}
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button
                    className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveView('profile')}
                    title={collapsed ? 'Mój profil' : undefined}
                >
                    <UserRound size={20} />
                    {!collapsed && <span>Mój profil</span>}
                </button>

                <button className="nav-item logout-button" onClick={onLogout} title={collapsed ? 'Wyloguj się' : undefined}>
                    <LogOut size={20} />
                    {!collapsed && <span>Wyloguj się</span>}
                </button>
            </div>
        </aside>
    );
}

/**
 * Górny pasek z informacjami o zalogowanym studencie
 */
function Topbar({ activeView, currentUser }) {
    const currentItem = menuItems.find((item) => item.id === activeView);
    const title = currentItem?.label || (activeView === 'profile' ? 'Mój profil' : 'Panel główny');

    return (
        <header className="topbar">
            <div>
                <p className="breadcrumb">AKAnet / {title}</p>
                <h2>{title}</h2>
            </div>

            <div className="topbar-right">
                <button className="icon-button notification-button" title="Powiadomienia">
                    <Bell size={20} />
                </button>

                <div className="topbar-user">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="topbar-user-info">
                        <strong>Student #{currentUser?.studentNumber || 'Mieszkaniec'}</strong>
                        <span>
                            {currentUser?.fieldOfStudy
                                ? `${currentUser.fieldOfStudy}, rok ${currentUser.yearOfStudy}`
                                : 'Portal mieszkańca'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

function PageHeading({ title, description, children }) {
    return (
        <div className="page-heading">
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {children}
        </div>
    );
}

function EmptyState({ icon: Icon, title, description }) {
    return (
        <div className="empty-state">
            <div className="empty-icon">
                <Icon size={30} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function Shortcut({ icon: Icon, title, description, color, onClick }) {
    return (
        <button className="shortcut-card" onClick={onClick}>
            <div className={`shortcut-icon ${color}`}>
                <Icon size={24} />
            </div>
            <div className="shortcut-text">
                <strong>{title}</strong>
                <span>{description}</span>
            </div>
            <ChevronRight size={19} className="shortcut-arrow" />
        </button>
    );
}

function Dashboard({ setActiveView }) {
    return (
        <>
            <div className="welcome-banner">
                <div>
                    <span className="welcome-label">PANEL MIESZKAŃCA</span>
                    <h1>Witamy w AKAnet!</h1>
                    <p>Wszystko, czego potrzebujesz w swoim akademiku, w jednym miejscu.</p>
                </div>
                <div className="banner-decoration">
                    <LayoutDashboard size={100} strokeWidth={1} />
                </div>
            </div>

            <div className="section-heading">
                <div>
                    <h2>Szybki dostęp</h2>
                    <p>Najważniejsze funkcje portalu</p>
                </div>
            </div>

            <div className="shortcut-grid">
                <Shortcut icon={WashingMachine} title="Pralnie i suszarnie" description="Zarezerwuj termin prania" color="blue" onClick={() => setActiveView('laundry')} />
                <Shortcut icon={Dumbbell} title="Boiska sportowe" description="Zarezerwuj obiekt sportowy" color="green" onClick={() => setActiveView('sports')} />
                <Shortcut icon={Wrench} title="Zgłoś usterkę" description="Przekaż problem administracji" color="orange" onClick={() => setActiveView('repairs')} />
                <Shortcut icon={FileText} title="Wnioski" description="Sprawdź i złóż wniosek" color="purple" onClick={() => setActiveView('applications')} />
            </div>

            <div className="dashboard-grid">
                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Najbliższe rezerwacje</h2>
                            <p>Twój harmonogram</p>
                        </div>
                        <CalendarDays size={23} />
                    </div>
                    <EmptyState
                        icon={CalendarDays}
                        title="Brak nadchodzących rezerwacji"
                        description="Przejdź do sekcji Pralnie i suszarnie lub Boiska sportowe, aby dokonać nowej rezerwacji."
                    />
                </section>

                <section className="panel">
                    <div className="panel-heading">
                        <div>
                            <h2>Tablica ogłoszeń</h2>
                            <p>Aktualności z akademika</p>
                        </div>
                        <Megaphone size={23} />
                    </div>
                    <EmptyState
                        icon={Megaphone}
                        title="Brak ogłoszeń"
                        description="Gdy administracja opublikuje ogłoszenia, pojawią się tutaj."
                    />
                </section>
            </div>
        </>
    );
}

/**
 * Komponent renderujący 12 dwugodzinnych slotów dla danego zasobu
 */
function TimeSlots({ slots, prefix, courtId, selectedSlot, onSelect }) {
    if (!slots || slots.length === 0) return <p className="slots-message">Brak dostępnych terminów.</p>;

    return (
        <div className="time-slots">
            {slots.map((slot) => {
                const isSelected = selectedSlot?.courtId === courtId && selectedSlot?.startTime === slot.startTime;
                const slotClass = `time-slot ${slot.available ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`;

                return (
                    <button
                        type="button"
                        key={`${prefix}-${slot.startTime}`}
                        className={slotClass}
                        disabled={!slot.available}
                        onClick={() => onSelect({ courtId, startTime: slot.startTime, endTime: slot.endTime })}
                        title={slot.available ? 'Wybierz ten termin' : 'Termin niedostępny'}
                    >
                        <Clock size={14} />
                        {slot.startTime}–{slot.endTime}
                    </button>
                );
            })}
        </div>
    );
}

/**
 * Uniwersalny panel listy aktywnych rezerwacji studenta
 */
function UserReservationsPanel({ title, description, loading, reservations, icon: Icon, getLabel }) {
    return (
        <section className="panel reservation-panel">
            <div className="panel-heading">
                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
                <CalendarDays size={24} />
            </div>

            {loading && <p className="slots-message">Ładowanie Twoich rezerwacji...</p>}

            {!loading && reservations.length === 0 && (
                <EmptyState
                    icon={CalendarDays}
                    title="Brak nadchodzących rezerwacji"
                    description="Wybierz termin poniżej i dokonaj rezerwacji."
                />
            )}

            {!loading && reservations.length > 0 && (
                <div className="user-reservations-list">
                    {reservations.map((res) => (
                        <div key={res.id} className="user-reservation-item">
                            <div className="user-reservation-main">
                                <div className="user-reservation-icon">
                                    <Icon size={20} />
                                </div>
                                <div className="user-reservation-info">
                                    <strong>{getLabel(res)}</strong>
                                    <span>Data: {res.reservationDate} · Godziny: {res.startTime}–{res.endTime}</span>
                                </div>
                            </div>
                            <span className="user-reservation-badge">Aktywna</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

/**
 * Moduł rezerwacji pralek i suszarek (obsługuje tabelę equipment_reservation)
 */
function Laundry({ currentUser }) {
    const [floor, setFloor] = useState('1');
    const [date, setDate] = useState('');
    const [type, setType] = useState('Pralka');
    const [equipmentList, setEquipmentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [booking, setBooking] = useState(false);
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [myReservations, setMyReservations] = useState([]);
    const [loadingMy, setLoadingMy] = useState(false);

    // Pobieranie rezerwacji zalogowanego studenta
    async function loadMyReservations() {
        if (!currentUser?.id) return;
        setLoadingMy(true);
        try {
            const res = await fetch(`${EQUIPMENT_API_URL}/my?studentId=${currentUser.id}`);
            if (res.ok) setMyReservations(await res.json());
        } catch (e) {
            console.error('Błąd pobierania rezerwacji:', e);
        } finally {
            setLoadingMy(false);
        }
    }

    useEffect(() => {
        loadMyReservations();
    }, [currentUser?.id]);

    // Pobieranie dostępności urządzeń i 12 slotów godzinowych dla wybranej daty i filtrów
    useEffect(() => {
        if (!date) {
            setEquipmentList([]);
            setError('');
            setSelectedSlot(null);
            return;
        }

        const controller = new AbortController();

        async function fetchAvailability() {
            setLoading(true);
            setError('');
            setSelectedSlot(null);

            try {
                const params = new URLSearchParams({ date });
                if (floor) params.append('floor', floor);
                if (type) params.append('type', type);

                const res = await fetch(`${EQUIPMENT_API_URL}/availability?${params.toString()}`, { signal: controller.signal });
                if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
                setEquipmentList(await res.json());
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Nie udało się pobrać dostępności urządzeń. Sprawdź, czy backend jest uruchomiony.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        fetchAvailability();
        return () => controller.abort();
    }, [date, floor, type]);

    // Wysłanie żądania utworzenia rezerwacji pralki/suszarki
    async function reserveEquipment() {
        if (!selectedSlot || !date) return;

        setBooking(true);
        setBookingMessage('');
        setBookingError('');

        try {
            const res = await fetch(`${EQUIPMENT_API_URL}/reserve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    equipmentId: selectedSlot.courtId,
                    reservationDate: date,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    studentId: currentUser?.id || 1,
                }),
            });

            const result = await res.json().catch(() => null);
            if (!res.ok) throw new Error(result?.message || 'Nie udało się zarezerwować urządzenia.');

            setBookingMessage(result?.message || 'Rezerwacja urządzenia została pomyślnie utworzona!');
            setSelectedSlot(null);

            // Odświeżenie dostępności i listy rezerwacji studenta
            const refreshRes = await fetch(`${EQUIPMENT_API_URL}/availability?date=${encodeURIComponent(date)}&floor=${floor}&type=${type}`);
            if (refreshRes.ok) setEquipmentList(await refreshRes.json());
            loadMyReservations();
        } catch (err) {
            setBookingError(err.message || 'Wystąpił błąd podczas rezerwacji.');
        } finally {
            setBooking(false);
        }
    }

    const selectedItem = equipmentList.find((e) => e.id === selectedSlot?.courtId);

    return (
        <>
            <PageHeading
                title="Pralnie i suszarnie"
                description="Sprawdź urządzenia na wybranym piętrze i zarezerwuj dogodny 2-godzinny termin."
            />

            <UserReservationsPanel
                title="Twoje rezerwacje pralek i suszarek"
                description="Lista zarezerwowanych przez Ciebie urządzeń w tabeli equipment_reservation."
                loading={loadingMy}
                reservations={myReservations}
                icon={WashingMachine}
                getLabel={(r) => `${r.type === 'Washing Machine' ? 'Pralka' : 'Suszarka'} ${r.equipmentNumber} (Piętro ${r.floor})`}
            />

            <section className="panel availability-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Pralki i suszarki</h2>
                        <p>Wybierz piętro, datę oraz rodzaj urządzenia, a następnie kliknij wolną godzinę.</p>
                    </div>
                    <WashingMachine size={25} />
                </div>

                <div className="reservation-filters">
                    <div className="filter-field">
                        <label htmlFor="laundry-floor">Piętro</label>
                        <input
                            id="laundry-floor"
                            type="number"
                            value={floor}
                            onChange={(e) => { setFloor(e.target.value); setSelectedSlot(null); }}
                            placeholder="Wszystkie piętra"
                            min="0"
                            max="10"
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="laundry-date">Data</label>
                        <input
                            id="laundry-date"
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setSelectedSlot(null);
                                setBookingMessage('');
                                setBookingError('');
                            }}
                        />
                    </div>

                    <div className="filter-field">
                        <label>Rodzaj urządzenia</label>
                        <div className="choice-row">
                            <button
                                type="button"
                                className={`choice ${type === 'Pralka' ? 'active' : ''}`}
                                onClick={() => { setType('Pralka'); setSelectedSlot(null); }}
                            >
                                <WashingMachine size={17} /> Pralki
                            </button>
                            <button
                                type="button"
                                className={`choice ${type === 'Suszarka' ? 'active' : ''}`}
                                onClick={() => { setType('Suszarka'); setSelectedSlot(null); }}
                            >
                                <Clock size={17} /> Suszarki
                            </button>
                        </div>
                    </div>
                </div>

                {loading && <p className="slots-message">Pobieranie dostępności urządzeń...</p>}
                {error && <p className="slots-error">{error}</p>}
                {bookingMessage && <p className="booking-success">{bookingMessage}</p>}
                {bookingError && <p className="slots-error">{bookingError}</p>}

                {!date && <p className="slots-message">Wybierz datę powyżej, aby wyświetlić dostępne urządzenia i godziny.</p>}

                {!loading && !error && date && equipmentList.length === 0 && (
                    <div className="availability-placeholder">
                        <div className="availability-placeholder-icon"><WashingMachine size={25} /></div>
                        <h3>Brak urządzeń spełniających wybrane kryteria</h3>
                        <p>Zmień numer piętra lub rodzaj urządzenia, aby sprawdzić inne dostępne zasoby.</p>
                    </div>
                )}

                {!loading && !error && date && equipmentList.length > 0 && (
                    <>
                        <div className="field-grid">
                            {equipmentList.map((item) => {
                                const isWasher = item.type === 'Washing Machine';
                                const Icon = isWasher ? WashingMachine : Clock;
                                const title = `${isWasher ? 'Pralka' : 'Suszarka'} ${item.equipmentNumber}`;

                                return (
                                    <article className="field-card" key={item.id}>
                                        <div className="field-card-heading">
                                            <div className="field-icon"><Icon size={21} /></div>
                                            <div>
                                                <h3>{title}</h3>
                                                <p>Piętro {item.floor}</p>
                                            </div>
                                        </div>

                                        <p className="field-card-note">
                                            {item.status === 'Maintenance'
                                                ? 'Urządzenie jest obecnie w konserwacji.'
                                                : item.status === 'Unavailable'
                                                ? 'Urządzenie jest obecnie niedostępne.'
                                                : 'Kliknij dostępną godzinę, aby ją wybrać.'}
                                        </p>

                                        <TimeSlots
                                            prefix={`eq-${item.id}`}
                                            courtId={item.id}
                                            slots={item.slots}
                                            selectedSlot={selectedSlot}
                                            onSelect={(slot) => { setSelectedSlot(slot); setBookingMessage(''); setBookingError(''); }}
                                        />
                                    </article>
                                );
                            })}
                        </div>

                        {selectedSlot && (
                            <div className="booking-summary">
                                <div>
                                    <strong>Wybrany termin rezerwacji</strong>
                                    <p>
                                        {selectedItem?.type === 'Washing Machine' ? 'Pralka' : 'Suszarka'} {selectedItem?.equipmentNumber} (Piętro {selectedItem?.floor}) · {date} · {selectedSlot.startTime}–{selectedSlot.endTime}
                                    </p>
                                </div>
                                <button type="button" className="primary-button" onClick={reserveEquipment} disabled={booking}>
                                    {booking ? 'Rezerwowanie...' : 'Zarezerwuj'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}

/**
 * Moduł rezerwacji obiektów sportowych
 */
function Sports({ currentUser }) {
    const [date, setDate] = useState('');
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [booking, setBooking] = useState(false);
    const [bookingMessage, setBookingMessage] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [myReservations, setMyReservations] = useState([]);
    const [loadingMy, setLoadingMy] = useState(false);

    const fields = [
        { id: 'Football', name: 'Boisko do piłki nożnej', subtitle: 'Piłka nożna', icon: Dumbbell },
        { id: 'Volleyball', name: 'Boisko do siatkówki', subtitle: 'Siatkówka', icon: Dumbbell },
        { id: 'Basketball', name: 'Boisko do koszykówki', subtitle: 'Koszykówka', icon: Dumbbell },
    ];

    async function loadMyCourtReservations() {
        if (!currentUser?.id) return;
        setLoadingMy(true);
        try {
            const res = await fetch(`${SPORTS_API_URL}/my?studentId=${currentUser.id}`);
            if (res.ok) setMyReservations(await res.json());
        } catch (e) {
            console.error('Błąd pobierania rezerwacji boisk:', e);
        } finally {
            setLoadingMy(false);
        }
    }

    useEffect(() => {
        loadMyCourtReservations();
    }, [currentUser?.id]);

    useEffect(() => {
        if (!date) {
            setCourts([]);
            setError('');
            setSelectedSlot(null);
            return;
        }

        const controller = new AbortController();

        async function getAvailability() {
            setLoading(true);
            setError('');
            setCourts([]);
            setSelectedSlot(null);

            try {
                const res = await fetch(`${SPORTS_API_URL}/availability?date=${encodeURIComponent(date)}`, { signal: controller.signal });
                if (!res.ok) throw new Error(`Błąd serwera: ${res.status}`);
                setCourts(await res.json());
            } catch (err) {
                if (err.name !== 'AbortError') setError('Nie udało się pobrać dostępności boisk. Sprawdź, czy backend jest uruchomiony.');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        getAvailability();
        return () => controller.abort();
    }, [date]);

    async function reserveCourt() {
        if (!selectedSlot || !date) return;

        setBooking(true);
        setBookingMessage('');
        setBookingError('');

        try {
            const res = await fetch(`${SPORTS_API_URL}/reserve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courtId: selectedSlot.courtId,
                    reservationDate: date,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    studentId: currentUser?.id || 1,
                }),
            });

            const result = await res.json().catch(() => null);
            if (!res.ok) throw new Error(result?.message || 'Nie udało się zarezerwować boiska.');

            setBookingMessage(result?.message || 'Rezerwacja boiska została pomyślnie utworzona!');
            setSelectedSlot(null);

            const refresh = await fetch(`${SPORTS_API_URL}/availability?date=${encodeURIComponent(date)}`);
            if (refresh.ok) setCourts(await refresh.json());
            loadMyCourtReservations();
        } catch (err) {
            setBookingError(err.message || 'Wystąpił błąd podczas rezerwacji.');
        } finally {
            setBooking(false);
        }
    }

    return (
        <>
            <PageHeading title="Boiska sportowe" description="Sprawdź harmonogram i wybierz termin dla wybranego boiska." />

            <UserReservationsPanel
                title="Twoje rezerwacje boisk"
                description="Lista zarezerwowanych przez Ciebie obiektów sportowych."
                loading={loadingMy}
                reservations={myReservations}
                icon={Dumbbell}
                getLabel={(r) => r.courtName}
            />

            <section className="panel availability-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Dostępność boisk</h2>
                        <p>Wybierz datę, a następnie dostępną godzinę.</p>
                    </div>
                    <Dumbbell size={25} />
                </div>

                <div className="reservation-filters sports-filters">
                    <div className="filter-field">
                        <label htmlFor="sports-date">Data</label>
                        <input
                            id="sports-date"
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setSelectedSlot(null);
                                setBookingMessage('');
                                setBookingError('');
                            }}
                        />
                    </div>
                </div>

                {loading && <p className="slots-message">Pobieranie dostępności boisk...</p>}
                {error && <p className="slots-error">{error}</p>}
                {bookingMessage && <p className="booking-success">{bookingMessage}</p>}
                {bookingError && <p className="slots-error">{bookingError}</p>}

                {!date && <p className="slots-message">Wybierz datę, aby wyświetlić dostępne terminy.</p>}

                {!loading && !error && date && (
                    <>
                        <div className="field-grid">
                            {fields.map((field) => {
                                const Icon = field.icon;
                                const court = courts.find((item) => item.courtType === field.id);

                                return (
                                    <article className="field-card" key={field.id}>
                                        <div className="field-card-heading">
                                            <div className="field-icon"><Icon size={21} /></div>
                                            <div>
                                                <h3>{field.name}</h3>
                                                <p>{field.subtitle}</p>
                                            </div>
                                        </div>

                                        <p className="field-card-note">
                                            {court
                                                ? court.status === 'Maintenance'
                                                    ? 'Boisko jest obecnie w konserwacji.'
                                                    : 'Kliknij dostępną godzinę, aby ją wybrać.'
                                                : 'Brak danych o tym boisku.'}
                                        </p>

                                        {court ? (
                                            <TimeSlots
                                                prefix={field.id}
                                                courtId={court.id}
                                                slots={court.slots}
                                                selectedSlot={selectedSlot}
                                                onSelect={(slot) => { setSelectedSlot(slot); setBookingMessage(''); setBookingError(''); }}
                                            />
                                        ) : (
                                            <p className="slots-message">Nie znaleziono boiska tego rodzaju w bazie danych.</p>
                                        )}
                                    </article>
                                );
                            })}
                        </div>

                        {selectedSlot && (
                            <div className="booking-summary">
                                <div>
                                    <strong>Wybrany termin</strong>
                                    <p>{date} · {selectedSlot.startTime}–{selectedSlot.endTime}</p>
                                </div>
                                <button type="button" className="primary-button" onClick={reserveCourt} disabled={booking}>
                                    {booking ? 'Rezerwowanie...' : 'Zarezerwuj'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
}

function Repairs() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    return (
        <>
            <PageHeading title="Zgłoszenia usterek" description="Zgłoś problem techniczny w swoim akademiku." />
            <section className="panel form-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Nowe zgłoszenie</h2>
                        <p>Opisz problem, a administracja będzie mogła się nim zająć.</p>
                    </div>
                    <Wrench size={25} />
                </div>

                <label htmlFor="repair-title">Tytuł zgłoszenia</label>
                <input id="repair-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Np. Uszkodzona lampa" />

                <label htmlFor="repair-location">Lokalizacja usterki</label>
                <input id="repair-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Np. Pokój 204, piętro 2" />

                <label htmlFor="repair-description">Opis problemu</label>
                <textarea id="repair-description" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opisz, co się stało..." />

                <button className="primary-button" onClick={() => alert('Wysyłanie zgłoszeń zostanie dodane po podłączeniu backendu.')}>
                    <Plus size={18} /> Wyślij zgłoszenie
                </button>
            </section>
        </>
    );
}

function Applications() {
    return (
        <>
            <PageHeading title="Wnioski" description="Zarządzaj swoimi wnioskami związanymi z akademikiem." />
            <section className="panel">
                <div className="panel-heading">
                    <div>
                        <h2>Moje wnioski</h2>
                        <p>Lista złożonych wniosków</p>
                    </div>
                    <FileText size={25} />
                </div>
                <EmptyState icon={FileText} title="Brak wniosków" description="Twoje wnioski pojawią się tutaj po ich złożeniu." />
            </section>
        </>
    );
}

function Announcements() {
    return (
        <>
            <PageHeading title="Ogłoszenia" description="Aktualności i komunikaty administracji akademika." />
            <section className="panel">
                <EmptyState icon={Megaphone} title="Brak ogłoszeń" description="Aktualnie nie ma żadnych opublikowanych ogłoszeń." />
            </section>
        </>
    );
}

/**
 * Widok profilu zalogowanego mieszkańca
 */
function Profile({ currentUser }) {
    const details = [
        { label: 'Numer indeksu / albumu', value: currentUser?.studentNumber },
        { label: 'Kierunek studiów', value: currentUser?.fieldOfStudy },
        { label: 'Rok studiów', value: currentUser?.yearOfStudy ? `${currentUser.yearOfStudy}. rok` : null },
        { label: 'ID przypisanego pokoju', value: currentUser?.roomId ? `Pokój #${currentUser.roomId}` : null },
        { label: 'ID studenta w bazie', value: currentUser?.id ? `#${currentUser.id}` : null },
        { label: 'ID powiązanego usera', value: currentUser?.userId ? `User #${currentUser.userId}` : null },
    ];

    return (
        <>
            <PageHeading title="Mój profil" description="Informacje o Twoim koncie i profilu studenta z bazy danych." />
            <section className="panel profile-panel">
                <div className="profile-avatar"><UserRound size={40} /></div>
                <h2>Profil mieszkańca (tabela students)</h2>
                <p className="panel-description">Dane pobrane bezpośrednio z tabeli students w bazie danych PostgreSQL:</p>

                <div className="profile-details-grid">
                    {details.map(({ label, value }) => (
                        <div className="profile-detail-card" key={label}>
                            <label>{label}</label>
                            <strong>{value || 'Brak'}</strong>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

/**
 * Główny komponent aplikacji
 */
function App() {
    // Stan zalogowanego użytkownika synchronizowany z localStorage
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('akanet_student');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [activeView, setActiveView] = useState('dashboard');

    function handleLoginSuccess(studentData) {
        setCurrentUser(studentData);
        localStorage.setItem('akanet_student', JSON.stringify(studentData));
        setActiveView('dashboard');
    }

    function handleLogout() {
        setCurrentUser(null);
        localStorage.removeItem('akanet_student');
    }

    // Jeśli użytkownik nie jest zalogowany, wyświetl ekran logowania
    if (!currentUser) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    function renderContent() {
        switch (activeView) {
            case 'laundry':
                return <Laundry currentUser={currentUser} />;
            case 'sports':
                return <Sports currentUser={currentUser} />;
            case 'repairs':
                return <Repairs />;
            case 'applications':
                return <Applications />;
            case 'announcements':
                return <Announcements />;
            case 'profile':
                return <Profile currentUser={currentUser} />;
            default:
                return <Dashboard setActiveView={setActiveView} />;
        }
    }

    return (
        <div className="app-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
            <main className="main-area">
                <Topbar activeView={activeView} currentUser={currentUser} />
                <div className="page-content">{renderContent()}</div>
            </main>
        </div>
    );
}

export default App;
