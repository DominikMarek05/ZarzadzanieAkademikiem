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

