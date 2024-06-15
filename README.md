# Aplikacja Lista Zadań + Timer Pomodoro

## Opis
Jest to mobilna aplikacja stworzona przy użyciu React Native i Expo, która łączy funkcjonalność listy zadań z timerem techniki Pomodoro. Aplikacja umożliwia użytkownikowi zarządzanie zadaniami oraz korzystanie z efektywnej metody zarządzania czasem, jaką jest Pomodoro. Dzięki zastosowaniu bazy danych SQLite przy użyciu `expo-sqlite`, dane użytkownika są przechowywane lokalnie na urządzeniu. Grafiki wygenerowane przez AI za pomocą https://copilot.microsoft.com
## Funkcje
- **Lista Zadań**: Możliwość dodawania, edytowania, usuwania oraz oznaczania zadań jako ukończone.
- **Timer Pomodoro**: Użytkownik może ustawić pierwotny czas trwania sesji pracy i rozpocząć odliczanie. Po zakończeniu sesji timer automatycznie przechodzi do trybu pauzy, a użytkownik jest powiadamiany.

## Technologia
- **Expo**: Środowisko do tworzenia i uruchamiania aplikacji mobilnych stworzonych w React Native.
- **React Native**: Framework do budowania natywnych aplikacji mobilnych.
- **SQLite**: Lekka relacyjna baza danych do przechowywania danych użytkownika.
- **expo-sqlite**: Biblioteka Expo do interakcji z bazą danych SQLite na urządzeniach mobilnych.

## Instalacja i Uruchomienie
Aby uruchomić aplikację lokalnie, wykonaj następujące kroki:

1. **Klony repozytorium:**
    ```bash
    git clone link do repo
    cd your_repository
    ```

2. **Instalacja zależności:**
    ```bash
    npm install
    ```

3. **Uruchamianie serwera Expo:**
    ```bash
    npx expo start
    ```

4. **Uruchomienie emulatora Androida:**
    - Otwórz Android Studio.
    - Przejdź do `Device Manager`.
    - Wybierz `Pixel 8 Pro Android 13.0` lub dowolne inne urządzenie/emulator.
    - Wybierz emulator lub fizyczne urządzenie.
    - Dla systemu Android kliknij `A`, aby połączyć się z serwerem Expo i uruchomić aplikację.

## Użycie
Lista zadań pozwala użytkownikowi na:
- **Dodawanie zadań**: Kliknij przycisk `+ New todo`, aby dodać nowe zadanie.
- **Edytowanie zadań**: Naciśnij i przytrzymaj zadanie, aby zobaczyć opcje edycji.
- **Usuwanie zadań**: Naciśnij przycisk `Delete` w menu kontekstowym.
- **Oznaczanie zadań jako ukończone**: Kliknij na zadanie, aby je oznaczyć jako ukończone lub nieukończone.

Timer Pomodoro pozwala użytkownikowi na:
- **Rozpoczęcie sesji**: Kliknij przycisk `Start` aby rozpocząć odliczanie.
- **Pauzowanie sesji**: Kliknij przycisk `Pause`, aby zatrzymać odliczanie.
- **Resetowanie sesji**: Kliknij przycisk `Reset`, aby ustawić domyślny czas (10 minut).
