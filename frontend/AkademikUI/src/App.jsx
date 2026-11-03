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
} from 'lucide-react';

import './App.css';

const API_URL = 'http://localhost:5084/api/sportcourts/availability';

const menuItems = [
    { id: 'dashboard', label: 'Panel główny', icon: LayoutDashboard },
    { id: 'laundry', label: 'Pralnie i suszarnie', icon: WashingMachine },
    { id: 'sports', label: 'Boiska sportowe', icon: Dumbbell },
    { id: 'repairs', label: 'Zgłoszenia usterek', icon: Wrench },
    { id: 'applications', label: 'Wnioski', icon: FileText },
    { id: 'announcements', label: 'Ogłoszenia', icon: Bell },
];

function Sidebar({ activeView, setActiveView }) {
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
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                            onClick={() => setActiveView(item.id)}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{item.label}</span>}
                            {!collapsed && activeView === item.id && (
                                <ChevronRight size={17} className="nav-arrow" />
                            )}
                        </button>
                    );
                })}
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

                <button
                    className="nav-item logout-button"
                    onClick={() => alert('Funkcja wylogowania zostanie dodana później.')}
                    title={collapsed ? 'Wyloguj się' : undefined}
                >
                    <LogOut size={20} />
                    {!collapsed && <span>Wyloguj się</span>}
                </button>
            </div>
        </aside>
    );
}

function Topbar({ activeView }) {
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
                        <strong>Mieszkaniec</strong>
                        <span>Portal mieszkańca</span>
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
                <Shortcut
                    icon={WashingMachine}
                    title="Pralnie i suszarnie"
                    description="Zarezerwuj termin prania"
                    color="blue"
                    onClick={() => setActiveView('laundry')}
                />

                <Shortcut
                    icon={Dumbbell}
                    title="Boiska sportowe"
                    description="Zarezerwuj obiekt sportowy"
                    color="green"
                    onClick={() => setActiveView('sports')}
                />

                <Shortcut
                    icon={Wrench}
                    title="Zgłoś usterkę"
                    description="Przekaż problem administracji"
                    color="orange"
                    onClick={() => setActiveView('repairs')}
                />

                <Shortcut
                    icon={FileText}
                    title="Wnioski"
                    description="Sprawdź i złóż wniosek"
                    color="purple"
                    onClick={() => setActiveView('applications')}
                />
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
                        description="Tutaj pojawią się Twoje rezerwacje pralek, suszarek i boisk."
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

function TimeSlots({ slots, prefix }) {
    if (!slots) {
        return <p className="slots-message">Wybierz datę, aby sprawdzić dostępność terminów.</p>;
    }

    return (
        <div className="time-slots">
            {slots.map((slot) => {
                const slotClass = slot.available ? 'time-slot available' : 'time-slot unavailable';

                return (
                    <div
                        key={`${prefix}-${slot.startTime}`}
                        className={slotClass}
                        title={slot.available ? 'Termin dostępny' : 'Termin niedostępny'}
                    >
                        <Clock size={14} />
                        {slot.startTime}–{slot.endTime}
                    </div>
                );
            })}
        </div>
    );
}

function Laundry() {
    const [floor, setFloor] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('Pralka');

    return (
        <>
            <PageHeading
                title="Pralnie i suszarnie"
                description="Sprawdź urządzenia na swoim piętrze i wybierz dogodny termin."
            />

            <section className="panel reservation-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Twoje rezerwacje</h2>
                        <p>Lista zarezerwowanych przez Ciebie terminów.</p>
                    </div>
                    <CalendarDays size={24} />
                </div>
                <EmptyState
                    icon={CalendarDays}
                    title="Nie masz jeszcze rezerwacji"
                    description="Po podłączeniu systemu Twoje aktualne rezerwacje będą wyświetlane w tym miejscu."
                />
            </section>

            <section className="panel availability-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Pralki i suszarki</h2>
                        <p>Wybierz piętro, datę oraz rodzaj urządzenia.</p>
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
                            onChange={(event) => setFloor(event.target.value)}
                            placeholder="Numer piętra"
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="laundry-date">Data</label>
                        <input
                            id="laundry-date"
                            type="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                        />
                    </div>

                    <div className="filter-field">
                        <label>Rodzaj urządzenia</label>
                        <div className="choice-row">
                            <button
                                type="button"
                                className={type === 'Pralka' ? 'choice active' : 'choice'}
                                onClick={() => setType('Pralka')}
                            >
                                <WashingMachine size={17} />
                                Pralki
                            </button>
                            <button
                                type="button"
                                className={type === 'Suszarka' ? 'choice active' : 'choice'}
                                onClick={() => setType('Suszarka')}
                            >
                                <Clock size={17} />
                                Suszarki
                            </button>
                        </div>
                    </div>
                </div>

                <div className="availability-placeholder">
                    <div className="availability-placeholder-icon">
                        <WashingMachine size={25} />
                    </div>
                    <h3>Lista urządzeń będzie dostępna po podłączeniu bazy danych</h3>
                    <p>
                        Po pobraniu urządzeń dla wybranego piętra pojawią się tutaj osobne karty{' '}
                        {type.toLowerCase()} wraz z 12 dwugodzinnymi przedziałami czasowymi. Ich
                        dostępność nie jest jeszcze znana.
                    </p>
                </div>
            </section>
        </>
    );
}

function Sports() {
    const [date, setDate] = useState('');
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fields = [
        {
            id: 'Football',
            name: 'Boisko do piłki nożnej',
            subtitle: 'Piłka nożna',
            icon: Dumbbell,
        },
        {
            id: 'Volleyball',
            name: 'Boisko do siatkówki',
            subtitle: 'Siatkówka',
            icon: Dumbbell,
        },
        {
            id: 'Basketball',
            name: 'Boisko do koszykówki',
            subtitle: 'Koszykówka',
            icon: Dumbbell,
        },
    ];

    useEffect(() => {
        if (!date) {
            setCourts([]);
            setError('');
            return;
        }

        const controller = new AbortController();

        async function getAvailability() {
            setLoading(true);
            setError('');
            setCourts([]);

            try {
                const response = await fetch(`${API_URL}?date=${encodeURIComponent(date)}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Błąd serwera: ${response.status}`);
                }

                const data = await response.json();
                setCourts(data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Błąd pobierania dostępności:', error);
                    setError(
                        'Nie udało się pobrać dostępności boisk. Sprawdź, czy backend jest uruchomiony.',
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        getAvailability();

        return () => controller.abort();
    }, [date]);

    return (
        <>
            <PageHeading
                title="Boiska sportowe"
                description="Sprawdź harmonogram i wybierz termin dla wybranego boiska."
            />

            <section className="panel reservation-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Twoje rezerwacje</h2>
                        <p>Lista zarezerwowanych przez Ciebie terminów.</p>
                    </div>
                    <CalendarDays size={24} />
                </div>
                <EmptyState
                    icon={CalendarDays}
                    title="Nie masz jeszcze rezerwacji"
                    description="Po podłączeniu systemu Twoje aktualne rezerwacje będą wyświetlane w tym miejscu."
                />
            </section>

            <section className="panel availability-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Dostępność boisk</h2>
                        <p>Wybierz datę, aby sprawdzić harmonogram każdego obiektu.</p>
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
                            onChange={(event) => setDate(event.target.value)}
                        />
                    </div>
                </div>

                {loading && <p className="slots-message">Pobieranie dostępności boisk...</p>}

                {error && <p className="slots-error">{error}</p>}

                {!date && (
                    <p className="slots-message">Wybierz datę, aby wyświetlić dostępne terminy.</p>
                )}

                {!loading && !error && date && (
                    <div className="field-grid">
                        {fields.map((field) => {
                            const Icon = field.icon;
                            const court = courts.find((item) => item.courtType === field.id);

                            return (
                                <article className="field-card" key={field.id}>
                                    <div className="field-card-heading">
                                        <div className="field-icon">
                                            <Icon size={21} />
                                        </div>
                                        <div>
                                            <h3>{field.name}</h3>
                                            <p>{field.subtitle}</p>
                                        </div>
                                    </div>

                                    <p className="field-card-note">
                                        {court
                                            ? court.status === 'Maintenance'
                                                ? 'Boisko jest obecnie w konserwacji.'
                                                : 'Dostępność terminów dla wybranej daty.'
                                            : 'Brak danych o tym boisku.'}
                                    </p>

                                    {court ? (
                                        <TimeSlots prefix={field.id} slots={court.slots} />
                                    ) : (
                                        <p className="slots-message">
                                            Nie znaleziono boiska tego rodzaju w bazie danych.
                                        </p>
                                    )}
                                </article>
                            );
                        })}
                    </div>
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
            <PageHeading
                title="Zgłoszenia usterek"
                description="Zgłoś problem techniczny w swoim akademiku."
            />

            <section className="panel form-panel">
                <div className="panel-heading">
                    <div>
                        <h2>Nowe zgłoszenie</h2>
                        <p>Opisz problem, a administracja będzie mogła się nim zająć.</p>
                    </div>
                    <Wrench size={25} />
                </div>

                <label htmlFor="repair-title">Tytuł zgłoszenia</label>
                <input
                    id="repair-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Np. Uszkodzona lampa"
                />

                <label htmlFor="repair-location">Lokalizacja usterki</label>
                <input
                    id="repair-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Np. Pokój 204, piętro 2"
                />

                <label htmlFor="repair-description">Opis problemu</label>
                <textarea
                    id="repair-description"
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Opisz, co się stało..."
                />

                <button
                    className="primary-button"
                    onClick={() =>
                        alert('Wysyłanie zgłoszeń zostanie dodane po podłączeniu backendu.')
                    }
                >
                    <Plus size={18} />
                    Wyślij zgłoszenie
                </button>
            </section>
        </>
    );
}

function Applications() {
    return (
        <>
            <PageHeading
                title="Wnioski"
                description="Zarządzaj swoimi wnioskami związanymi z akademikiem."
            />

            <section className="panel">
                <div className="panel-heading">
                    <div>
                        <h2>Moje wnioski</h2>
                        <p>Lista złożonych wniosków</p>
                    </div>
                    <FileText size={25} />
                </div>

                <EmptyState
                    icon={FileText}
                    title="Brak wniosków"
                    description="Twoje wnioski pojawią się tutaj po ich złożeniu."
                />
            </section>
        </>
    );
}

function Announcements() {
    return (
        <>
            <PageHeading
                title="Ogłoszenia"
                description="Aktualności i komunikaty administracji akademika."
            />

            <section className="panel">
                <EmptyState
                    icon={Megaphone}
                    title="Brak ogłoszeń"
                    description="Aktualnie nie ma żadnych opublikowanych ogłoszeń."
                />
            </section>
        </>
    );
}

function Profile() {
    return (
        <>
            <PageHeading
                title="Mój profil"
                description="Informacje o Twoim koncie i pobycie w akademiku."
            />

            <section className="panel profile-panel">
                <div className="profile-avatar">
                    <UserRound size={40} />
                </div>

                <h2>Dane mieszkańca</h2>
                <p className="panel-description">
                    Informacje zostaną pobrane z bazy danych po podłączeniu backendu.
                </p>
            </section>
        </>
    );
}

function App() {
    const [activeView, setActiveView] = useState('dashboard');

    function renderContent() {
        switch (activeView) {
            case 'laundry':
                return <Laundry />;
            case 'sports':
                return <Sports />;
            case 'repairs':
                return <Repairs />;
            case 'applications':
                return <Applications />;
            case 'announcements':
                return <Announcements />;
            case 'profile':
                return <Profile />;
            default:
                return <Dashboard setActiveView={setActiveView} />;
        }
    }

    return (
        <div className="app-layout">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="main-area">
                <Topbar activeView={activeView} />

                <div className="page-content">{renderContent()}</div>
            </main>
        </div>
    );
}

export default App;
