Projekt stworzony na przedmiot "Inżynieria oprogramowania".

Stack technologiczny: C# (z wykorzystaniem .NET Core Web API), React (Vite), PostgreSQL.



Instrukcja uruchomienia projektu



Należy zainstalować:

\-.NET 10, 

\-Node.js ver. 24.21, 

\-PostgreSQL ver. 18.6, 

\-pgAdmin 4 ver. 9.18



Zaleca się pisanie backendu w Visual Studio, natomiast frontendu w Visual Studio Code.



Aby skonfigurować bazę danych należy:

\-Uruchomić pgAdmin 4 i połączyć się z lokalnym serwerem.

\-Kliknąć prawym przyciskiem na "Databases", następnie "Create", "Database..."
-Nazwać bazę "AkademikDB" i nacisnąć "Save".

\-Otworzyć plik "backend/AkademikAPI/appsettings.Development.json i w sekcji "Password=" podać hasło, które wpisaliśmy podczas instalacji Postgresa.



Aby uruchomić Backend należy:
-Otworzyć terminal Git Bash w folderze backend/AkademikAPI

\-wpisać komendę do zainstalowania globalnego narzędzia do migracji: "dotnet tool install --global dotnet-ef".

\-Wykonać migrację komendą, aby automatycznie utworzyć tabele w pgAdminie: "dotnet ef database update".

\-Uruchomić serwer backendu komendą: "dotnet run"

Dokumentację i panel testowy powinien być widoczny po wpisaniu w przeglądarce localhost:\[tutaj nazwa, która nam się wyświetli w git bashu]/scalar/v1



Aby zacząć pracę w frontendzie należy:
-Otworzyć git basha w folderze frontend/AkademikUI

\-Zainstalować pakiety komendą: "npm install"

\-Uruchomić aplikację za pomocą: "npm run dev"

Aplikacja w React pojawi się na localhost:\[nazwa z git basha].

# Standardy kodowania

## 1. Konwencje nazewnictwa

1. Nazwy zmiennych i funkcji powinny być opisowe i jednoznaczne.
2. Nazwy klas i typów zapisujemy w stylu PascalCase, np. `PokojeController`.
3. Nazwy zmiennych i funkcji zapisujemy w stylu camelCase, np. `numerPokoju`, `pobierzPokoje()`.
4. Nazwy stałych zapisujemy wielkimi literami z podkreśleniami, np. `API_URL`.
5. Nazwy plików powinny być spójne i odpowiadać zawartości pliku.
6. Należy unikać niejasnych skrótów oraz nazw pozbawionych znaczenia.

## 2. Formatowanie kodu

1. Stosujemy wcięcia o szerokości 4 spacji, chyba że konwencja wybranego języka wymaga innego ustawienia.
2. Każda instrukcja powinna znajdować się w osobnej linii, o ile składnia języka na to pozwala.
3. Bloki kodu powinny być czytelnie oddzielone i poprawnie formatowane.
4. Należy zachowywać spójny sposób rozmieszczania nawiasów klamrowych.
5. Należy unikać nadmiernie długich linii kodu.
6. Puste linie stosujemy do oddzielania logicznych fragmentów kodu.

## 3. Komentarze i dokumentacja

1. Komentarze powinny wyjaśniać cel lub uzasadnienie działania kodu, a nie powtarzać jego treści.
2. Funkcje realizujące istotną logikę biznesową powinny posiadać opis swojego działania.
3. Kod powinien być możliwie czytelny bez konieczności dodawania nadmiernej liczby komentarzy.
4. Dokumentacja projektu powinna być aktualizowana wraz ze zmianami funkcjonalności.

## 4. Organizacja kodu

1. Kod dzielimy na moduły odpowiedzialne za konkretne funkcjonalności.
2. Każdy moduł powinien mieć jasno określoną odpowiedzialność.
3. Logika biznesowa powinna być oddzielona od interfejsu użytkownika i dostępu do bazy danych.
4. Należy unikać powielania tego samego kodu.
5. Zależności pomiędzy modułami powinny być możliwie niewielkie.
6. Pliki i katalogi powinny być uporządkowane zgodnie z przyjętą architekturą projektu.
