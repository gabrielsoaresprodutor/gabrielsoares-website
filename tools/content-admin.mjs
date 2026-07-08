import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";

const ROOT = process.cwd();
const PORT = 5177;

const paths = {
  trustedBy: path.join(ROOT, "src", "components", "TrustedBy.astro"),
  projects: path.join(ROOT, "src", "data", "projects.ts"),
  workSection: path.join(ROOT, "src", "components", "WorkSection.astro"),
};

const html = String.raw`<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gabriel Content Admin</title>
  <style>
    :root{--bg:#050505;--card:#111;--line:rgba(255,255,255,.1);--gold:#d2b078;--text:#fff;--muted:#aaa;--ok:#79d29b;--bad:#ff8e8e;--blue:#93c5fd}
    *{box-sizing:border-box} body{margin:0;background:radial-gradient(circle at top,#171717,#050505 52%);color:var(--text);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.45}
    header{padding:42px 6% 22px;border-bottom:1px solid var(--line)}
    header p{color:var(--muted);max-width:820px;margin:10px 0 0} h1{font-size:clamp(2rem,5vw,4rem);margin:0;letter-spacing:-.04em} h2{margin:0 0 18px;font-size:1.4rem}.wrap{max-width:1240px;margin:auto;padding:32px 6% 80px}.grid{display:grid;grid-template-columns:1fr;gap:26px}.card{background:linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025));border:1px solid var(--line);border-radius:24px;padding:24px;box-shadow:0 22px 70px rgba(0,0,0,.32)}
    .two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}.four{display:grid;grid-template-columns:1.15fr 1fr 1fr auto;gap:14px;align-items:end}label{display:block;color:#ddd;font-size:.78rem;letter-spacing:.04em;text-transform:uppercase;margin:12px 0 7px}input,textarea,select{width:100%;border:1px solid rgba(255,255,255,.13);background:rgba(0,0,0,.35);color:white;border-radius:14px;padding:12px 13px;font:inherit;outline:none}textarea{min-height:96px;resize:vertical}.hint{font-size:.78rem;color:var(--muted);margin-top:7px}.section-title{margin-top:22px;color:var(--gold);font-size:.82rem;letter-spacing:.14em;text-transform:uppercase}.mini-title{margin:24px 0 2px;color:#fff;font-size:1.02rem}button{border:0;border-radius:999px;background:var(--gold);color:#17100a;font-weight:800;padding:13px 18px;cursor:pointer;margin-top:18px;white-space:nowrap}button.secondary{background:transparent;color:white;border:1px solid var(--line)}button.danger{background:transparent;color:#ffb4b4;border:1px solid rgba(255,142,142,.35)}.status{white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.82rem;margin-top:16px;padding:14px;border-radius:16px;background:rgba(0,0,0,.32);border:1px solid var(--line);color:var(--muted)}.ok{color:var(--ok)}.bad{color:var(--bad)}code{color:#f0d7a3}.tabs{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px}.tabs a{color:white;text-decoration:none;border:1px solid var(--line);padding:9px 13px;border-radius:999px;background:rgba(255,255,255,.035);font-size:.86rem}.pill{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.13);color:#ddd;background:rgba(255,255,255,.04);font-size:.78rem}.checkbox-line{display:flex;align-items:center;gap:10px;margin-top:14px}.checkbox-line input{width:auto}.list-preview{color:#bdbdbd;font-size:.8rem;line-height:1.65;max-height:170px;overflow:auto;border:1px solid var(--line);border-radius:16px;padding:12px;background:rgba(0,0,0,.22)}@media(max-width:900px){.two,.three,.four{grid-template-columns:1fr}.card{padding:20px}}
  </style>
</head>
<body>
  <header>
    <h1>Gabriel Content Admin <span style="font-size:.95rem;color:var(--gold);letter-spacing:0">v2.1</span></h1>
    <p>Ferramenta local para adicionar e organizar depoimentos, projetos, All Works e Featured Works do seu site Astro. Ela escreve direto nos arquivos do projeto e cria backup antes de salvar.</p>
  </header>

  <main class="wrap">
    <nav class="tabs">
      <a href="#depoimentos">Depoimentos</a>
      <a href="#projetos">Adicionar Projeto</a>
      <a href="#allworks">All Works</a>
      <a href="#featured">Featured Works</a>
    </nav>

    <div class="grid">
      <section class="card" id="depoimentos">
        <h2>Adicionar depoimento</h2>
        <p class="hint">Antes de salvar, coloque a foto em <code>src/assets/testimonials/</code>. Exemplo: <code>ronnye-dias.png</code>.</p>

        <form id="testimonialForm">
          <div class="three">
            <div><label>Nome</label><input name="name" placeholder="Ronnye Dias" required /></div>
            <div><label>Foto</label><input name="imageFilename" placeholder="ronnye-dias.png" required /></div>
            <div><label>Localização</label><input name="location" placeholder="🇧🇷 São Paulo, Brazil" /></div>
          </div>

          <div class="three">
            <div><label>Iniciais</label><input name="initials" placeholder="RD" /></div>
            <div><label>Classe da foto</label><input name="avatarClass" placeholder="ronnye-avatar" /></div>
            <div><label>Posição do novo depoimento</label><select name="position" data-position-for="testimonials"><option value="end">Adicionar no final</option></select></div>
          </div>

          <p class="section-title">Cargo nas 3 línguas</p>
          <div class="three">
            <div><label>EN</label><input name="titleEn" placeholder="Orchestral Arranger • Conductor" required /></div>
            <div><label>PT</label><input name="titlePt" placeholder="Arranjador Orquestral • Maestro" required /></div>
            <div><label>ES</label><input name="titleEs" placeholder="Arreglista Orquestal • Director de Orquesta" required /></div>
          </div>

          <p class="section-title">Conquistas</p>
          <div class="three">
            <div><label>EN</label><textarea name="achievementsEn" placeholder="💎 30+ Years...&#10;🏆 2,000+..."></textarea></div>
            <div><label>PT</label><textarea name="achievementsPt" placeholder="💎 Mais de 30 anos...&#10;🏆 Mais de 2000..."></textarea></div>
            <div><label>ES</label><textarea name="achievementsEs" placeholder="💎 Más de 30 años...&#10;🏆 Más de 2000..."></textarea></div>
          </div>
          <p class="hint">Cada quebra de linha vira <code>&lt;br /&gt;</code> automaticamente.</p>

          <p class="section-title">Trabalhou com / destaques</p>
          <div class="three">
            <div><label>EN</label><textarea name="workedWithEn" placeholder="Leonardo Gonçalves • Paulo César Baruk&#10;Pedro Valença • Daniela Araújo"></textarea></div>
            <div><label>PT</label><textarea name="workedWithPt"></textarea></div>
            <div><label>ES</label><textarea name="workedWithEs"></textarea></div>
          </div>

          <p class="section-title">Texto do depoimento</p>
          <div class="three">
            <div><label>EN</label><textarea name="quoteEn" required></textarea></div>
            <div><label>PT</label><textarea name="quotePt" required></textarea></div>
            <div><label>ES</label><textarea name="quoteEs" required></textarea></div>
          </div>

          <button type="submit">Adicionar depoimento</button>
          <button class="secondary" type="reset">Limpar</button>
          <div id="testimonialStatus" class="status">Pronto.</div>
        </form>

        <h3 class="mini-title">Reposicionar depoimento já existente</h3>
        <p class="hint">Escolha a pessoa e depois a nova posição. A ordem dessa lista é a ordem atual do site.</p>
        <form id="moveTestimonialForm">
          <div class="three">
            <div><label>Depoimento</label><select name="name" data-list="testimonial-items"></select></div>
            <div><label>Nova posição</label><select name="target" data-position-for="testimonials"><option value="end">Mover para o final</option></select></div>
            <div><button type="submit">Mover depoimento</button></div>
          </div>
          <div id="moveTestimonialStatus" class="status">Pronto.</div>
        </form>
      </section>

      <section class="card" id="projetos">
        <h2>Adicionar projeto / álbum</h2>
        <p class="hint">Antes de salvar, coloque a capa em <code>src/assets/projects/</code>. Exemplo: <code>temporal.png</code>.</p>

        <form id="projectForm">
          <div class="three">
            <div><label>Slug</label><input name="slug" placeholder="temporal" required /></div>
            <div><label>Collection</label><input name="collection" placeholder="vl-albums" required /></div>
            <div><label>Capa</label><input name="imageFilename" placeholder="temporal.png" required /></div>
          </div>

          <div class="three">
            <div><label>Artista</label><input name="artist" placeholder="Vocal Livre" required /></div>
            <div><label>Título</label><input name="title" placeholder="Temporal" required /></div>
            <div><label>Função</label><input name="role" placeholder="Music Production • Acoustic Guitar" required /></div>
          </div>

          <div class="two">
            <div><label>Destaque</label><input name="highlight" placeholder="Latin GRAMMY® Nominee" /></div>
            <div><label>Créditos</label><input name="credits" placeholder="Music Production, Acoustic Guitar, Arrangement" /></div>
          </div>

          <label>Descrição</label><textarea name="description" required></textarea>

          <div class="two">
            <div><label>Spotify</label><input name="spotify" placeholder="https://..." /></div>
            <div><label>YouTube</label><input name="youtube" placeholder="https://..." /></div>
          </div>

          <div class="two">
            <div><label>Posição no All Works</label><select name="allPosition" data-position-for="projects"><option value="end">Adicionar no final</option></select></div>
            <div>
              <label>Featured Works / Página inicial</label>
              <div class="checkbox-line"><input id="featuredHome" name="featuredHome" type="checkbox" /> <span>Também mostrar esse projeto na primeira página</span></div>
            </div>
          </div>

          <div id="featuredPositionBox" style="display:none">
            <label>Posição no Featured Works</label>
            <select name="featuredPosition" data-position-for="featured"><option value="end">Adicionar no final dos Featured Works</option></select>
          </div>

          <button type="submit">Adicionar projeto</button>
          <button class="secondary" type="reset">Limpar</button>
          <div id="projectStatus" class="status">Pronto.</div>
        </form>
      </section>

      <section class="card" id="allworks">
        <h2>Reorganizar All Works</h2>
        <p class="hint">Essa aba altera a ordem geral dos projetos em <code>src/data/projects.ts</code>. Essa é a ordem usada pela página <code>/work</code>.</p>

        <div class="two">
          <div>
            <h3 class="mini-title">Ordem atual do All Works</h3>
            <div id="allWorksPreview" class="list-preview">Carregando...</div>
          </div>
          <div>
            <h3 class="mini-title">Como funciona</h3>
            <p class="hint"><span class="pill">All Works</span> controla a página geral de trabalhos.</p>
            <p class="hint"><span class="pill">Featured Works</span> controla só a primeira página.</p>
          </div>
        </div>

        <h3 class="mini-title">Mover projeto / álbum no All Works</h3>
        <form id="moveProjectForm">
          <div class="three">
            <div><label>Projeto</label><select name="slug" data-list="project-items"></select></div>
            <div><label>Nova posição</label><select name="target" data-position-for="projects"><option value="end">Mover para o final</option></select></div>
            <div><button type="submit">Mover no All Works</button></div>
          </div>
          <div id="moveProjectStatus" class="status">Pronto.</div>
        </form>
      </section>

      <section class="card" id="featured">
        <h2>Gerenciar Featured Works da primeira página</h2>
        <p class="hint">Aqui você controla os projetos que aparecem na Home, dentro do array <code>featuredProjectSlugs</code> em <code>src/components/WorkSection.astro</code>.</p>

        <div class="two">
          <div>
            <h3 class="mini-title">Ordem atual dos Featured Works</h3>
            <div id="featuredPreview" class="list-preview">Carregando...</div>
          </div>
          <div>
            <h3 class="mini-title">Legenda</h3>
            <p class="hint"><span class="pill">Featured</span> aparece na primeira página.</p>
            <p class="hint"><span class="pill">All Works</span> fica apenas na página geral de trabalhos, a menos que seja marcado como Featured.</p>
          </div>
        </div>

        <h3 class="mini-title">Adicionar ou remover da Home</h3>
        <form id="featureToggleForm">
          <div class="four">
            <div><label>Projeto</label><select name="slug" data-list="project-items"></select></div>
            <div><label>Posição se adicionar</label><select name="target" data-position-for="featured"><option value="end">Adicionar no final</option></select></div>
            <div><button type="submit" name="action" value="add">Adicionar ao Featured</button></div>
            <div><button class="danger" type="submit" name="action" value="remove">Remover do Featured</button></div>
          </div>
          <div id="featureToggleStatus" class="status">Pronto.</div>
        </form>

        <h3 class="mini-title">Reposicionar Featured Works</h3>
        <form id="moveFeaturedForm">
          <div class="three">
            <div><label>Featured Work</label><select name="slug" data-list="featured-items"></select></div>
            <div><label>Nova posição</label><select name="target" data-position-for="featured"><option value="end">Mover para o final</option></select></div>
            <div><button type="submit">Mover Featured</button></div>
          </div>
          <div id="moveFeaturedStatus" class="status">Pronto.</div>
        </form>
      </section>
    </div>
  </main>

  <script>
    let summary = { testimonials: [], projects: [], featuredSlugs: [] };

    const toObject = (form) => Object.fromEntries(new FormData(form).entries());
    const labelProject = (project) => project.title + " — " + project.artist + " (" + project.slug + ")" + (project.featured ? " ★" : "");

    function clearAndFill(select, options){
      const oldValue = select.value;
      select.innerHTML = "";
      options.forEach((option) => {
        const el = document.createElement("option");
        el.value = option.value;
        el.textContent = option.label;
        select.appendChild(el);
      });
      if ([...select.options].some((option) => option.value === oldValue)) select.value = oldValue;
    }

    function positionOptions(items, labelFn, endLabel){
      const options = [{ value: "end", label: endLabel || "Colocar no final" }];
      items.forEach((item) => {
        options.push({ value: "before|" + item.id, label: "Antes de: " + labelFn(item) });
        options.push({ value: "after|" + item.id, label: "Depois de: " + labelFn(item) });
      });
      return options;
    }

    async function loadSummary(){
      const response = await fetch("/api/summary");
      summary = await response.json();

      const testimonialItems = summary.testimonials.map((item) => ({ id: item.name, label: item.name }));
      const projectItems = summary.projects.map((item) => ({ id: item.slug, label: labelProject(item) }));
      const featuredItems = summary.featuredProjects.map((item) => ({ id: item.slug, label: labelProject(item) }));

      document.querySelectorAll('[data-list="testimonial-items"]').forEach((select) => {
        clearAndFill(select, testimonialItems.map((item) => ({ value: item.id, label: item.label })));
      });

      document.querySelectorAll('[data-list="project-items"]').forEach((select) => {
        clearAndFill(select, projectItems.map((item) => ({ value: item.id, label: item.label })));
      });

      document.querySelectorAll('[data-list="featured-items"]').forEach((select) => {
        clearAndFill(select, featuredItems.map((item) => ({ value: item.id, label: item.label })));
      });

      document.querySelectorAll('[data-position-for="testimonials"]').forEach((select) => {
        clearAndFill(select, positionOptions(testimonialItems, (item) => item.label, select.name === "position" ? "Adicionar no final" : "Mover para o final"));
      });

      document.querySelectorAll('[data-position-for="projects"]').forEach((select) => {
        clearAndFill(select, positionOptions(projectItems, (item) => item.label, select.name === "allPosition" ? "Adicionar no final" : "Mover para o final"));
      });

      document.querySelectorAll('[data-position-for="featured"]').forEach((select) => {
        clearAndFill(select, positionOptions(featuredItems, (item) => item.label, select.name === "featuredPosition" ? "Adicionar no final dos Featured Works" : "Mover/adicionar no final"));
      });

      const allWorksPreview = document.querySelector("#allWorksPreview");
      if (allWorksPreview) {
        allWorksPreview.innerHTML = summary.projects.length
          ? summary.projects.map((item, index) => (index + 1) + ". " + labelProject(item).replace(" ★", "")).join("<br />")
          : "Nenhum projeto encontrado no All Works.";
      }

      const preview = document.querySelector("#featuredPreview");
      if (preview) {
        preview.innerHTML = summary.featuredProjects.length
          ? summary.featuredProjects.map((item, index) => (index + 1) + ". " + labelProject(item).replace(" ★", "")).join("<br />")
          : "Nenhum Featured Work encontrado.";
      }
    }

    async function submitForm(form, endpoint, statusEl, extra = {}){
      statusEl.textContent = "Salvando...";
      statusEl.className = "status";

      try{
        const payload = { ...toObject(form), ...extra };
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        statusEl.textContent = data.message || JSON.stringify(data, null, 2);
        statusEl.className = "status " + (data.ok ? "ok" : "bad");
        if (data.ok) await loadSummary();
      }catch(error){
        statusEl.textContent = String(error);
        statusEl.className = "status bad";
      }
    }

    featuredHome.addEventListener("change", () => {
      featuredPositionBox.style.display = featuredHome.checked ? "block" : "none";
    });

    projectForm.addEventListener("reset", () => {
      setTimeout(() => { featuredPositionBox.style.display = "none"; }, 0);
    });

    testimonialForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(testimonialForm, "/api/add-testimonial", testimonialStatus);
    });

    moveTestimonialForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(moveTestimonialForm, "/api/move-testimonial", moveTestimonialStatus);
    });

    projectForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(projectForm, "/api/add-project", projectStatus, { featuredHome: featuredHome.checked ? "yes" : "" });
    });

    moveProjectForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(moveProjectForm, "/api/move-project", moveProjectStatus);
    });

    featureToggleForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const action = event.submitter?.value || "add";
      submitForm(featureToggleForm, action === "remove" ? "/api/featured/remove" : "/api/featured/add", featureToggleStatus);
    });

    moveFeaturedForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(moveFeaturedForm, "/api/featured/move", moveFeaturedStatus);
    });

    loadSummary().catch((error) => {
      document.querySelectorAll(".status").forEach((el) => {
        el.textContent = "Erro ao carregar listas: " + error;
        el.className = "status bad";
      });
    });
  </script>
</body>
</html>`;

function sendJson(res, status, payload){
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendHtml(res){
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

async function readBody(req){
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function jsString(value){
  return JSON.stringify(String(value ?? ""));
}

function withBreaks(value){
  return String(value ?? "").trim().replace(/\r?\n/g, "<br />");
}

function slugify(value){
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function camelFromFilename(filename){
  const base = path.basename(String(filename || ""), path.extname(String(filename || "")));
  const parts = slugify(base).split("-").filter(Boolean);
  if (!parts.length) return "imagePhoto";
  return parts[0] + parts.slice(1).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("") + "Photo";
}

function initialsFromName(name){
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("") || "GS";
}

async function backupFile(filePath){
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.copyFile(filePath, `${filePath}.backup-${stamp}`);
}

function insertBeforeMarker(content, marker, insertion){
  const index = content.indexOf(marker);
  if (index === -1) throw new Error(`Marcador não encontrado: ${marker}`);
  return content.slice(0, index) + insertion + content.slice(index);
}

function scanToMatching(content, openIndex, openChar, closeChar){
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = openIndex; i < content.length; i++) {
    const char = content[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === openChar) depth++;
    if (char === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }

  throw new Error(`Não encontrei fechamento para ${openChar}`);
}

function findArrayBounds(content, markerText){
  const markerIndex = content.indexOf(markerText);
  if (markerIndex === -1) throw new Error(`Não encontrei ${markerText}`);

  // Importante: em TypeScript pode existir algo como
  // export const projects: Project[] = [ ... ]
  // Se procurarmos o primeiro "[" depois do nome, pegamos o [] do tipo Project[],
  // não o array real. Por isso procuramos primeiro o sinal de = e só depois o [.
  const equalsIndex = content.indexOf("=", markerIndex);
  const searchFrom = equalsIndex === -1 ? markerIndex : equalsIndex;

  const open = content.indexOf("[", searchFrom);
  if (open === -1) throw new Error(`Não encontrei [ depois de ${markerText}`);
  const close = scanToMatching(content, open, "[", "]");
  return { open, close, inner: content.slice(open + 1, close) };
}

function parseTopLevelObjectBlocks(inner){
  const blocks = [];
  let quote = null;
  let escaped = false;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];

    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth++;
      continue;
    }

    if (char === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        let end = i + 1;
        while (end < inner.length && /\s/.test(inner[end])) end++;
        if (inner[end] === ",") end++;
        blocks.push(inner.slice(start, end).trim());
        start = -1;
      }
    }
  }

  return blocks;
}

function replaceArrayInner(content, bounds, blocks){
  return content.slice(0, bounds.open + 1) + "\n" + blocks.map((block) => block.trim().replace(/^/gm, "  ")).join("\n") + "\n" + content.slice(bounds.close);
}

function extractFieldFromBlock(block, field){
  const regex = new RegExp(`${field}\\s*:\\s*["']([^"']+)["']`);
  return block.match(regex)?.[1] || "";
}

function parseTarget(target){
  const value = String(target || "end");
  if (value === "end") return { mode: "end", id: "" };
  const [mode, ...rest] = value.split("|");
  return { mode, id: rest.join("|") };
}

function insertBlockByTarget(blocks, block, target, getId){
  const { mode, id } = parseTarget(target);
  const cleanBlock = block.trim();

  if (mode === "before" || mode === "after") {
    const index = blocks.findIndex((item) => getId(item) === id);
    if (index !== -1) {
      const insertIndex = mode === "before" ? index : index + 1;
      blocks.splice(insertIndex, 0, cleanBlock);
      return blocks;
    }
  }

  blocks.push(cleanBlock);
  return blocks;
}

function moveBlockByTarget(blocks, movingId, target, getId){
  const fromIndex = blocks.findIndex((block) => getId(block) === movingId);
  if (fromIndex === -1) throw new Error(`Item não encontrado: ${movingId}`);

  const [movingBlock] = blocks.splice(fromIndex, 1);
  const { mode, id } = parseTarget(target);

  if (mode === "before" || mode === "after") {
    const targetIndex = blocks.findIndex((block) => getId(block) === id);
    if (targetIndex !== -1) {
      const insertIndex = mode === "before" ? targetIndex : targetIndex + 1;
      blocks.splice(insertIndex, 0, movingBlock);
      return blocks;
    }
  }

  blocks.push(movingBlock);
  return blocks;
}

function insertBlockIntoArray(content, markerText, block, target, field){
  const bounds = findArrayBounds(content, markerText);
  const blocks = parseTopLevelObjectBlocks(bounds.inner);
  insertBlockByTarget(blocks, block, target, (item) => extractFieldFromBlock(item, field));
  return replaceArrayInner(content, bounds, blocks);
}

function moveBlockInArray(content, markerText, movingId, target, field){
  const bounds = findArrayBounds(content, markerText);
  const blocks = parseTopLevelObjectBlocks(bounds.inner);
  moveBlockByTarget(blocks, movingId, target, (item) => extractFieldFromBlock(item, field));
  return replaceArrayInner(content, bounds, blocks);
}

function parseStringArray(content, markerText){
  const bounds = findArrayBounds(content, markerText);
  const slugs = [...bounds.inner.matchAll(/["']([^"']+)["']\s*,?/g)].map((match) => match[1]);
  return { bounds, slugs };
}

function replaceStringArray(content, markerText, slugs){
  const { bounds } = parseStringArray(content, markerText);
  const body = slugs.map((slug) => `  "${slug}",`).join("\n");
  return content.slice(0, bounds.open + 1) + "\n" + body + "\n" + content.slice(bounds.close);
}

function insertSlugByTarget(slugs, slug, target){
  const clean = String(slug || "").trim();
  if (!clean) throw new Error("Slug vazio.");
  const filtered = slugs.filter((item) => item !== clean);
  const { mode, id } = parseTarget(target);

  if (mode === "before" || mode === "after") {
    const index = filtered.indexOf(id);
    if (index !== -1) {
      filtered.splice(mode === "before" ? index : index + 1, 0, clean);
      return filtered;
    }
  }

  filtered.push(clean);
  return filtered;
}

function moveSlugByTarget(slugs, slug, target){
  if (!slugs.includes(slug)) throw new Error(`Slug não está no Featured Works: ${slug}`);
  return insertSlugByTarget(slugs, slug, target);
}

async function readOptional(filePath){
  try{
    return await fs.readFile(filePath, "utf8");
  }catch{
    return "";
  }
}

async function getSummary(){
  const trustedBy = await readOptional(paths.trustedBy);
  const projects = await readOptional(paths.projects);
  const workSection = await readOptional(paths.workSection);

  let testimonials = [];
  let projectItems = [];
  let featuredSlugs = [];

  if (trustedBy.includes("const testimonials")) {
    const bounds = findArrayBounds(trustedBy, "const testimonials");
    testimonials = parseTopLevelObjectBlocks(bounds.inner).map((block, index) => ({
      index,
      name: extractFieldFromBlock(block, "name"),
    })).filter((item) => item.name);
  }

  if (projects.includes("projects")) {
    const marker = projects.includes("export const projects") ? "export const projects" : "const projects";
    const bounds = findArrayBounds(projects, marker);
    projectItems = parseTopLevelObjectBlocks(bounds.inner).map((block, index) => ({
      index,
      slug: extractFieldFromBlock(block, "slug"),
      title: extractFieldFromBlock(block, "title"),
      artist: extractFieldFromBlock(block, "artist"),
    })).filter((item) => item.slug);
  }

  if (workSection.includes("featuredProjectSlugs")) {
    featuredSlugs = parseStringArray(workSection, "featuredProjectSlugs").slugs;
  }

  const featuredSet = new Set(featuredSlugs);
  projectItems = projectItems.map((project) => ({ ...project, featured: featuredSet.has(project.slug) }));
  const projectBySlug = new Map(projectItems.map((project) => [project.slug, project]));
  const featuredProjects = featuredSlugs.map((slug, index) => projectBySlug.get(slug) || { index, slug, title: slug, artist: "", featured: true });

  return {
    testimonials,
    projects: projectItems,
    featuredSlugs,
    featuredProjects,
  };
}

async function addTestimonial(data){
  const filePath = paths.trustedBy;
  let content = await fs.readFile(filePath, "utf8");

  const imageVar = camelFromFilename(data.imageFilename);
  const avatarClass = String(data.avatarClass || `${slugify(data.name)}-avatar`).trim();
  const initials = String(data.initials || initialsFromName(data.name)).trim();
  const importLine = `import ${imageVar} from "../assets/testimonials/${data.imageFilename}";\n`;

  if (!content.includes(importLine.trim())) {
    content = insertBeforeMarker(content, "\ntype SiteLanguage", importLine);
  }

  const objectBlock = `{
    name: ${jsString(data.name)},
    title: {
      en: ${jsString(data.titleEn)},
      pt: ${jsString(data.titlePt)},
      es: ${jsString(data.titleEs)},
    },
    location: ${jsString(data.location)},
    achievements: {
      en: ${jsString(withBreaks(data.achievementsEn))},
      pt: ${jsString(withBreaks(data.achievementsPt))},
      es: ${jsString(withBreaks(data.achievementsEs))},
    },
    workedWith: {
      en: ${jsString(withBreaks(data.workedWithEn))},
      pt: ${jsString(withBreaks(data.workedWithPt))},
      es: ${jsString(withBreaks(data.workedWithEs))},
    },
    image: ${imageVar},
    initials: ${jsString(initials)},
    avatarClass: ${jsString(avatarClass)},
    quote: {
      en: ${jsString(data.quoteEn)},
      pt: ${jsString(data.quotePt)},
      es: ${jsString(data.quoteEs)},
    },
  },`;

  await backupFile(filePath);
  content = insertBlockIntoArray(content, "const testimonials", objectBlock, data.position, "name");
  await fs.writeFile(filePath, content, "utf8");

  return `Depoimento adicionado em src/components/TrustedBy.astro\n\nFoto esperada: src/assets/testimonials/${data.imageFilename}\nClasse da foto: ${avatarClass}\n\nBackup criado automaticamente ao lado do arquivo.`;
}

async function moveTestimonial(data){
  const filePath = paths.trustedBy;
  let content = await fs.readFile(filePath, "utf8");
  await backupFile(filePath);
  content = moveBlockInArray(content, "const testimonials", data.name, data.target, "name");
  await fs.writeFile(filePath, content, "utf8");
  return `Depoimento reposicionado: ${data.name}\n\nBackup criado automaticamente.`;
}

async function addProject(data){
  const filePath = paths.projects;
  let content = await fs.readFile(filePath, "utf8");

  const imageVar = camelFromFilename(data.imageFilename).replace(/Photo$/, "");
  const importLine = `import ${imageVar} from "../assets/projects/${data.imageFilename}";\n`;

  if (!content.includes(importLine.trim())) {
    const marker = content.includes("export const projects") ? "\nexport const projects" : "\nconst projects";
    content = insertBeforeMarker(content, marker, importLine);
  }

  const credits = String(data.credits || "")
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const objectBlock = `{
    slug: ${jsString(data.slug)},
    collection: ${jsString(data.collection)},
    artist: ${jsString(data.artist)},
    title: ${jsString(data.title)},
    role: ${jsString(data.role)},
    highlight: ${jsString(data.highlight)},
    description: ${jsString(data.description)},
    credits: [${credits.map(jsString).join(", ")}],
    spotify: ${jsString(data.spotify)},
    youtube: ${jsString(data.youtube)},
    image: ${imageVar},
  },`;

  await backupFile(filePath);
  const marker = content.includes("export const projects") ? "export const projects" : "const projects";
  content = insertBlockIntoArray(content, marker, objectBlock, data.allPosition, "slug");
  await fs.writeFile(filePath, content, "utf8");

  let featuredMessage = "Esse projeto ficou apenas no All Works.";
  if (String(data.featuredHome || "") === "yes") {
    featuredMessage = await addFeatured({ slug: data.slug, target: data.featuredPosition });
  }

  return `Projeto adicionado em src/data/projects.ts\n\nCapa esperada: src/assets/projects/${data.imageFilename}\nVariável criada: ${imageVar}\n${featuredMessage}\n\nBackup criado automaticamente ao lado do arquivo.`;
}

async function moveProject(data){
  const filePath = paths.projects;
  let content = await fs.readFile(filePath, "utf8");
  await backupFile(filePath);
  const marker = content.includes("export const projects") ? "export const projects" : "const projects";
  content = moveBlockInArray(content, marker, data.slug, data.target, "slug");
  await fs.writeFile(filePath, content, "utf8");
  return `Projeto reposicionado no All Works: ${data.slug}\n\nBackup criado automaticamente.`;
}

async function addFeatured(data){
  const filePath = paths.workSection;
  let content = await fs.readFile(filePath, "utf8");
  const parsed = parseStringArray(content, "featuredProjectSlugs");
  const slugs = insertSlugByTarget(parsed.slugs, data.slug, data.target);
  await backupFile(filePath);
  content = replaceStringArray(content, "featuredProjectSlugs", slugs);
  await fs.writeFile(filePath, content, "utf8");
  return `Projeto adicionado ao Featured Works: ${data.slug}`;
}

async function removeFeatured(data){
  const filePath = paths.workSection;
  let content = await fs.readFile(filePath, "utf8");
  const parsed = parseStringArray(content, "featuredProjectSlugs");
  const slugs = parsed.slugs.filter((slug) => slug !== data.slug);
  await backupFile(filePath);
  content = replaceStringArray(content, "featuredProjectSlugs", slugs);
  await fs.writeFile(filePath, content, "utf8");
  return `Projeto removido do Featured Works: ${data.slug}\n\nEle continua no All Works.`;
}

async function moveFeatured(data){
  const filePath = paths.workSection;
  let content = await fs.readFile(filePath, "utf8");
  const parsed = parseStringArray(content, "featuredProjectSlugs");
  const slugs = moveSlugByTarget(parsed.slugs, data.slug, data.target);
  await backupFile(filePath);
  content = replaceStringArray(content, "featuredProjectSlugs", slugs);
  await fs.writeFile(filePath, content, "utf8");
  return `Featured Work reposicionado: ${data.slug}`;
}

const server = http.createServer(async (req, res) => {
  try{
    if (req.method === "GET" && req.url === "/") return sendHtml(res);

    if (req.method === "GET" && req.url === "/api/summary") {
      return sendJson(res, 200, await getSummary());
    }

    if (req.method === "POST" && req.url === "/api/add-testimonial") {
      const data = await readBody(req);
      const message = await addTestimonial(data);
      return sendJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/api/move-testimonial") {
      const data = await readBody(req);
      const message = await moveTestimonial(data);
      return sendJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/api/add-project") {
      const data = await readBody(req);
      const message = await addProject(data);
      return sendJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/api/move-project") {
      const data = await readBody(req);
      const message = await moveProject(data);
      return sendJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/api/featured/add") {
      const data = await readBody(req);
      const message = await addFeatured(data);
      return sendJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/api/featured/remove") {
      const data = await readBody(req);
      const message = await removeFeatured(data);
      return sendJson(res, 200, { ok: true, message });
    }

    if (req.method === "POST" && req.url === "/api/featured/move") {
      const data = await readBody(req);
      const message = await moveFeatured(data);
      return sendJson(res, 200, { ok: true, message });
    }

    sendJson(res, 404, { ok: false, message: "Página não encontrada." });
  }catch(error){
    sendJson(res, 500, { ok: false, message: error.stack || String(error) });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\nGabriel Content Admin aberto em: ${url}\n`);

  const platform = process.platform;
  const command = platform === "darwin" ? `open ${url}` : platform === "win32" ? `start ${url}` : `xdg-open ${url}`;
  exec(command, () => {});
});
