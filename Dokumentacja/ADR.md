\## ADR 1: Wybór relacyjnej bazy danych do zarządzania rezerwacjami.



\### Status

Zaakceptowana



\### Kontekst

Aby wynająć konkretne obiekty, potrzebujemy je mieć zapisane z dodatkowymi informacjami tj. nazwa obiektu, albo czy jest on obecnie wolny, W naszym projekcie potrzebne są relacje, np. jeden akademik posiada wiele pokojów. Chcemy unikać podwójnych rezerwacji w tym samym czasie.



\### Decyzja

Wybraliśmy bazę PostgreSQL do realizacji bazy danych.



\### Konsekwencje
+ Dobry do zastosowania ACID, który jest kluczowy do zabezpieczenia przed zdublowaniem jakiejś rezerwacji.
+ Ułatwia modelowanie relacji pomiędzy tabelkami.
+ Łatwa praca z wykorzystaniem wbudowanych narzędzi.
- Większy narzut na konfigurację i migrację struktur danych wraz z rozwojem projektu w przeciwieństwie do baz danych NoSQL.

## ADR 2: Wybór dostawcy bazy danych.



\### Status 
Porzucona



\### Kontekst

Chcąc razem pracować na jednej bazie danych, najłatwiej jest działać na danych znajdujących się w chmurze, do której każdy będzie miał
dostęp, niż pobierać osobno bazę i działać lokalnie.



\### Decyzja
Do hostowania bazy danych wykorzystaliśmy platformę Neon.tech.



\### Konsekwencje

\+ Darmowy pakiet. 

\+ Brak konieczności jakiejkolwiek instalacji na komputerze.

\- Uzależnienie od dostawcy.

\- Wolne pierwsze uruchomienie po dłuższej bezczynności ze względu na wbudowany system wybudzania.



\## ADR 3: Wybór technologii dla frontendu.



\### Status
Zaakceptowana



\### Kontekst
Zarządzanie akademikiem do wygodnego działania potrzebuje przejrzystego interfejsu graficznego, który umożliwi wyświetlanie 
obecnych rezerwacji lub ogłoszeń.



\### Decyzja

Do tworzenia frontendu wybraliśmy React.js, do pisania kodu wykorzystaliśmy Visual Studio Code ze względu duży, wbudowany ekosystem
stworzony m.in. do JavaScriptu i TypeScriptu, który jest wymagany do działania Reacta.



\### Konsekwencje

\+ Bogaty ekosystem wbudowanych bibliotek.
+ Obsługa Hot Reloadu, który przyspiesza pisanie kodu.

\- Konieczność konfiguracji polityki CORS (Cross-Origin Resource Sharing), aby móc pobierać dane z Neona.



\## ADR 4: Wybór języka do backendu.



\### Status

Zaakceptowana



\### Kontekst

Sam React nie obsłuży wysyłania poleceń do bazy i ich pobierania, a od tego będzie osobna aplikacja, która będzie odpowiadała za logikę biznesową.



\### Decyzja

Do tworzenia frontendu wybraliśmy język C#, a jako IDE Visual Studio ze względu na to, że zarówno język jak i IDE jest rozwijane przez
tę samą firmę.



\### Konsekwencje

\+ Wbudowane mechanizmy bezpieczeństwa, które minimalizują ryzyko takich podatności jak przepełnienie bufora.

\+ Zastosowanie LINQ, które ułatwia pisanie komend do baz danych.

\- Jest narzut asynchroniczności, aby nie blokować wątków podczas wysyłania zapytań do bazy. Błędne zaimplementowanie może

prowadzić do zakleszczenia i spadku wydajności.



\## ADR 5: Wybór ekosystemu backendowego



\### Status
Zaakceptowana



\### Kontekst

Aby dobrze połączyć backend z frontendem potrzeba frameworku, który obsłuży żądania HTTP wysyłane z Reacta oraz narzędzia z bazą
PostgreSQL. Pomaga przy tworzeniu projektu, dostarczając odpowiednie narzędzia.



\### Decyzja

Zdecydowaliśmy się na wykorzystanie platformy .NET oraz frameworka ASP.NET Core Web API.



\### Konsekwencje

\+ Wysoka wydajność, ASP .NET Core gwarantuje szybkie przetwarzanie żądań HTTP.
+ Takie zestawy poleceń jak dotnet build, lub dotnet run działają identycznie na różnych systemach operacyjnych.

\- Ekosystem .NET mimo wszystko najlepiej się spełnia na Windowsie.

