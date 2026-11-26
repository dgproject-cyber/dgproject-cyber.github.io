# Sito Francesco Cavaliere: come personalizzarlo

Struttura:

```
index.html            contenuto delle sezioni (cerca i commenti "MODIFICA")
assets/css/style.css  colori, caratteri, impaginazione (colori in cima, in :root)
assets/js/main.js     interazioni + CONFIG con contatti e trasformazioni
assets/img/           foto (compaiono da sole quando il file c'è)
assets/video/         video del hero
versioni-precedenti/  bozze vecchie
```

## Foto e video
Basta salvare i file con questi nomi: il sito li mostra al posto dei riquadri segnaposto.

| File | Dove compare | Formato consigliato |
|---|---|---|
| `assets/video/hero.mp4` | sfondo prima schermata | 1920×1080, muto, max 6-8 MB |
| `assets/img/hero.jpg` | sfondo se il video manca | 2400 px di lato lungo |
| `assets/img/ritratto.jpg` | Chi sono | verticale 4:5 |
| `assets/img/metodo-forza.jpg` … `metodo-ricomposizione.jpg` | card del Metodo | orizzontale |
| `assets/img/prima-1.jpg` / `dopo-1.jpg` (e 2, 3) | slider Prima/Dopo | stessa inquadratura, verticale |
| `assets/img/og-cover.jpg` | anteprima quando si condivide il link | 1200×630 |

Comprimi le foto (ad esempio con squoosh.app) prima di caricarle: meglio sotto 300 KB l'una.

## Testi da completare
In `index.html` i testi segnaposto hanno la classe `slot` (riquadro tratteggiato arancione).
Scrivi il testo vero e **togli `slot`** e `data-slot="…"` da quell'elemento.

## Numeri reali
In `index.html`, sezione Risultati: `data-count="120"` fa partire il contatore fino a 120.
Lasciato vuoto mostra "—". Non inserire numeri inventati.

## Contatti e modulo
In `assets/js/main.js`, oggetto `CONFIG`:
- `whatsapp`: numero con prefisso, solo cifre (es. `393331234567`)
- `instagram`: nome utente senza @
- `moduloEndpoint`: indirizzo di un servizio come Formspree per ricevere le richieste via email
- `trasformazioni`: titolo e dettagli reali di ogni prima/dopo
- `google`: link della scheda Google, link "lascia una recensione", voto medio e numero reali, recensioni copiate identiche dalla scheda
- `mappa`: link e codice "Incorpora una mappa" presi dalla scheda Google Maps della palestra Elite (Condividi → Incorpora)

Nota: non aggiungere dati strutturati con le stelle (AggregateRating) per le recensioni: Google non li accetta se sono sul sito dell'attività stessa.

## SEO locale
In `index.html`, nel blocco `application/ld+json` in alto: quando li hai, aggiungi via, CAP e telefono della palestra e i link `sameAs` (Instagram, scheda Google). Usa gli stessi identici dati ovunque (sito, scheda Google, Instagram).

## Prima di pubblicare
- Indirizzo definitivo in `<link rel="canonical">` (in alto in `index.html`)
- Servizi del Metodo confermati da Francesco (per toglierne uno, cancella il suo `<article>`)
- Informativa privacy collegata al consenso del modulo

## Dopo ogni modifica a CSS o JS
In fondo e in cima a `index.html` i file hanno un numero di versione (`style.css?v=…`, `main.js?v=…`).
Cambialo (es. `20261126-3` → `20261127-1`) così i browser scaricano subito la versione nuova invece di quella salvata.
