/* global UI */

// app.js
// Regla: aquí vive la lógica/estado/orquestación. components.js solo renderiza.
(function main() {
  const appEl = document.getElementById("app");

  // --- "imgs" component (lógica): catálogo y resolución de imgRef -> src/alt/caption ---
  const imageCatalog = Object.freeze({
    CPU: { src: "./assets/cpu.svg", alt: "Icono CPU", caption: "Imagen de apoyo (CPU)" }
  });

  function resolveImage(imgRef) {
    if (!imgRef || !imgRef.imgId) return null;
    const entry = imageCatalog[imgRef.imgId];
    if (!entry) return null;
    return { ...entry };
  }

  // --- "tests" component (lógica): datos y flujo ---
  // Requisito productContext: al menos 3 tests (hardware / Sistemas Informáticos)
  const tests = [
    {
      id: "t1",
      title: "Test 1 · CPU y memoria",
      questions: [
        {
          id: "t1q1",
          statement: "¿Qué componente ejecuta instrucciones y coordina el resto del sistema?",
          options: [
            { key: "A", text: "Fuente de alimentación (PSU)" },
            { key: "B", text: "CPU" },
            { key: "C", text: "Disco duro / SSD" }
          ],
          correct: "B",
          imgRef: { imgId: "CPU", alt: "CPU" }
        },
        {
          id: "t1q2",
          statement: "¿Qué memoria es volátil?",
          options: [
            { key: "A", text: "RAM" },
            { key: "B", text: "SSD" },
            { key: "C", text: "ROM" }
          ],
          correct: "A"
        },
        {
          id: "t1q3",
          statement: "¿Qué significa 'GHz' en el contexto de un procesador?",
          options: [
            { key: "A", text: "Capacidad de almacenamiento" },
            { key: "B", text: "Frecuencia de reloj" },
            { key: "C", text: "Voltaje máximo" }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "t2",
      title: "Test 2 · Placa base y buses",
      questions: [
        {
          id: "t2q1",
          statement: "¿Qué componente conecta CPU, RAM y dispositivos de expansión?",
          options: [
            { key: "A", text: "Placa base" },
            { key: "B", text: "Monitor" },
            { key: "C", text: "Teclado" }
          ],
          correct: "A"
        },
        {
          id: "t2q2",
          statement: "¿Qué ranura se usa típicamente para una tarjeta gráfica moderna?",
          options: [
            { key: "A", text: "PCI Express (PCIe)" },
            { key: "B", text: "SATA" },
            { key: "C", text: "DIMM" }
          ],
          correct: "A"
        },
        {
          id: "t2q3",
          statement: "¿Qué conector se usa para discos SATA?",
          options: [
            { key: "A", text: "HDMI" },
            { key: "B", text: "SATA" },
            { key: "C", text: "RJ-45" }
          ],
          correct: "B"
        }
      ]
    },
    {
      id: "t3",
      title: "Test 3 · Almacenamiento y periféricos",
      questions: [
        {
          id: "t3q1",
          statement: "¿Cuál suele ser más rápido en lectura/escritura?",
          options: [
            { key: "A", text: "SSD" },
            { key: "B", text: "HDD" },
            { key: "C", text: "DVD" }
          ],
          correct: "A"
        },
        {
          id: "t3q2",
          statement: "¿Qué puerto se usa para conectar un monitor digital comúnmente?",
          options: [
            { key: "A", text: "HDMI" },
            { key: "B", text: "USB 2.0" },
            { key: "C", text: "PS/2" }
          ],
          correct: "A"
        },
        {
          id: "t3q3",
          statement: "¿Qué dispositivo convierte información digital en papel?",
          options: [
            { key: "A", text: "Escáner" },
            { key: "B", text: "Impresora" },
            { key: "C", text: "Altavoces" }
          ],
          correct: "B"
        }
      ]
    }
  ];

  // --- "resultados" component (lógica): evaluación ---
  function evaluateAnswer(question, chosen) {
    const normalized = String(chosen || "").toUpperCase();
    const isValid = normalized === "A" || normalized === "B" || normalized === "C";
    const ok = isValid && normalized === question.correct;
    return {
      ok,
      chosen: isValid ? normalized : null,
      correct: question.correct
    };
  }

  // --- Estado ---
  const state = {
    view: "home", // home | testsMenu | testDetail | question | result | summary
    currentTestId: null,
    currentQuestionId: null,
    currentResult: null,
    testOrder: [], // array de question ids
    testIndex: 0, // índice dentro de testOrder
    attemptAnswers: {} // questionId -> "A"|"B"|"C"
  };

  // --- Helpers ---
  function getTestById(id) {
    return tests.find((t) => t.id === id) || null;
  }

  function getCurrentTest() {
    return state.currentTestId ? getTestById(state.currentTestId) : null;
  }

  function getQuestionById(test, questionId) {
    if (!test) return null;
    return test.questions.find((q) => q.id === questionId) || null;
  }

  function startTest(testId) {
    const test = getTestById(testId);
    if (!test) return;

    state.currentTestId = test.id;
    state.testOrder = test.questions.map((q) => q.id);
    state.testIndex = 0;
    state.currentResult = null;
    state.currentQuestionId = state.testOrder[state.testIndex] || null;
    state.attemptAnswers = {};
    state.view = "question";
    render();
  }

  function goHome() {
    state.view = "home";
    state.currentTestId = null;
    state.currentQuestionId = null;
    state.currentResult = null;
    state.testOrder = [];
    state.testIndex = 0;
    state.attemptAnswers = {};
    render();
  }

  function goTestsMenu() {
    state.view = "testsMenu";
    state.currentTestId = null;
    state.currentQuestionId = null;
    state.currentResult = null;
    state.testOrder = [];
    state.testIndex = 0;
    state.attemptAnswers = {};
    render();
  }

  function openTest(testId) {
    const test = getTestById(testId);
    if (!test) return;
    state.currentTestId = test.id;
    state.currentQuestionId = null;
    state.currentResult = null;
    state.view = "testDetail";
    render();
  }

  function openQuestion(questionId) {
    const test = getCurrentTest();
    if (!test) return;

    state.currentQuestionId = questionId;
    state.currentResult = null;
    state.view = "question";
    render();
  }

  function openCurrentTest() {
    if (!state.currentTestId) return goTestsMenu();
    return openTest(state.currentTestId);
  }

  function nextQuestion() {
    const isInTest = state.testOrder.length > 0 && !!state.currentTestId;
    if (!isInTest) return goTestsMenu();

    const nextIndex = state.testIndex + 1;
    if (nextIndex >= state.testOrder.length) {
      state.view = "summary";
      state.currentResult = null;
      state.currentQuestionId = null;
      return render();
    }

    state.testIndex = nextIndex;
    state.currentQuestionId = state.testOrder[state.testIndex];
    state.currentResult = null;
    state.view = "question";
    render();
  }

  // --- Render (orquesta components.js) ---
  function render() {
    let mainHtml = "";
    let asideHtml = "";

    if (state.view === "home") {
      mainHtml = UI.renderHome();
    }

    if (state.view === "testsMenu") {
      mainHtml = UI.renderTestsMenu({
        tests: tests.map((t) => ({ id: t.id, title: t.title, count: t.questions.length }))
      });
    }

    if (state.view === "testDetail") {
      const test = getCurrentTest();
      if (!test) return;
      mainHtml = UI.renderTestDetail({
        id: test.id,
        title: test.title,
        count: test.questions.length,
        questions: test.questions.map((q) => ({ id: q.id, statement: q.statement }))
      });
    }

    if (state.view === "question") {
      const test = getCurrentTest();
      if (!test) return;

      const q = getQuestionById(test, state.currentQuestionId) || test.questions[0];
      if (!q) return;

      const indexInTest = state.testOrder.length
        ? state.testOrder.findIndex((id) => id === q.id)
        : 0;

      mainHtml = UI.renderTestQuestion({
        id: q.id,
        statement: q.statement,
        options: q.options,
        index: Math.max(0, indexInTest),
        total: state.testOrder.length || test.questions.length
      });

      asideHtml = UI.renderImageCard(resolveImage(q.imgRef));
    }

    if (state.view === "result") {
      const test = getCurrentTest();
      const q = getQuestionById(test, state.currentQuestionId);
      if (!q || !state.currentResult) return;

      mainHtml = UI.renderResult(state.currentResult);
      asideHtml = UI.renderImageCard(resolveImage(q.imgRef));
    }

    if (state.view === "summary") {
      const test = getCurrentTest();
      if (!test) return;

      const total = test.questions.length;
      let correct = 0;
      for (const q of test.questions) {
        if (state.attemptAnswers[q.id] && state.attemptAnswers[q.id] === q.correct) correct += 1;
      }

      mainHtml = UI.renderFinalSummary({
        testId: test.id,
        testTitle: test.title,
        total,
        correct
      });
    }

    appEl.innerHTML = UI.renderPage({ mainHtml, asideHtml });
  }

  // --- Eventos ---
  document.addEventListener("click", (ev) => {
    const btn = ev.target && ev.target.closest ? ev.target.closest("[data-action]") : null;
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    if (action === "go-home") return goHome();
    if (action === "go-tests") return goTestsMenu();
    if (action === "open-current-test") return openCurrentTest();
    if (action === "open-test") return openTest(btn.getAttribute("data-test-id"));
    if (action === "start-test") return startTest(btn.getAttribute("data-test-id"));
    if (action === "next-question") return nextQuestion();
    if (action === "open-question") return openQuestion(btn.getAttribute("data-question-id"));
  });

  document.addEventListener("submit", (ev) => {
    const form = ev.target;
    if (!form || !(form instanceof HTMLFormElement)) return;
    if (form.getAttribute("data-action") !== "submit-answer") return;
    ev.preventDefault();

    const qid = form.getAttribute("data-question-id");
    const test = getCurrentTest();
    const q = getQuestionById(test, qid);
    if (!q) return;

    const fd = new FormData(form);
    const chosen = fd.get("option");

    state.currentQuestionId = q.id;
    state.currentResult = evaluateAnswer(q, chosen);
    if (state.currentResult && state.currentResult.chosen) {
      state.attemptAnswers[q.id] = state.currentResult.chosen;
    }
    state.view = "result";
    render();
  });

  // Arranque
  goHome();
})();

