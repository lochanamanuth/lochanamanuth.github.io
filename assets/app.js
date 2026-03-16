// ===== Lochana Advanced Portfolio JS =====
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

$("#year").textContent = new Date().getFullYear();

// Mobile menu
const burger = $("#burger");
const mobile = $("#mobile");

function setMobile(open){
  mobile.style.display = open ? "block" : "none";
  burger.setAttribute("aria-expanded", open ? "true" : "false");
}
burger?.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") !== "true";
  setMobile(open);
});
$$(".mobile a").forEach(a => a.addEventListener("click", () => setMobile(false)));

// Smooth scroll
$$("a[href^='#']").forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if(!id || id === "#") return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:"smooth", block:"start"});
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if(en.isIntersecting){
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  });
}, {threshold: 0.12});

$$(".reveal").forEach(el => io.observe(el));

// Back to top
const toTop = $("#toTop");
window.addEventListener("scroll", () => {
  if(window.scrollY > 600) toTop.classList.add("show");
  else toTop.classList.remove("show");
});
toTop?.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

// Terminal
const out = $("#termOut");
const input = $("#termInput");
const copyBtn = $("#copyBtn");

const profile = {
  name: "Lochana Manuth Bandara",
  role: "Cybersecurity learner (Ethical Hacking / Pentesting)",
  location: "Sri Lanka",
  github: "https://github.com/lochanamanuth",
  linkedin: "https://www.linkedin.com/in/lochana-manuth/",
  project: "https://github.com/lochanamanuth/Mac-Changer"
};

// IMPORTANT: change to your real email address
const TO_EMAIL = "lochanamanuth@example.com";

let lastOutput = "";

// ===== Hidden CTF State =====
const ctfState = {
  scanned: false,
  opened: false,
  decoded: false,
  solved: false
};

const hiddenBase64 = "TE1Ce3Qzcm1pbmFsX2YwdW5kX21lfQ=="; // LMB{t3rminal_f0und_me}

const commands = {
  help: () => [
    "commands:",
    "  about       - short bio",
    "  socials     - links",
    "  certs       - proof links",
    "  project     - featured repo",
    "  whoami      - prints user",
    "  clear       - clear terminal",
    "  ls          - list files",
    "  pwd         - current path"
  ],

  about: () => [
    `${profile.name}`,
    `${profile.role}`,
    `Location: ${profile.location}`
  ],

  socials: () => [
    `GitHub:   ${profile.github}`,
    `LinkedIn: ${profile.linkedin}`
  ],

  certs: () => [
    "CAPT (image proof): https://lochanamanuth.github.io/capt.png",
    "TryHackMe Jr Pentester: https://tryhackme.com/certificate/THM-LNNO0RTYCD",
    "TryHackMe Pre Security: https://tryhackme.com/certificate/THM-EJOW3PHTFW",
    "TryHackMe Security Engineer: https://tryhackme.com/certificate/THM-SFJBVHLIRR",
    "Google Cybersecurity (Credly): https://www.credly.com/badges/c5694221-df8c-4027-8d52-868640303d68/linked_in_profile",
    "TryHackMe Cyber Security 101: https://tryhackme.com/certificate/THM-UAN9MQZSXZ"
  ],

  project: () => [
    "Mac-Changer (Python):",
    profile.project
  ],

  whoami: () => ["visitor"],

  pwd: () => ["/home/lochana/lab"],

  ls: () => [
    "notes.txt  projects/  certs/  .hidden"
  ],

  scan: () => {
    ctfState.scanned = true;
    return [
      "[scan] probing terminal...",
      "[scan] hidden object detected: .hidden/clue.txt",

    ];
  },

  cat: (args) => {
    const target = args.join(" ").trim();

    if (!target) {
      return ["cat: missing file name"];
    }

    if (target === "notes.txt") {
      return [
        "notes.txt:",
        "Keep learning. Keep building. Use ----> 01110011 01100011 01100001 01101110"
      ];
    }

    if (target === ".hidden/clue.txt") {
      ctfState.opened = true;
      return [
        "clue.txt:",
        "Nothing stays hidden forever.",
        "Decode this string:",
        hiddenBase64,
        "Try: decode <text>"
      ];
    }

    return [`cat: ${target}: No such file or directory`];
  },

  hint: () => [
    "CTF hint:",
    "1. run: scan",
    "2. run: cat .hidden/clue.txt",
    "3. run: decode <base64>",
    "4. run: unlock <flag>"
  ],

  decode: (args) => {
    const text = args.join(" ").trim();

    if (!text) {
      return ["decode: missing input"];
    }

    try {
      const result = atob(text);
      ctfState.decoded = true;
      return [
        `[decoded] ${result}`,
        "Now use: unlock <decoded_flag>"
      ];
    } catch {
      return ["decode: invalid base64 text"];
    }
  },

  unlock: (args) => {
    const guess = args.join(" ").trim();

    if (guess === "LMB{t3rminal_f0und_me}") {
      ctfState.solved = true;
      return [
        "✅ CTF completed",
        "Flag accepted: LMB{t3rminal_f0und_me}",
        "Nice work — you found the hidden terminal flag."
      ];
    }

    return ["❌ Invalid flag"];
  },

  clear: () => "__CLEAR__"
};

function line(text, cls="term-ans"){
  const p = document.createElement("p");
  p.className = `term-line ${cls}`;
  p.textContent = text;
  out.appendChild(p);
  out.scrollTop = out.scrollHeight;
  lastOutput = text;
}

function cmdLine(cmd){
  const p = document.createElement("p");
  p.className = "term-line term-cmd";
  p.textContent = `lochana@lab:~$ ${cmd}`;
  out.appendChild(p);
  out.scrollTop = out.scrollHeight;
}

function boot(){
  line("Welcome. Type 'help' to explore.");
  line("—");
  input?.focus();
}
boot();

function run(raw){
  const cmd = raw.trim();
  if(!cmd) return;

  cmdLine(cmd);

  const parts = cmd.split(" ");
  const key = parts[0].toLowerCase();
  const args = parts.slice(1);

  const fn = commands[key];

  if(!fn){
    line(`command not found: ${key} (try: help)`);
    return;
  }

  const res = fn(args);

  if(res === "__CLEAR__"){
    out.innerHTML = "";
    lastOutput = "";
    return;
  }

  res.forEach(t => line(t));
}

input?.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    const v = input.value;
    input.value = "";
    run(v);
  }
});

// Focus terminal input only when clicking inside terminal (avoid page jumping to top)
const term = document.querySelector(".terminal");
term?.addEventListener("click", () => {
  try{
    input?.focus({preventScroll:true});
  }catch{
    input?.focus();
  }
});

copyBtn?.addEventListener("click", async () => {
  if(!lastOutput) return;
  try{
    await navigator.clipboard.writeText(lastOutput);
    copyBtn.textContent = "Copied";
    setTimeout(() => copyBtn.textContent = "Copy", 1000);
  }catch{
    copyBtn.textContent = "Failed";
    setTimeout(() => copyBtn.textContent = "Copy", 1000);
  }
});

// Contact form mailto
const form = $("#contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

  window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
});

// Project filters (v2)
const fbtns = $$(".fbtn");
const grid = $("#projectGrid");
function setFilter(tag){
  fbtns.forEach(b => b.classList.toggle("is-on", b.dataset.filter === tag));
  const cards = $$("[data-tags]", grid);
  cards.forEach(card => {
    const tags = (card.getAttribute("data-tags") || "").split(",").map(s=>s.trim()).filter(Boolean);
    const show = tag === "all" ? true : tags.includes(tag);
    card.style.display = show ? "" : "none";
  });
}
fbtns.forEach(b => b.addEventListener("click", () => setFilter(b.dataset.filter || "all")));
setFilter("all");

/* CERTIFICATION FILTER */
const certBtns = document.querySelectorAll("[data-cert]");
const certCards = document.querySelectorAll("[data-certcat]");

certBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    certBtns.forEach(b => b.classList.remove("is-on"));
    btn.classList.add("is-on");

    const filter = btn.dataset.cert;

    certCards.forEach(card => {
      if (filter === "all" || card.dataset.certcat === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
