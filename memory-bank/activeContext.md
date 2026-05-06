## Active Context

### En qué estamos
Ya tenemos una primera versión MVP en estático (sin backend) para validar la arquitectura.

### Restricciones actuales
- Mantener el patrón: `components.js` (HTML puro) + `app.js` (lógica).
- Mantener componentes encapsulados: `tests`, `resultados`, `imgs`.

### Próximo paso acordado
Refinar el MVP ya implementado:
- definir el objeto `Attempt` completo (para poder calcular score final)
- añadir “fin de test” con pantalla de resumen
- decidir si el flujo es “secuencial” o “modo examen” (N preguntas aleatorias)

### Contratos mínimos (a documentar aquí antes de programar)
- **Question** (pregunta):
  - `id`, `enunciado`, `opciones[]`, `correcta` (si aplica), `imgRef?`
- **Attempt** (intento):
  - `testId?`, `questions[]`, `answersByQuestionId`
- **Result** (resultado):
  - `total`, `correctas`, `fallos`, `detallePorPregunta[]`
- **ImageRef**:
  - `imgId` (o ruta lógica), `alt`

### Decisión clave de encapsulación
- `tests` orquesta el flujo.
- `resultados` evalúa.
- `imgs` resuelve recursos.

### Decisión clave de arquitectura (para cuando programemos)
- `components.js`: funciones puras que reciben datos y devuelven HTML.
- `app.js`: lógica y orquestación (prepara datos y llama a `components.js`).

