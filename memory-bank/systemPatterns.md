## System Patterns

### Metodología
- **Memory Bank** como documentación viva del proyecto.
- **MVC por componentes** (cuando empecemos a programar), con una regla concreta de arquitectura:
  - `components.js`: **solo funciones puras** que devuelven HTML (capa de “Vista” reusable).
  - `app.js`: maneja la **lógica** (capa de “Controlador”: estado, flujo, validación y orquestación).

### Patrón “components.js + app.js”
- **`components.js`**
  - Sin estado, sin efectos secundarios (no I/O, no DB, no fetch).
  - Firma típica: `renderX(model) -> string` (HTML).
  - Recibe datos ya preparados (no decide reglas de negocio).
- **`app.js`**
  - Orquesta: obtiene datos, decide qué renderizar, aplica reglas, compone componentes.
  - Es el punto donde vive el flujo entre `tests` → `resultados` → `imgs`.

### Componentes (diseño acordado)
Trabajaremos con 3 componentes **encapsulados** y conectados por contratos claros.

- **`tests`**:
  - **Responsabilidad**: servir preguntas/ejecución del test (flujo y selección de preguntas).
  - **Salida**: genera un “intento” con respuestas del usuario para que se evalúe.

- **`resultados`**:
  - **Responsabilidad**: corrección/evaluación (score, aciertos/fallos, feedback).
  - **Entrada**: recibe intento (preguntas + respuestas) desde `tests`.
  - **Salida**: objeto “resultado” para mostrar (y guardar, más adelante).

- **`imgs`**:
  - **Responsabilidad**: gestión de recursos de imagen (por ejemplo, imágenes de señales).
  - **Entrada**: un identificador de recurso (p.ej. `imgId`).
  - **Salida**: ruta/URL/metadata de la imagen para que `tests`/`resultados` la muestren.

### Integración (acoplamiento mínimo)
- `tests` **no** implementa corrección: delega en `resultados`.
- `tests` y `resultados` **no** “saben” cómo se almacenan/servirán imágenes: consultan a `imgs`.
- Los “contratos” se definen como objetos/estructuras simples (p.ej. `Attempt`, `Result`, `ImageRef`) y se documentan en `activeContext.md`.

### Reglas del repo (por ahora)
- En esta fase **no se crea código**: solo bases documentales.
- Cambios relevantes deben reflejarse en:
  - `activeContext.md` (foco actual)
  - `progress.md` (qué se ha hecho)

