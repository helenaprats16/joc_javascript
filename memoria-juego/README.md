# Joc de Memòria

Aplicació de joc de memòria amb registre/login, perfil i puntuacions.

---

## Què fa exactament?

- Joc de memòria on trobes 10 parelles de cartes
- Sistema d'usuaris (registre i login)
- Cada usuari té el seu perfil amb les seves estadístiques
- Les puntuacions es guarden soles quan acabes de jugar
- El primer que es registra és admin

---

## Per arrancar el projecte

```bash
npm install      # Descarrega les coses que li fan falta
npm run dev      # Ho poses a funcionar
npm test         # Executar els tests
npm run build    # Si el vols per producció
```

---

## Com es juga?

1. Et registres
2. Fas login
3. Cliques el botó de "Joc"
4. Trobes les 10 parelles
5. Veus la puntuació que fas al final de la partida

---

## Tecnologies utilitzades

- JavaScript
- Web Components (components personalitzats)
- Vitest (39 tests per comprovar que funciona)
- RxJS (per fer coses reactives)
- LocalStorage (per guardar les dades)
- Bootstrap 5 (per tindre millor aspecte)

---

## Paleta de colors

```
Fons         → Blau clanet (#E3F2FD)
Cartes       → Groc pastel (#f9f0a1)
Botons       → Groc pastel (#f9f0a1)
Accents      → Groc intens (#f7e85d) al hover
Bordes       → Groc fosc (#e9d204)
Login/Reg    → Negre fosc (#212529)
Admin        → Roig (#dc3545)
Usuari       → Cian (#0dcaf0)
```

---

## Com està organitzat?

```
src/
├── components/       # Els components del joc
├── services/         # Els serveis (autenticació, puntuacions, etc)
├── utils/           # Funcions d'ajuda
├── main.js          # L'inici
└── router.js        # Control de les pàgines
```

---

## Per provar-lo

Pots registrar-te amb aquestes credencials de test:

```
Email:     test@gmail.com
Password:  123456
```

O crear un compte nou si vols.

---

Per més informació: [APUNTES_CONCEPTOS.md](APUNTES_CONCEPTOS.md) | [FUNCIONALITATS_OBJECTIVES.md](FUNCIONALITATS_OBJECTIVES.md)
