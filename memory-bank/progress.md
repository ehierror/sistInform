## Progress

### Hecho
- Reinicio de `proyFinalM` para empezar paso a paso.
- Creación del conjunto mínimo de Memory Bank:
  - `productContext.md`
  - `systemPatterns.md`
  - `activeContext.md`
  - `progress.md`
- Creación de `mensajes_prompts.txt` para registrar prompts del chat.
- Definido a nivel documental el diseño de 3 componentes encapsulados: `tests`, `resultados`, `imgs`.
- Definida a nivel documental la arquitectura: `components.js` (HTML puro) + `app.js` (lógica).
- Implementado MVP estático (sin backend) con:
  - `index.html`
  - `css/styles.css`
  - `js/components.js` (renders puros)
  - `js/app.js` (estado, flujo, evaluación)
  - `assets/stop.svg` (ejemplo para `imgs`)

### Pendiente (siguiente)
- Añadir “resultado final” (score) al terminar el test.
- Persistencia (cuando toque): guardar preguntas/attempts (DB o JSON).

