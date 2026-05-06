/* global window */

// components.js
// Regla: SOLO funciones puras que devuelven HTML (strings). Sin estado, sin DOM, sin I/O.
(function attachComponents(global) {
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // --- IMG COMPONENT ---
  function renderImageCard(imageModel) {
    if (!imageModel) return "";
    const { src, alt, caption } = imageModel;
    if (!src) return "";

    return `
      <aside class="card img-card">
        <h2>Imagen</h2>
        <img src="${escapeHtml(src)}" alt="${escapeHtml(alt || "")}" />
        ${caption ? `<p class="muted">${escapeHtml(caption)}</p>` : ""}
      </aside>
    `;
  }

  // --- TESTS COMPONENTS ---
  function renderHome() {
    return `
      <section class="card">
        <h1>Tests de Hardware</h1>
        <p class="muted">
          Estilo “autoescuela”, pero con preguntas de <strong>Sistemas Informáticos</strong>.
        </p>
        <button class="button" data-action="go-tests" type="button">Ver tests</button>
      </section>
    `;
  }

  function renderTestQuestion(questionModel) {
    const q = questionModel;
    const options = q.options
      .map(
        (opt) => `
          <label class="option">
            <input type="radio" name="option" value="${escapeHtml(opt.key)}" required />
            <span><strong>${escapeHtml(opt.key)})</strong> ${escapeHtml(opt.text)}</span>
          </label>
        `
      )
      .join("");

    return `
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <h1>Pregunta ${escapeHtml(q.index + 1)} / ${escapeHtml(q.total)}</h1>
          <button class="nav-btn" data-action="go-tests" type="button">Lista</button>
        </div>
        <p style="font-size:18px;line-height:1.45;margin:8px 0 12px;">
          ${escapeHtml(q.statement)}
        </p>

        <form data-action="submit-answer" data-question-id="${escapeHtml(q.id)}">
          <div class="grid">
            ${options}
          </div>
          <div style="margin-top:12px;">
            <button class="button" type="submit">Responder</button>
          </div>
        </form>
      </section>
    `;
  }

  // --- RESULTADOS COMPONENT ---
  function renderResult(resultModel) {
    const r = resultModel;
    const cls = r.ok ? "ok" : "ko";
    const title = r.ok ? "Correcto" : "Incorrecto";
    const detail = r.ok
      ? `Has marcado ${escapeHtml(r.chosen)}.`
      : `Has marcado ${escapeHtml(r.chosen || "—")} y la correcta era ${escapeHtml(r.correct)}.`;

    return `
      <section class="card">
        <h2>Resultado</h2>
        <div class="result ${cls}">
          <strong>${title}.</strong> ${detail}
        </div>
        <div style="margin-top:12px;">
          <button class="button" data-action="next-question" type="button">Siguiente</button>
          <button class="button secondary" data-action="open-current-test" type="button">Volver al test</button>
        </div>
      </section>
    `;
  }

  function renderTestsMenu(menuModel) {
    const items = menuModel.tests
      .map(
        (t) => `
          <li>
            <div class="row" style="justify-content: space-between; gap: 10px; align-items: baseline;">
              <button class="link" style="background:none;border:none;padding:0;cursor:pointer;text-align:left" data-action="open-test" data-test-id="${escapeHtml(
                t.id
              )}" type="button">
                <strong>${escapeHtml(t.title)}</strong>
                <span class="muted">· ${escapeHtml(t.count)} preguntas</span>
              </button>
              <button class="nav-btn" data-action="start-test" data-test-id="${escapeHtml(t.id)}" type="button">Empezar</button>
            </div>
          </li>
        `
      )
      .join("");

    return `
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <h1>Tests</h1>
          <span class="muted">${escapeHtml(menuModel.tests.length)} tests</span>
        </div>
        <p class="muted">Elige un test. Cada test tiene su propio conjunto de preguntas.</p>
        <ol class="list">${items}</ol>
      </section>
    `;
  }

  function renderTestDetail(detailModel) {
    const items = detailModel.questions
      .map(
        (q) =>
          `<li><button class="link" style="background:none;border:none;padding:0;cursor:pointer;text-align:left" data-action="open-question" data-question-id="${escapeHtml(
            q.id
          )}" type="button">${escapeHtml(q.statement)}</button></li>`
      )
      .join("");

    return `
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <h1>${escapeHtml(detailModel.title)}</h1>
          <button class="nav-btn" data-action="go-tests" type="button">Volver</button>
        </div>
        <p class="muted">${escapeHtml(detailModel.count)} preguntas</p>
        <div style="margin: 10px 0 14px;">
          <button class="button" data-action="start-test" data-test-id="${escapeHtml(detailModel.id)}" type="button">Empezar este test</button>
        </div>
        <ol class="list">${items}</ol>
      </section>
    `;
  }

  function renderFinalSummary(summaryModel) {
    return `
      <section class="card">
        <h1>Resumen</h1>
        <p class="muted">${escapeHtml(summaryModel.testTitle)}</p>
        <div class="result ${summaryModel.correct === summaryModel.total ? "ok" : "ko"}">
          <strong>Puntuación:</strong> ${escapeHtml(summaryModel.correct)} / ${escapeHtml(summaryModel.total)}
        </div>
        <div style="margin-top:12px;">
          <button class="button" data-action="start-test" data-test-id="${escapeHtml(summaryModel.testId)}" type="button">Repetir test</button>
          <button class="button secondary" data-action="go-tests" type="button">Ir a tests</button>
        </div>
      </section>
    `;
  }

  function renderPage(layoutModel) {
    return `
      <div class="grid two">
        <div class="grid">
          ${layoutModel.mainHtml || ""}
        </div>
        <div class="grid">
          ${layoutModel.asideHtml || ""}
        </div>
      </div>
    `;
  }

  global.UI = Object.freeze({
    renderPage,
    renderHome,
    renderTestsMenu,
    renderTestDetail,
    renderTestQuestion,
    renderResult,
    renderFinalSummary,
    renderImageCard
  });
})(window);

