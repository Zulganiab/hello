/**
 * AETHERPEDIA — app.js
 *
 * Modules (namespaced on Wiki):
 *   Wiki.data     — categories + articles data
 *   Wiki.render   — DOM rendering helpers
 *   Wiki.search   — search logic
 *   Wiki.nav      — view routing
 *   Wiki.tabs     — tab switching
 *   Wiki.motion   — IntersectionObserver scroll reveals
 *   Wiki.init     — bootstrap
 */

'use strict';

const Wiki = {};

/* ============================================================
   Wiki.data — Content Model
   ============================================================ */
Wiki.data = (() => {

  const categories = [
    {
      id: 'lore',
      label: 'Lore',
      color: '#3b82f6',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
      articleCount: 14
    },
    {
      id: 'characters',
      label: 'Characters',
      color: '#8b5cf6',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      articleCount: 22
    },
    {
      id: 'factions',
      label: 'Factions',
      color: '#ef4444',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      articleCount: 8
    },
    {
      id: 'magic',
      label: 'Magic Systems',
      color: '#06b6d4',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      articleCount: 11
    },
    {
      id: 'world',
      label: 'World',
      color: '#22c55e',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      articleCount: 17
    },
    {
      id: 'history',
      label: 'History',
      color: '#f59e0b',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      articleCount: 9
    },
    {
      id: 'artifacts',
      label: 'Artifacts',
      color: '#ec4899',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      articleCount: 6
    },
    {
      id: 'creatures',
      label: 'Creatures',
      color: '#f97316',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
      articleCount: 13
    }
  ];

  const articles = [
    // === LORE ===
    {
      id: 'dragon-lore-origins',
      title: 'Dragon Lore: Origins & Taxonomy',
      slug: 'dragon-lore-origins',
      category: 'lore',
      tags: ['dragons', 'lore', 'world-building', 'taxonomy'],
      excerpt: 'An in-depth exploration of dragon mythology within the Aetherverse, tracing origins from the First Flame to modern-day sightings in the Ashveil Mountains.',
      body: `
        <h2>Origins of Dragon-Kind</h2>
        <p>Dragons in the Aetherverse did not evolve through natural selection as most fauna did. According to the <em>Codex Draconis</em>, they were <strong>forged during the Age of Embers</strong> — a cataclysmic period roughly 12,000 years before the current era when the Aether itself was still malleable.</p>
        <p>The First Flame, a primordial elemental force that predates even the Elder Gods, supposedly breathed sentience into vast serpentine beasts drawn from volcanic rock and celestial fire. Whether this is mythology or literal history remains a subject of fierce academic debate in the Academy of Aetheric Studies.</p>

        <h2>Taxonomic Classification</h2>
        <p>Modern draconic scholars have categorized dragons into four primary lineages:</p>
        <ul>
          <li><strong>Vyreth (Void Dragons)</strong> — The oldest and rarest, these creatures exist partially outside of physical reality. They are capable of dimensional phasing.</li>
          <li><strong>Kaeldrath (Flame Dragons)</strong> — The most numerous lineage, occupying volcanic mountain ranges across the known world.</li>
          <li><strong>Silvarath (Storm Dragons)</strong> — Sea-faring and atmospheric, often mistaken for weather phenomena.</li>
          <li><strong>Lunrath (Shadow Dragons)</strong> — Nocturnal, rarely seen, believed to be the agents of the Veilbreaker faction.</li>
        </ul>

        <h2>Behavioral Patterns</h2>
        <p>Unlike the fire-breathing menaces of lesser mythologies, Aetherverse dragons are depicted as <strong>highly intelligent, long-lived political entities</strong>. They form loose councils called <em>Dratheks</em>, maintain hoards not purely for greed but as cultural archives, and have been known to enter into centuries-long negotiations with human kingdoms.</p>

        <blockquote>
          "To insult a dragon is not merely to court death. It is to erase your entire bloodline from their memory — which to them is a far greater punishment."
          — Archivist Sorwen Vael, Third Codex
        </blockquote>

        <h2>Known Individual Dragons</h2>
        <p>The most well-documented individuals include <strong>Vaerath the Unburnt</strong>, a Vyreth who allegedly participated in the signing of the Concordat of Ashes, and <strong>Igreth the Twice-Dead</strong>, a Kaeldrath whose two confirmed deaths and subsequent resurrections have never been satisfactorily explained by Aetheric scholars.</p>

        <h3>The Dragon Accord</h3>
        <p>Following the catastrophic Dragon-Wars of the Third Age, all major civilizations and surviving dragon councils signed the Accord of Ashenmere. Under this agreement, dragons ceded certain territorial rights in exchange for legal personhood and diplomatic status. The Accord remains in force today, though several of its clauses are considered deeply controversial.</p>
      `,
      author: 'Archivist Vale',
      authorInitials: 'AV',
      date: '2026-03-08',
      thumbnail: 'assets/thumb-dragons.jpg',
      featured: true,
      trending: true,
      isNew: false,
      relatedIds: ['magic-system-aether', 'ancient-wars-third-age', 'vyreth-taxonomy']
    },

    // === MAGIC ===
    {
      id: 'magic-system-aether',
      title: 'The Aetheric Magic System: A Primer',
      slug: 'magic-system-aether',
      category: 'magic',
      tags: ['magic', 'aether', 'spellcraft', 'primer'],
      excerpt: 'The foundational guide to how Aetheric magic functions — from sourcing raw Aether energy to the six schools of spellcraft that have shaped civilization for millennia.',
      body: `
        <h2>What Is Aether?</h2>
        <p>Aether is the invisible substrate of reality in the Aetherverse — a pervasive energetic medium that underlies all physical matter and can be manipulated by trained practitioners called <em>Aethermancers</em>. Think of it as a second layer of physics running beneath the first.</p>

        <p>Unlike electricity or magnetism, Aether is <strong>responsive to intent</strong>. Raw will, focused through years of mental conditioning, can bend Aether into structured forms capable of producing dramatic physical effects. This is why Aethermancy is as much a philosophical discipline as it is a technical one.</p>

        <h2>The Six Schools</h2>
        <ul>
          <li><strong>Kinetics</strong> — force, movement, gravity manipulation</li>
          <li><strong>Thermal</strong> — heat, cold, and energetic transfer</li>
          <li><strong>Cognomancy</strong> — memory, illusion, mental influence</li>
          <li><strong>Voidspeaking</strong> — dimensional space, portals, banishment</li>
          <li><strong>Chronoweave</strong> — temporal perception and minor timeline nudging (restricted)</li>
          <li><strong>Lifeshaping</strong> — biological alteration and healing</li>
        </ul>

        <h2>The Cost of Magic</h2>
        <p>Aethermancy is not without cost. Every working drains from the practitioner's own <em>Aetheric Reserve</em> — a personal pool of energy that refills through sleep, meditation, and certain alchemical substances. Overextension results in <strong>Aether-burn</strong>, a painful condition that can temporarily or permanently damage one's ability to channel.</p>

        <blockquote>
          "The universe does not give power for free. Every spell is a negotiation. Every casting is a debt."
          — Grand Archivist Thessaly Norn
        </blockquote>
      `,
      author: 'Scholar Mira',
      authorInitials: 'SM',
      date: '2026-03-12',
      thumbnail: 'assets/thumb-magic.jpg',
      featured: true,
      trending: false,
      isNew: false,
      relatedIds: ['dragon-lore-origins', 'faction-veilbreakers', 'cognomancy-deep-dive']
    },

    // === CHARACTERS ===
    {
      id: 'character-elara-voss',
      title: 'Elara Voss — The Last Voidwalker',
      slug: 'character-elara-voss',
      category: 'characters',
      tags: ['characters', 'voidwalker', 'protagonist', 'elara'],
      excerpt: 'Elara Voss is the sole surviving practitioner of Voidwalking — a forbidden branch of Voidspeaking magic. Her story spans three ages and two continents.',
      body: `
        <h2>Early Life</h2>
        <p>Born in the coastal city of Varanthos in the year 1187 of the Third Reckoning, Elara Voss showed early aptitude for Aetheric manipulation. By age twelve she had already surpassed her tutors at the local Aetheric Circle, and by sixteen she had been offered a scholarship to the Grand Academy of Solveth.</p>

        <h2>Discovery of Voidwalking</h2>
        <p>During her third year at the Academy, Elara discovered an annex of the restricted library containing texts on <strong>Voidwalking</strong> — the ability to physically traverse dimensional space rather than merely open portals through it. The practice had been banned by the Accord of Seven Towers following a catastrophic incident 200 years prior.</p>

        <p>Elara's subsequent mastery of this forbidden art triggered a chain of events that would bring her into direct conflict with both the Academy Council and the mysterious organization known as the <em>Eclipticists</em>.</p>

        <h2>Known Abilities</h2>
        <ul>
          <li><strong>Voidwalking</strong> — physical traversal of dimensional rifts</li>
          <li><strong>Advanced Voidspeaking</strong> — portal creation and spatial manipulation</li>
          <li><strong>Partial Kinetics</strong> — basic force projection (self-taught)</li>
          <li><strong>Dimensional Perception</strong> — the ability to sense nearby rifts and instabilities</li>
        </ul>

        <blockquote>
          "They told me the Void was empty. They were wrong. It remembers everything."
          — Elara Voss, recorded statement to the Academy Tribunal
        </blockquote>
      `,
      author: 'Lore Team',
      authorInitials: 'LT',
      date: '2026-03-15',
      thumbnail: 'assets/thumb-characters.jpg',
      featured: true,
      trending: true,
      isNew: false,
      relatedIds: ['magic-system-aether', 'faction-eclipticists', 'academy-of-solveth']
    },

    // === FACTIONS ===
    {
      id: 'faction-veilbreakers',
      title: 'The Veilbreakers — Faction Overview',
      slug: 'faction-veilbreakers',
      category: 'factions',
      tags: ['factions', 'veilbreakers', 'antagonists', 'void'],
      excerpt: 'The Veilbreakers are a clandestine organization dedicated to tearing down the Accord of Ashenmere and restoring the world to a state of primal Aetheric chaos.',
      body: `
        <h2>History and Formation</h2>
        <p>The Veilbreakers trace their ideological lineage back to the <strong>Chaosborn Philosophers</strong> of the Second Age — a school of thought that held the current "ordered" world to be an artificial cage imposed by the Accord-signers upon a naturally chaotic universe.</p>

        <p>The organization itself was formally established approximately 80 years ago by a rogue Aethermancer known only as <em>The Unwritten</em>, whose true identity has never been confirmed. Working from deep within the Ashveil Mountains, The Unwritten recruited disillusioned scholars, exiled nobles, and awakened creatures who felt wronged by the current power structure.</p>

        <h2>Organizational Structure</h2>
        <p>The Veilbreakers operate in a cell-based hierarchy to prevent full organizational exposure. Known ranks include:</p>
        <ul>
          <li><strong>Whispers</strong> — ground-level agents, often unaware of the full picture</li>
          <li><strong>Fractures</strong> — mid-level operatives with direct mission authority</li>
          <li><strong>Severances</strong> — the inner circle, believed to number fewer than twelve</li>
          <li><strong>The Unwritten</strong> — supreme leadership (identity unknown)</li>
        </ul>

        <h2>Goals and Methods</h2>
        <p>The Veilbreakers seek to shatter the <em>Veil</em> — the dimensional barrier separating the physical world from the Void. They believe this would usher in an age of pure Aetheric potential, though critics argue it would simply destroy all organized civilization.</p>
      `,
      author: 'Historian Devran',
      authorInitials: 'HD',
      date: '2026-02-28',
      thumbnail: 'assets/thumb-factions.jpg',
      featured: false,
      trending: true,
      isNew: false,
      relatedIds: ['dragon-lore-origins', 'magic-system-aether', 'ancient-wars-third-age']
    },

    // === WORLD ===
    {
      id: 'world-geography-overview',
      title: 'World Geography: The Known Territories',
      slug: 'world-geography-overview',
      category: 'world',
      tags: ['world', 'geography', 'territories', 'map'],
      excerpt: 'A comprehensive overview of the Known Territories — from the frozen Skuldric Reaches in the north to the volcanic Embersea Archipelago in the equatorial south.',
      body: `
        <h2>The Known Territories</h2>
        <p>The world of the Aetherverse spans six major landmasses collectively referred to as the <strong>Known Territories</strong>. Beyond these lie the <em>Uncharted Reaches</em> — regions where Aetheric interference makes stable navigation impossible.</p>

        <h2>Major Regions</h2>
        <ul>
          <li><strong>Varanthos Expanse</strong> — The largest settled landmass; home to the major human civilizations and the Grand Academy of Solveth.</li>
          <li><strong>Skuldric Reaches</strong> — Frozen northern continent, sparsely inhabited by the hardy Skuldric clans and several cold-adapted dragon lineages.</li>
          <li><strong>Ashveil Mountains</strong> — A volcanic mountain chain that runs across the eastern edge of Varanthos, home to Kaeldrath dragons and the Veilbreaker strongholds.</li>
          <li><strong>The Verdant Shelf</strong> — A massive continental shelf of living forest, home to the Sylvaran people and some of the oldest Aetheric ley lines in existence.</li>
          <li><strong>Embersea Archipelago</strong> — Equatorial island chain, politically neutral and known for its powerful merchant guilds.</li>
          <li><strong>Voidlands</strong> — A region of dimensional instability in the far west, accessible only to skilled Voidspeakers.</li>
        </ul>
      `,
      author: 'Cartographer Issen',
      authorInitials: 'CI',
      date: '2026-03-01',
      thumbnail: 'assets/thumb-world.jpg',
      featured: false,
      trending: false,
      isNew: true,
      relatedIds: ['dragon-lore-origins', 'faction-veilbreakers', 'ancient-wars-third-age']
    },

    // === HISTORY ===
    {
      id: 'ancient-wars-third-age',
      title: 'The Dragon-Wars of the Third Age',
      slug: 'ancient-wars-third-age',
      category: 'history',
      tags: ['history', 'dragon-wars', 'third-age', 'accord'],
      excerpt: 'The most devastating conflict in recorded history, the Dragon-Wars reshaped geopolitics and led directly to the Accord of Ashenmere that governs relations to this day.',
      body: `
        <h2>Causes</h2>
        <p>The Dragon-Wars began not with a single event but with decades of accumulated tension following the <strong>Enclosure Acts of 1102</strong>, in which human kingdoms dramatically expanded their territorial claims into traditionally dragon-held mountain ranges. Dragon councils viewed this as a fundamental violation of ancestral agreements, while human leaders claimed no formal agreement had ever been codified.</p>

        <h2>Major Phases</h2>
        <p>Scholars divide the Dragon-Wars into three distinct phases spanning 47 years:</p>
        <ul>
          <li><strong>The Burning Season (Years 1–8)</strong> — Initial open conflict; dragon raids on eastern cities, human scorched-earth campaigns in mountain passes.</li>
          <li><strong>The Cold War (Years 9–33)</strong> — Proxy conflicts, assassinations, and Aetheric weapons development by both sides.</li>
          <li><strong>The Final Reckoning (Years 34–47)</strong> — A catastrophic escalation involving Void weapons that nearly destroyed both sides, leading to negotiations.</li>
        </ul>

        <h2>The Accord of Ashenmere</h2>
        <p>Negotiated over three years at the neutral site of Ashenmere Lake, the Accord established the legal framework that still governs dragon-human relations. Key provisions included territorial demarcation, dragon personhood, mutual non-aggression clauses, and the joint prohibition of certain Aetheric weapons.</p>

        <blockquote>
          "We did not end the war because we won it. We ended it because continuing it would have meant winning a world worth nothing."
          — Lord-Diplomat Caeran Holt, speaking at Ashenmere
        </blockquote>
      `,
      author: 'Historian Devran',
      authorInitials: 'HD',
      date: '2026-02-20',
      thumbnail: 'assets/thumb-history.jpg',
      featured: false,
      trending: true,
      isNew: false,
      relatedIds: ['dragon-lore-origins', 'faction-veilbreakers', 'world-geography-overview']
    },

    // === ARTIFACTS ===
    {
      id: 'artifact-shardveil',
      title: 'The Shardveil — Artifact Profile',
      slug: 'artifact-shardveil',
      category: 'artifacts',
      tags: ['artifacts', 'shardveil', 'void', 'legendary'],
      excerpt: 'A fragment of crystallized Void energy the size of a human fist, the Shardveil is believed to be a direct remnant of the original Veil between dimensions.',
      body: `
        <h2>Description</h2>
        <p>The Shardveil appears as an irregular crystal approximately 12 centimeters in its longest dimension, its interior containing what appears to be a captured void-rift — a swirling dark energy visible through translucent purple-black crystal. It radiates a faint but measurable Aetheric signature detectable up to half a kilometer away by trained Voidspeakers.</p>

        <h2>Documented History</h2>
        <p>The earliest confirmed record of the Shardveil dates to the Final Reckoning phase of the Dragon-Wars, when it was reportedly recovered from the ruins of the destroyed Voidgate at Ossember Crossing. Its subsequent custody passed through at least seven different parties over the following 200 years.</p>

        <p>The artifact is currently listed as <strong>missing</strong> from the Grand Academy vaults, last confirmed present in 2018 of the current reckoning. There is significant concern in both academic and political circles that the Veilbreakers may have acquired it.</p>

        <h2>Known Properties</h2>
        <ul>
          <li>Amplifies Voidspeaking ability of anyone holding it by an estimated 300–400%</li>
          <li>Cannot be destroyed by conventional or Aetheric means</li>
          <li>Extended contact appears to erode the boundary between the holder's Aetheric Reserve and the Void itself</li>
          <li>Has reportedly spoken to at least two of its previous holders</li>
        </ul>
      `,
      author: 'Curator Thessaly',
      authorInitials: 'CT',
      date: '2026-03-18',
      thumbnail: 'assets/thumb-artifacts.jpg',
      featured: true,
      trending: false,
      isNew: true,
      relatedIds: ['magic-system-aether', 'faction-veilbreakers', 'character-elara-voss']
    },

    // === CREATURES ===
    {
      id: 'creature-voidwyrm',
      title: 'Voidwyrms — Bestiary Entry',
      slug: 'creature-voidwyrm',
      category: 'creatures',
      tags: ['creatures', 'voidwyrm', 'bestiary', 'void'],
      excerpt: 'Voidwyrms are serpentine entities that exist partially within and partially outside of physical reality. They are among the most feared creatures in the Aetherverse.',
      body: `
        <h2>Classification</h2>
        <p>Voidwyrms occupy a taxonomic category unique to Aetherverse biology: <em>Extradimensional Fauna</em>. Unlike most creatures that evolved within the physical plane, Voidwyrms appear to have originated in the Void itself, with physical-plane manifestations representing a partial crossing rather than full materialization.</p>

        <h2>Physical Description</h2>
        <p>Physical-plane manifestations of Voidwyrms typically appear as <strong>elongated, eel-like creatures</strong> between 3–8 meters in length, with a body composed of what appears to be crystallized shadow. They phase in and out of visibility, moving partly through dimensional space. Their only consistently visible feature is a pair of pale luminescent eyes.</p>

        <h2>Behavior and Threat Assessment</h2>
        <p>Voidwyrms are instinctively drawn to high concentrations of Aetheric energy — which unfortunately includes populated areas and Aethermancers. They are not malicious by design but cause significant destruction due to their dimensional phasing ability, which allows them to pass through physical barriers.</p>

        <p>The Academy of Solveth rates Voidwyrm encounters at <strong>Threat Level 4 out of 5</strong>, with Void-sensitive combat teams recommended for engagement. Standard weapons have approximately 15% efficacy. Voidspeaking-based containment fields are the most reliable suppression method.</p>
      `,
      author: 'Bestiarist Kavan',
      authorInitials: 'BK',
      date: '2026-03-20',
      thumbnail: 'assets/thumb-creatures.jpg',
      featured: false,
      trending: false,
      isNew: true,
      relatedIds: ['dragon-lore-origins', 'magic-system-aether', 'artifact-shardveil']
    }
  ];

  const recentActivity = [
    { title: 'Dragon Lore: Origins & Taxonomy', action: 'edited', author: 'Archivist Vale', time: '2 hours ago' },
    { title: 'The Shardveil — Artifact Profile', action: 'created', author: 'Curator Thessaly', time: '5 hours ago' },
    { title: 'Elara Voss — The Last Voidwalker', action: 'expanded', author: 'Lore Team', time: '1 day ago' },
    { title: 'Voidwyrms — Bestiary Entry', action: 'created', author: 'Bestiarist Kavan', time: '2 days ago' },
    { title: 'World Geography: The Known Territories', action: 'updated', author: 'Cartographer Issen', time: '2 days ago' },
  ];

  function getById(id) {
    return articles.find(a => a.id === id) || null;
  }

  function getByCategory(catId) {
    return articles.filter(a => a.category === catId);
  }

  function getFeatured() {
    return articles.filter(a => a.featured);
  }

  function getTrending() {
    return articles.filter(a => a.trending);
  }

  function getNew() {
    return articles.filter(a => a.isNew);
  }

  function getCategoryById(id) {
    return categories.find(c => c.id === id) || null;
  }

  function searchArticles(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return articles.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );
  }

  return { categories, articles, recentActivity, getById, getByCategory, getFeatured, getTrending, getNew, getCategoryById, searchArticles };
})();


/* ============================================================
   Wiki.render — DOM Rendering Helpers
   ============================================================ */
Wiki.render = (() => {

  function categoryBadge(catId) {
    const cat = Wiki.data.getCategoryById(catId);
    const label = cat ? cat.label : catId;
    return `<span class="badge badge--${catId}" aria-label="Category: ${label}">${label}</span>`;
  }

  function articleCard(article) {
    const cat = Wiki.data.getCategoryById(article.category);
    const color = cat ? cat.color : '#6b7280';
    return `
      <article
        class="article-card"
        tabindex="0"
        role="button"
        aria-label="Read article: ${article.title}"
        data-article-id="${article.id}"
      >
        <div class="card-thumb">
          <img
            src="${article.thumbnail}"
            alt="${article.title} thumbnail"
            loading="lazy"
          />
        </div>
        <div class="card-body">
          <div class="card-meta">
            ${categoryBadge(article.category)}
            <span class="card-date">${formatDate(article.date)}</span>
          </div>
          <h3 class="card-title">${article.title}</h3>
          <p class="card-excerpt">${article.excerpt}</p>
          <div class="card-footer">
            <span class="card-author">
              <span class="avatar" aria-hidden="true">${article.authorInitials}</span>
              ${article.author}
            </span>
          </div>
        </div>
      </article>
    `;
  }

  function categoryTile(cat) {
    const r = hexToRgb(cat.color);
    return `
      <button
        class="category-tile"
        data-category-id="${cat.id}"
        aria-label="Browse ${cat.label} — ${cat.articleCount} articles"
        style="
          --tile-glow: radial-gradient(ellipse at 0% 0%, rgba(${r},0.08) 0%, transparent 70%);
          --tile-icon-bg: rgba(${r},0.12);
        "
      >
        <span class="category-tile__icon" style="color:${cat.color}" aria-hidden="true">
          ${cat.iconSvg}
        </span>
        <span class="category-tile__name">${cat.label}</span>
        <span class="category-tile__count">${cat.articleCount} articles</span>
      </button>
    `;
  }

  function trendingItem(article, index) {
    return `
      <li
        class="trending-item"
        tabindex="0"
        role="button"
        aria-label="Read trending article: ${article.title}"
        data-article-id="${article.id}"
      >
        <span class="trending-rank" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <div class="trending-info">
          <span class="trending-title">${article.title}</span>
          <span class="trending-meta">${Wiki.data.getCategoryById(article.category)?.label || article.category} &middot; ${formatDate(article.date)}</span>
        </div>
        <img
          class="trending-thumb"
          src="${article.thumbnail}"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
      </li>
    `;
  }

  function recentItem(article) {
    return `
      <li
        class="recent-item"
        tabindex="0"
        role="button"
        aria-label="Read recent article: ${article.title}"
        data-article-id="${article.id}"
      >
        <span class="recent-dot" aria-hidden="true"></span>
        <div class="recent-info">
          <span class="recent-title">${article.title}</span>
          <span class="recent-meta">
            ${Wiki.data.getCategoryById(article.category)?.label || article.category}
            &middot; ${formatDate(article.date)}
          </span>
        </div>
      </li>
    `;
  }

  function sidebarCategoryItem(cat) {
    return `
      <li>
        <button
          class="sidebar-link"
          data-category-id="${cat.id}"
          aria-label="Browse ${cat.label}"
        >
          <span class="sidebar-category-dot" style="background:${cat.color}" aria-hidden="true"></span>
          ${cat.label}
          <span style="margin-left:auto;font-size:11px;color:var(--color-muted)">${cat.articleCount}</span>
        </button>
      </li>
    `;
  }

  function activityItem(item) {
    return `
      <li class="activity-item">
        <span class="activity-item-title">${item.title}</span>
        <span class="activity-item-meta">${item.action} by ${item.author} &middot; ${item.time}</span>
      </li>
    `;
  }

  function relatedItem(article) {
    return `
      <li
        class="related-item"
        tabindex="0"
        role="button"
        aria-label="Read: ${article.title}"
        data-article-id="${article.id}"
      >
        <img
          class="related-thumb"
          src="${article.thumbnail}"
          alt=""
          loading="lazy"
          aria-hidden="true"
        />
        <div class="related-info">
          <span class="related-title">${article.title}</span>
          <span class="related-category">${Wiki.data.getCategoryById(article.category)?.label || ''}</span>
        </div>
      </li>
    `;
  }

  function searchResultItem(article) {
    return `
      <li
        class="search-result-item"
        tabindex="0"
        role="option"
        aria-label="${article.title}"
        data-article-id="${article.id}"
      >
        <img
          class="search-result-thumb"
          src="${article.thumbnail}"
          alt=""
          aria-hidden="true"
        />
        <div class="search-result-info">
          <div class="search-result-title">${article.title}</div>
          <div class="search-result-meta">
            ${Wiki.data.getCategoryById(article.category)?.label || article.category}
            &middot; ${formatDate(article.date)}
          </div>
        </div>
      </li>
    `;
  }

  /* ---- Utilities ---- */
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }

  return { categoryBadge, articleCard, categoryTile, trendingItem, recentItem, sidebarCategoryItem, activityItem, relatedItem, searchResultItem, formatDate };
})();


/* ============================================================
   Wiki.nav — View Routing
   ============================================================ */
Wiki.nav = (() => {

  let currentView = 'home';
  let previousView = 'home';

  const views = {
    home: document.getElementById('view-home'),
    article: document.getElementById('view-article'),
  };

  function showView(viewId) {
    previousView = currentView;
    currentView = viewId;

    Object.entries(views).forEach(([id, el]) => {
      if (!el) return;
      if (id === viewId) {
        el.removeAttribute('hidden');
        el.classList.add('is-active');
        // Re-trigger animation
        el.style.animation = 'none';
        el.offsetHeight; // reflow
        el.style.animation = '';
      } else {
        el.setAttribute('hidden', '');
        el.classList.remove('is-active');
      }
    });

    // Update nav link active states
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.toggle('is-active', link.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openArticle(articleId) {
    const article = Wiki.data.getById(articleId);
    if (!article) return;
    Wiki.render_article(article);
    showView('article');
  }

  function goBack() {
    showView(previousView === 'article' ? 'home' : previousView);
  }

  return { showView, openArticle, goBack };
})();


/* ============================================================
   Wiki.search — Search Logic
   ============================================================ */
Wiki.search = (() => {

  let debounceTimer = null;

  function bindInput(inputEl, resultsEl, emptyEl) {
    if (!inputEl) return;

    inputEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = inputEl.value.trim();
        renderResults(q, resultsEl, emptyEl);
      }, 180);
    });

    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        inputEl.value = '';
        renderResults('', resultsEl, emptyEl);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const first = resultsEl.querySelector('.search-result-item');
        if (first) first.focus();
      }
    });

    // Keyboard navigation within results
    resultsEl.addEventListener('keydown', e => {
      const items = [...resultsEl.querySelectorAll('.search-result-item')];
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && idx < items.length - 1) {
        e.preventDefault();
        items[idx + 1].focus();
      }
      if (e.key === 'ArrowUp' && idx > 0) {
        e.preventDefault();
        items[idx - 1].focus();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const id = document.activeElement.dataset.articleId;
        if (id) {
          inputEl.value = '';
          renderResults('', resultsEl, emptyEl);
          Wiki.nav.openArticle(id);
          closeOverlay();
        }
      }
    });

    // Click to open
    resultsEl.addEventListener('click', e => {
      const item = e.target.closest('[data-article-id]');
      if (!item) return;
      inputEl.value = '';
      renderResults('', resultsEl, emptyEl);
      Wiki.nav.openArticle(item.dataset.articleId);
      closeOverlay();
    });
  }

  function renderResults(query, resultsEl, emptyEl) {
    if (!query) {
      resultsEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = true;
      return;
    }
    const results = Wiki.data.searchArticles(query);
    if (results.length === 0) {
      resultsEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
    } else {
      if (emptyEl) emptyEl.hidden = true;
      resultsEl.innerHTML = results.map(Wiki.render.searchResultItem).join('');
    }
  }

  function closeOverlay() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.getElementById('nav-search-toggle')?.setAttribute('aria-expanded', 'false');
    }
  }

  return { bindInput };
})();


/* ============================================================
   Wiki.tabs — Tab Switching
   ============================================================ */
Wiki.tabs = (() => {

  function init(tabBarEl) {
    if (!tabBarEl) return;
    const tabs = tabBarEl.querySelectorAll('.tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab, tabs));
      tab.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          switchTab(tab, tabs);
        }
        // Arrow key navigation
        const tabArray = [...tabs];
        const idx = tabArray.indexOf(tab);
        if (e.key === 'ArrowRight' && idx < tabArray.length - 1) {
          e.preventDefault();
          tabArray[idx + 1].focus();
          switchTab(tabArray[idx + 1], tabs);
        }
        if (e.key === 'ArrowLeft' && idx > 0) {
          e.preventDefault();
          tabArray[idx - 1].focus();
          switchTab(tabArray[idx - 1], tabs);
        }
      });
    });
  }

  function switchTab(activeTab, allTabs) {
    const tabKey = activeTab.dataset.tab;
    if (!tabKey) return;

    allTabs.forEach(t => {
      t.classList.toggle('is-active', t === activeTab);
      t.setAttribute('aria-selected', t === activeTab ? 'true' : 'false');
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      const isTarget = panel.id === `tab-panel-${tabKey}`;
      panel.classList.toggle('is-active', isTarget);
      panel.toggleAttribute('hidden', !isTarget);
    });
  }

  return { init };
})();


/* ============================================================
   Wiki.motion — Scroll Reveal via IntersectionObserver
   ============================================================ */
Wiki.motion = (() => {

  function init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      document.querySelectorAll('.reveal-section').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
  }

  return { init };
})();


/* ============================================================
   Wiki.render_article — Full Article Renderer
   ============================================================ */
Wiki.render_article = (article) => {
  const cat = Wiki.data.getCategoryById(article.category);

  // Header
  document.getElementById('article-category-badge').className = `badge badge--${article.category}`;
  document.getElementById('article-category-badge').textContent = cat ? cat.label : article.category;
  document.getElementById('article-date').textContent = Wiki.render.formatDate(article.date);
  document.getElementById('article-title').textContent = article.title;
  document.getElementById('article-excerpt').textContent = article.excerpt;
  document.getElementById('article-author-name').textContent = `by ${article.author}`;
  document.getElementById('article-avatar').textContent = article.authorInitials;

  // Hero image
  const heroImg = document.getElementById('article-hero-img');
  heroImg.src = article.thumbnail;
  heroImg.alt = `${article.title} — header image`;

  // Body
  document.getElementById('article-body').innerHTML = article.body;

  // Tags
  const tagsEl = document.getElementById('article-tags');
  tagsEl.innerHTML = article.tags.map(t => `<span class="article-tag">#${t}</span>`).join('');

  // Related articles
  const relatedEl = document.getElementById('related-articles');
  const related = article.relatedIds
    .map(id => Wiki.data.getById(id))
    .filter(Boolean)
    .slice(0, 4);
  relatedEl.innerHTML = related.length
    ? related.map(Wiki.render.relatedItem).join('')
    : '<li style="font-size:13px;color:var(--color-muted)">No related articles.</li>';

  // In this category
  const catArticlesEl = document.getElementById('category-articles');
  const catArticles = Wiki.data.getByCategory(article.category)
    .filter(a => a.id !== article.id)
    .slice(0, 4);
  catArticlesEl.innerHTML = catArticles.length
    ? catArticles.map(Wiki.render.relatedItem).join('')
    : '<li style="font-size:13px;color:var(--color-muted)">No other articles in this category.</li>';
};


/* ============================================================
   Wiki.init — Bootstrap Everything
   ============================================================ */
Wiki.init = () => {

  /* --- Render home sections --- */

  // Featured / Trending / New cards
  const featuredCards  = document.getElementById('featured-cards');
  const trendingCards  = document.getElementById('trending-cards');
  const newCards       = document.getElementById('new-cards');

  if (featuredCards)  featuredCards.innerHTML  = Wiki.data.getFeatured().map(Wiki.render.articleCard).join('');
  if (trendingCards)  trendingCards.innerHTML  = Wiki.data.getTrending().map(Wiki.render.articleCard).join('');
  if (newCards)       newCards.innerHTML       = Wiki.data.getNew().map(Wiki.render.articleCard).join('');

  // Category grid
  const catGrid = document.getElementById('category-grid');
  if (catGrid) catGrid.innerHTML = Wiki.data.categories.map(Wiki.render.categoryTile).join('');

  // Trending list
  const trendList = document.getElementById('trending-list');
  if (trendList) trendList.innerHTML = Wiki.data.getTrending().map((a, i) => Wiki.render.trendingItem(a, i)).join('');

  // Recent list
  const recentList = document.getElementById('recent-list');
  if (recentList) {
    // Show all articles sorted by date
    const sorted = [...Wiki.data.articles].sort((a, b) => new Date(b.date) - new Date(a.date));
    recentList.innerHTML = sorted.slice(0, 6).map(Wiki.render.recentItem).join('');
  }

  // Sidebar categories
  const sidebarCats = document.getElementById('sidebar-categories');
  if (sidebarCats) sidebarCats.innerHTML = Wiki.data.categories.map(Wiki.render.sidebarCategoryItem).join('');

  // Sidebar activity
  const sidebarActivity = document.getElementById('sidebar-activity');
  if (sidebarActivity) sidebarActivity.innerHTML = Wiki.data.recentActivity.map(Wiki.render.activityItem).join('');

  // Stats
  const statArticles = document.getElementById('stat-articles');
  const statCats = document.getElementById('stat-categories');
  if (statArticles) statArticles.textContent = Wiki.data.articles.length;
  if (statCats) statCats.textContent = Wiki.data.categories.length;


  /* --- Tab switching --- */
  Wiki.tabs.init(document.querySelector('.tab-bar'));


  /* --- Event delegation for article open --- */
  document.addEventListener('click', e => {
    const articleTrigger = e.target.closest('[data-article-id]');
    if (articleTrigger && !articleTrigger.closest('.search-results')) {
      Wiki.nav.openArticle(articleTrigger.dataset.articleId);
    }

    const categoryTrigger = e.target.closest('[data-category-id]');
    if (categoryTrigger) {
      // Scroll into categories section or show category filter
      const catSection = document.getElementById('category-grid');
      if (catSection) catSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const viewTrigger = e.target.closest('[data-view]');
    if (viewTrigger) {
      e.preventDefault();
      Wiki.nav.showView(viewTrigger.dataset.view === 'categories' || viewTrigger.dataset.view === 'trending' || viewTrigger.dataset.view === 'recent' ? 'home' : viewTrigger.dataset.view);
      closeMobileMenu();
    }

    const randomTrigger = e.target.closest('[data-action="random"]');
    if (randomTrigger) {
      e.preventDefault();
      const all = Wiki.data.articles;
      const random = all[Math.floor(Math.random() * all.length)];
      Wiki.nav.openArticle(random.id);
      closeMobileMenu();
    }
  });

  // Keyboard enter/space on card-like elements
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const trigger = e.target.closest('[data-article-id][role="button"]');
      if (trigger) {
        e.preventDefault();
        Wiki.nav.openArticle(trigger.dataset.articleId);
      }
    }
  });

  // Back button in article view
  document.getElementById('article-back-btn')?.addEventListener('click', Wiki.nav.goBack);

  // Hero buttons
  document.getElementById('hero-explore-btn')?.addEventListener('click', () => {
    document.getElementById('category-grid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('hero-random-btn')?.addEventListener('click', () => {
    const all = Wiki.data.articles;
    Wiki.nav.openArticle(all[Math.floor(Math.random() * all.length)].id);
  });


  /* --- Nav search toggle --- */
  const searchToggle  = document.getElementById('nav-search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose   = document.getElementById('search-close');
  const searchInput   = document.getElementById('search-input');

  function openSearch() {
    searchOverlay.classList.add('is-open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    searchToggle?.setAttribute('aria-expanded', 'true');
    setTimeout(() => searchInput?.focus(), 50);
  }

  function closeSearch() {
    searchOverlay.classList.remove('is-open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    searchToggle?.setAttribute('aria-expanded', 'false');
    if (searchInput) {
      searchInput.value = '';
      document.getElementById('search-results').innerHTML = '';
      document.getElementById('search-empty').hidden = true;
    }
  }

  searchToggle?.addEventListener('click', () => {
    const isOpen = searchOverlay.classList.contains('is-open');
    isOpen ? closeSearch() : openSearch();
  });

  searchClose?.addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    // Cmd/Ctrl+K global shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });


  /* --- Bind search inputs --- */
  Wiki.search.bindInput(
    document.getElementById('search-input'),
    document.getElementById('search-results'),
    document.getElementById('search-empty')
  );

  Wiki.search.bindInput(
    document.getElementById('hero-search-input'),
    document.getElementById('hero-search-results'),
    document.getElementById('hero-search-empty')
  );


  /* --- Mobile menu --- */
  const mobileToggle  = document.getElementById('mobile-menu-toggle');
  const mobileMenu    = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileOverlay.classList.add('is-open');
    mobileOverlay.removeAttribute('aria-hidden');
    mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileOverlay.classList.remove('is-open');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    mobileToggle?.setAttribute('aria-expanded', 'false');
  }

  mobileToggle?.addEventListener('click', () => {
    mobileMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
  });

  mobileOverlay?.addEventListener('click', closeMobileMenu);

  Wiki.init.closeMobileMenu = closeMobileMenu;


  /* --- Scroll reveal --- */
  Wiki.motion.init();


  /* --- Initial view --- */
  Wiki.nav.showView('home');
};

// Expose for closure use
function closeMobileMenu() {
  Wiki.init.closeMobileMenu?.();
}

/* Bootstrap on DOM ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Wiki.init);
} else {
  Wiki.init();
}
