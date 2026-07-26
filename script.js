// ============================================================
// KTECH WIFI — interactions du site
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Ferme le menu quand on clique un lien
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Onglets (Résidentiel/Pro, Favorable/Prudent...) ---------- */
  // Générique : chaque bouton .tab-btn affiche le panneau désigné par data-target
  // et cache les autres panneaux du même groupe (déterminés par leur parent commun).
  document.querySelectorAll('.pricing-tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const targetIds = Array.from(buttons).map(b => b.dataset.target);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        targetIds.forEach(id => {
          const panel = document.getElementById(id);
          if (panel) panel.hidden = id !== btn.dataset.target;
        });
      });
    });
  });

  /* ---------- Révélation au défilement ---------- */
  const revealTargets = document.querySelectorAll(
    '.section h2, .flow-step, .price-card, .why-card, .road-item, .gap-visual, .gap-copy'
  );
  revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Formulaire de contact -> WhatsApp ---------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('f-name').value.trim();
      const avenue = document.getElementById('f-avenue').value.trim();
      const profil = document.getElementById('f-profil').value;

      const message =
        `Bonjour KTech WiFi, je m'appelle ${name}. ` +
        `Je suis ${profil.toLowerCase()} sur ${avenue} et je souhaite être informé(e) du lancement.`;

      const whatsappUrl = `https://wa.me/243852062070?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
    });
  }

  /* ---------- Mise en avant du lien de nav actif au scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('is-current', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Cadenas d'accès (page investisseurs uniquement) ---------- */
  // Ce bloc n'existe pas dans index.html : les variables restent "null" sur la page
  // publique, donc le "if" ci-dessous est simplement ignoré sur cette page-là.
  const gate = document.getElementById('gate');
  const doc = document.getElementById('doc');
  const gateSubmit = document.getElementById('gate-submit');
  const gateInput = document.getElementById('gate-code');
  const gateError = document.getElementById('gate-error');

  if (gate && doc && gateSubmit && gateInput) {
    // ⚠️ LISTE DES INVITATIONS ⚠️
    // Un code = une personne invitée. Ajoute une ligne par investisseur à qui tu
    // veux donner accès. C'est TOI qui choisis le code et qui l'envoies toi-même
    // (WhatsApp, email...) — le site ne l'envoie pas automatiquement, il vérifie
    // juste que le code saisi existe dans cette liste.
    // Pour révoquer l'accès de quelqu'un : supprime simplement sa ligne.
    const INVITATIONS = {
      'ktech-demo':     'Visiteur de démonstration',
      // 'code-a-toi':  'Nom de l\'investisseur',
    };

    // Rappel sécurité : ces codes sont visibles par quiconque ouvre ce fichier
    // (script.js) — c'est un frein contre le partage accidentel du lien, pas un
    // vrai coffre-fort. Ne mets jamais d'informations réellement sensibles
    // (mots de passe bancaires, etc.) derrière ce type de protection.
    const gateWelcome = document.getElementById('gate-welcome');

    const tryUnlock = () => {
      const code = gateInput.value.trim();
      const invitedName = INVITATIONS[code];

      if (invitedName) {
        gate.hidden = true;
        doc.hidden = false;
        if (gateWelcome) {
          gateWelcome.textContent = `Accès accordé à ${invitedName}.`;
          gateWelcome.hidden = false;
        }
      } else {
        gateError.hidden = false;
        gateInput.value = '';
        gateInput.focus();
      }
    };

    gateSubmit.addEventListener('click', tryUnlock);
    gateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
    });
  }

});
