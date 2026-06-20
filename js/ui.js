/*
 * Small, dependency-free UI components: a searchable combobox and a segmented
 * control. Both return a tiny API ({ setValue, getValue }) and call onChange.
 */

/* ── helpers ─────────────────────────────────────────────────────────────── */
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

/* ── Searchable select ───────────────────────────────────────────────────── */
/**
 * @param {HTMLElement} mount  container with class .select
 * @param {object} cfg
 *   items: any[]                       data array
 *   getLabel: (item) => string         main text
 *   getMeta:  (item) => string|null    right-aligned subtext (optional)
 *   getKey:   (item) => string         unique key
 *   searchText: (item) => string       text to match against (defaults to label)
 *   placeholder: string
 *   onChange: (item) => void
 */
function createSearchableSelect(mount, cfg) {
  const { items, getLabel, getKey, onChange } = cfg;
  const getMeta = cfg.getMeta || (() => null);
  const searchText = cfg.searchText || getLabel;
  const placeholder = cfg.placeholder || "Search…";

  let selected = null;
  let activeIndex = -1;
  let filtered = items.slice();

  const trigger = el("button", "select-trigger");
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  const valueSpan = el("span", "select-value");
  const chevron = el("span", "select-chevron");
  chevron.innerHTML =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  trigger.append(valueSpan, chevron);

  const menu = el("div", "select-menu");
  const search = el("input", "select-search");
  search.type = "text";
  search.placeholder = placeholder;
  search.setAttribute("aria-label", placeholder);
  const optionsBox = el("div", "select-options");
  optionsBox.setAttribute("role", "listbox");
  menu.append(search, optionsBox);

  mount.append(trigger, menu);

  function renderValue() {
    if (!selected) {
      valueSpan.innerHTML = `<span style="color:var(--text-faint)">${placeholder}</span>`;
      return;
    }
    const meta = getMeta(selected);
    valueSpan.innerHTML =
      escapeHtml(getLabel(selected)) + (meta ? ` <span class="sv-sub">${escapeHtml(meta)}</span>` : "");
  }

  function renderOptions() {
    optionsBox.innerHTML = "";
    if (filtered.length === 0) {
      optionsBox.append(el("div", "option-empty", "No matches"));
      return;
    }
    filtered.forEach((item, i) => {
      const opt = el("div", "option");
      opt.setAttribute("role", "option");
      const meta = getMeta(item);
      opt.innerHTML =
        `<span class="opt-label">${escapeHtml(getLabel(item))}</span>` +
        (meta ? `<span class="opt-meta">${escapeHtml(meta)}</span>` : "");
      if (selected && getKey(item) === getKey(selected)) opt.classList.add("selected");
      if (i === activeIndex) opt.classList.add("active");
      opt.addEventListener("mouseenter", () => {
        activeIndex = i;
        highlight();
      });
      opt.addEventListener("click", () => choose(item));
      optionsBox.append(opt);
    });
  }

  function highlight() {
    [...optionsBox.children].forEach((c, i) => c.classList.toggle("active", i === activeIndex));
    const active = optionsBox.children[activeIndex];
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
  }

  function open() {
    mount.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
    search.value = "";
    filtered = items.slice();
    activeIndex = filtered.findIndex((it) => selected && getKey(it) === getKey(selected));
    renderOptions();
    highlight();
    setTimeout(() => search.focus(), 0);
    document.addEventListener("mousedown", onDocClick);
  }
  function close() {
    mount.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("mousedown", onDocClick);
  }
  function toggle() {
    mount.classList.contains("open") ? close() : open();
  }
  function onDocClick(e) {
    if (!mount.contains(e.target)) close();
  }

  function choose(item) {
    selected = item;
    renderValue();
    close();
    onChange(item);
  }

  function filter() {
    const q = search.value.trim().toLowerCase();
    filtered = q
      ? items.filter((it) => searchText(it).toLowerCase().includes(q))
      : items.slice();
    activeIndex = filtered.length ? 0 : -1;
    renderOptions();
  }

  trigger.addEventListener("click", toggle);
  search.addEventListener("input", filter);
  search.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      highlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      highlight();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) choose(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      close();
      trigger.focus();
    }
  });

  renderValue();

  return {
    setValue(item) {
      selected = item;
      renderValue();
    },
    getValue() {
      return selected;
    },
  };
}

/* ── Segmented control ───────────────────────────────────────────────────── */
/**
 * @param {HTMLElement} mount  container with class .segmented
 * @param {object} cfg  { options: {label,value}[], value, onChange }
 */
function createSegmented(mount, cfg) {
  let current = cfg.value;
  const buttons = new Map();

  cfg.options.forEach((opt) => {
    const btn = el("button", "seg-btn", escapeHtml(opt.label));
    btn.type = "button";
    btn.addEventListener("click", () => {
      if (current === opt.value) return;
      current = opt.value;
      sync();
      cfg.onChange(opt.value);
    });
    buttons.set(opt.value, btn);
    mount.append(btn);
  });

  function sync() {
    buttons.forEach((btn, val) => btn.classList.toggle("active", val === current));
  }
  sync();

  return {
    setValue(val) {
      current = val;
      sync();
    },
    getValue() {
      return current;
    },
  };
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
