# guidatv

Piccola web app Vue 3 + Vite per visualizzare il palinsesto TV: per ogni canale mostra il programma in corso e il successivo. Ottimizzata anche per la stampa tramite Tailwind CSS.

## Requisiti
- Node.js >= 16
- npm o yarn
- Variabili d'ambiente nel file `.env` (VITE_API_URL, VITE_API_KEY)

## Installazione
1. Clona il repository
2. Esegui:
   - npm: `npm install`
   - yarn: `yarn`

## Configurazione
Creare `.env` nella radice del progetto (esempio già presente nel repo):
VITE_API_KEY e VITE_API_URL devono puntare all'API EPG.

Esempio:
```
VITE_API_KEY=tuachiave
VITE_API_URL=https://domain.example/endpoint
```

## Script utili
- `npm run dev` — avvia il server di sviluppo (Vite)
- `npm run build` — build di produzione
- `npm run preview` — preview della build di produzione

(Usa gli equivalenti con `yarn` se preferisci.)

## Architettura (breve)
- src/
  - main.ts (bootstrap)
  - App.vue
  - router/ — routing
  - stores/ — Pinia store (`data.store.ts`) che carica e normalizza i dati
  - composables/ — hook riutilizzabili (`useDailyFetch.ts`)
  - api/ — chiamate all'API (`dataService.ts`)
  - views/ — pagine (IndexView.vue)
  - models/ — tipi TypeScript per i dati
  - style.css — Tailwind CSS import

## Come funziona
- `useDailyFetch` carica i dati al mount chiamando `fetchDailyData`.
- `data.store` mantiene `palinsesto` e `programmi` e offre helper per normalizzare i dati.
- `IndexView.vue` calcola, per ogni canale, il programma corrente e il successivo e li rende in una card moderna.
- È inclusa una utility consigliata per estrarre corrente+successivo (verificare `src/utils` se aggiunta).

## Stampa e Tailwind
- Il template è ottimizzato per la stampa usando utility `print:` di Tailwind e `page-break-inside: avoid` per evitare che una card si spezzi su più pagine.
- Per una resa migliore in stampa: ridurre padding/margini con classi `print:p-2`, usare font-size compatto `print:text-sm` e rimuovere ombre `print:shadow-none`.

## Note di sviluppo
- I programmi sono ordinati per `inizio` e `fine` (ISO strings). Verificare il fuso orario locale quando si fanno confronti temporali.
- Per testare il comportamento nel tempo è utile poter passare una data di riferimento (dependency injection nella funzione che determina current/next).
- Controllare che l'API ritorni la struttura attesa: `data.canali[0].canali` (vedi `fetchDailyData`).

## Contributi
Aggiunte e fix sono benvenute. Aprire PR concise e descrittive.

## Licenza
Non specificata (aggiungere una licenza a piacere).

