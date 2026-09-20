import { useState, useEffect, useRef } from 'react'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const experience = [
  {
    role: 'Software Engineering Intern',
    company: 'Palantir Technologies',
    period: 'May 2024 – Aug 2024',
    location: 'New York, NY',
    bullets: [
      'Built a real-time pipeline ingestion dashboard in React + TypeScript, reducing operator response time by 40%.',
      'Refactored internal Java microservices handling 2M+ daily events; improved P99 latency from 340ms to 95ms.',
      'Shipped a CI/CD monitoring integration with PagerDuty that cut mean time to detection by 60%.',
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    company: 'MIT CSAIL — Distributed Systems Group',
    period: 'Sep 2023 – May 2024',
    location: 'Cambridge, MA',
    bullets: [
      'Implemented a Raft consensus variant in Go to study leader election under partial network partitions.',
      'Collected and analyzed 200GB of cluster telemetry; presented findings at SOSP 2024 student workshop.',
      'Co-authored a section of a submitted workshop paper on adaptive timeout strategies.',
    ],
  },
  {
    role: 'Teaching Assistant — 6.004 Computation Structures',
    company: 'Massachusetts Institute of Technology',
    period: 'Feb 2023 – May 2023',
    location: 'Cambridge, MA',
    bullets: [
      'Led weekly recitation sections of 25 students covering digital logic, ISA design, and pipelining.',
      'Wrote three new problem-set questions on cache coherence; adopted into the official problem bank.',
    ],
  },
  {
    role: 'Software Engineering Intern',
    company: 'Stripe',
    period: 'May 2023 – Aug 2023',
    location: 'San Francisco, CA',
    bullets: [
      'Built an internal tooling dashboard for fraud-rule authoring, used by 30+ risk analysts.',
      'Contributed a 2,000-line TypeScript PR to the payments SDK to support idempotent retries.',
    ],
  },
]

const projects = [
  {
    id: 1,
    title: 'Kestrel — Distributed Key-Value Store',
    tags: ['Go', 'Raft', 'gRPC', 'Docker'],
    description:
      'Fault-tolerant KV store with linearizable reads/writes using the Raft consensus algorithm. Supports log compaction, snapshotting, and dynamic cluster membership. Benchmarked at 120k ops/sec on a 5-node cluster.',
    link: '#',
    repo: '#',
    star: true,
  },
  {
    id: 2,
    title: 'Flux — Lightweight ML Framework',
    tags: ['Python', 'C++', 'CUDA', 'NumPy'],
    description:
      'Autograd engine with dynamic computation graphs supporting forward and reverse-mode differentiation. Implements CNN, RNN, and Transformer layers from scratch; achieves 94.1% on CIFAR-10.',
    link: '#',
    repo: '#',
    star: true,
  },
  {
    id: 3,
    title: 'Arbor — Compiler for a Typed Language',
    tags: ['OCaml', 'LLVM', 'x86', 'Hindley-Milner'],
    description:
      'End-to-end compiler for a statically-typed functional language: lexer, recursive-descent parser, HM type inference, SSA IR, and x86-64 code generation via LLVM backend.',
    link: '#',
    repo: '#',
    star: false,
  },
  {
    id: 4,
    title: 'Mesh — P2P File Sync Protocol',
    tags: ['Rust', 'libp2p', 'BLAKE3', 'CRDT'],
    description:
      'Peer-to-peer file synchronization daemon using CRDTs for conflict-free merges across offline-capable nodes. Inspired by Syncthing; achieves sub-200ms sync latency on a LAN.',
    link: '#',
    repo: '#',
    star: false,
  },
  {
    id: 5,
    title: 'Atlas — Campus Navigation PWA',
    tags: ['TypeScript', 'React', 'MapLibre', 'Service Workers'],
    description:
      'Offline-capable campus navigation app with real-time occupancy data for 200+ buildings, integrated with the university room-booking API. 1,200+ weekly active users.',
    link: '#',
    repo: '#',
    star: false,
  },
  {
    id: 6,
    title: 'Lens — Log Anomaly Detector',
    tags: ['Python', 'PyTorch', 'Kafka', 'Grafana'],
    description:
      'Streaming log anomaly detection system using a fine-tuned BERT model on infrastructure logs. Integrated with Grafana dashboards and Slack alerting; deployed on MIT\'s research cluster.',
    link: '#',
    repo: '#',
    star: false,
  },
]

const skills = {
  Languages: ['Go', 'Python', 'TypeScript', 'Java', 'C/C++', 'Rust', 'OCaml', 'SQL'],
  'Systems & Infra': ['Linux', 'Docker', 'Kubernetes', 'Kafka', 'PostgreSQL', 'Redis', 'AWS', 'GCP'],
  'CS Fundamentals': ['Distributed Systems', 'Compilers', 'Operating Systems', 'ML / Deep Learning', 'Algorithms'],
  'Tools & Frameworks': ['React', 'Next.js', 'gRPC', 'PyTorch', 'LLVM', 'Git', 'Terraform'],
}

const resumeItems = [
  { label: 'Last Updated', value: 'September 2025' },
  { label: 'Format', value: 'PDF — 1 page' },
  { label: 'Focus', value: 'Software Engineering' },
]

/* ─── Utilities ─────────────────────────────────────────────────────────── */

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: {
  children: React.ReactNode; delay?: number; as?: React.ElementType; className?: string
}) {
  const { ref, visible } = useInView()
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

/* ─── Nav ───────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: scrolled ? 'rgba(14,17,23,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: '#e8e6e0', letterSpacing: '-0.01em', fontStyle: 'italic' }}>Kai Nakamura</span>
        </a>

        <nav style={{ display: 'flex', gap: 32 }} className="desk-nav">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href}
              onMouseEnter={() => setActive(l.label)}
              onMouseLeave={() => setActive('')}
              style={{
                textDecoration: 'none', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em',
                color: active === l.label ? 'var(--color-accent)' : 'rgba(255,255,255,0.45)',
                transition: 'color 0.18s',
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button className="mob-btn" onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', padding: '7px 10px', display: 'none' }}>
          <span style={{ display: 'block', width: 18, height: 1.5, backgroundColor: open ? 'var(--color-accent)' : 'rgba(255,255,255,0.6)', marginBottom: 4, transform: open ? 'rotate(45deg) translateY(5.5px)' : 'none', transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: 18, height: 1.5, backgroundColor: open ? 'var(--color-accent)' : 'rgba(255,255,255,0.6)', opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
          <span style={{ display: 'block', width: 18, height: 1.5, backgroundColor: open ? 'var(--color-accent)' : 'rgba(255,255,255,0.6)', marginTop: 4, transform: open ? 'rotate(-45deg) translateY(-5.5px)' : 'none', transition: 'all 0.2s' }} />
        </button>
      </div>

      {open && (
        <div style={{ backgroundColor: '#0d0d11', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 28px 28px' }}>
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '13px 0', textDecoration: 'none', fontSize: 14, color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */

function Hero() {
  const [typed, setTyped] = useState('')
  const full = 'building reliable systems.'
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setTyped(full.slice(0, i + 1))
      i++
      if (i >= full.length) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 28px 80px', maxWidth: 1100, margin: '0 auto' }}>
      <Reveal>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 20, letterSpacing: '0.01em', fontWeight: 400 }}>
          Computer Science · MIT Class of 2026
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 8vw, 88px)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1.0, color: '#e8e6e0', margin: '0 0 16px' }}>
          Kai Nakamura.
        </h1>
      </Reveal>
      <Reveal delay={140}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 400, color: 'rgba(232,230,224,0.4)', margin: '0 0 36px', lineHeight: 1.3 }}>
          Passionate about{' '}
          <span style={{ color: 'rgba(232,230,224,0.65)' }}>{typed}</span>
          <span style={{ color: 'var(--color-accent)', animation: 'blink 1s step-end infinite' }}>|</span>
        </h2>
      </Reveal>
      <Reveal delay={200}>
        <p style={{ fontSize: 17, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', maxWidth: 520, marginBottom: 48 }}>
          CS + Math junior at MIT, expected May 2026. I specialise in distributed systems, compilers, and full-stack engineering. Currently looking for Summer 2025 internships.
        </p>
      </Reveal>
      <Reveal delay={260}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="#projects" style={{
            padding: '13px 28px', border: '1px solid var(--color-accent)', color: 'var(--color-accent)',
            fontSize: 13, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'background-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(79,142,247,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            View Projects
          </a>
          <a href="#resume" style={{
            padding: '13px 28px', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
            fontSize: 13, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
          >
            Download CV
          </a>
        </div>
      </Reveal>

      {/* Side socials */}
      <div className="side-links" style={{ position: 'fixed', bottom: 0, left: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {[
          { label: 'GitHub', path: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
          { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
          { label: 'Email', path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
        ].map(s => (
          <a key={s.label} href="#" aria-label={s.label}
            style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s, transform 0.2s', display: 'block' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.transform = 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d={s.path} />
            </svg>
          </a>
        ))}
        <div style={{ width: 1, height: 72, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 8 }} />
      </div>
    </section>
  )
}

/* ─── About ─────────────────────────────────────────────────────────────── */

function About() {
  return (
    <section id="about" style={{ padding: '100px 28px', maxWidth: 1100, margin: '0 auto' }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
          
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e6e0', margin: 0 }}>About Me</h2>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)', maxWidth: 300, marginLeft: 8 }} />
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 72, alignItems: 'start' }} className="about-grid">
        <div>
          <Reveal>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
              I'm Kai — a junior at MIT studying Computer Science and Mathematics. I'm drawn to problems at the edge of what software can reliably do: distributed consensus, compiler correctness, and systems that stay up when everything else fails.
            </p>
          </Reveal>
          <Reveal delay={60}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>
              Outside of class, I contribute to open-source Go infrastructure projects, play competitive chess (USCF 2180), and run a small technical blog about distributed systems papers I find interesting.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.55)', marginBottom: 40 }}>
              I'm actively seeking Summer 2025 SWE internships — particularly in systems, infrastructure, or developer tools. If that sounds like your team, let's talk.
            </p>
          </Reveal>

          {/* Skill groups */}
          <Reveal delay={140}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="skills-grid">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <p style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {group}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {items.map(s => (
                      <li key={s} style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--color-accent)', fontSize: 16, lineHeight: 1 }}>·</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', zIndex: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img
                src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=480&h=560&fit=crop&auto=format"
                alt="Kai Nakamura"
                style={{ width: '100%', aspectRatio: '5/6', objectFit: 'cover', display: 'block', filter: 'grayscale(15%) brightness(0.85)', transition: 'filter 0.4s' }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0%) brightness(1)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(15%) brightness(0.85)')}
              />
            </div>
            {/* Accent offset border */}
            <div style={{ position: 'absolute', top: 14, left: 14, right: -14, bottom: -14, border: '1px solid var(--color-accent)', zIndex: 1 }} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Experience ────────────────────────────────────────────────────────── */

function Experience() {
  const [active, setActive] = useState(0)
  const cur = experience[active]

  return (
    <section id="experience" style={{ padding: '100px 28px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
            
            <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e6e0', margin: 0 }}>Experience</h2>
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)', maxWidth: 300, marginLeft: 8 }} />
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0 }} className="exp-grid">
          {/* Tab list */}
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }} className="exp-tabs">
            {experience.map((e, i) => (
              <button key={i} onClick={() => setActive(i)}
                style={{
                  background: 'none', border: 'none', borderLeft: `2px solid ${active === i ? 'var(--color-accent)' : 'transparent'}`,
                  marginLeft: -1, padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
                  color: active === i ? 'var(--color-accent)' : 'rgba(255,255,255,0.35)',
                  fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
                  transition: 'color 0.18s, border-color 0.18s',
                  backgroundColor: active === i ? 'rgba(79,142,247,0.05)' : 'transparent',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
                onMouseEnter={e => { if (active !== i) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)' } }}
                onMouseLeave={e => { if (active !== i) { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.backgroundColor = 'transparent' } }}
              >
                {e.company.split(' — ')[0].split(',')[0].split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: '4px 0 4px 40px' }}>
            <Reveal key={active}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#e8e6e0', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                  {cur.role}{' '}
                  <span style={{ color: 'var(--color-accent)' }}>@ {cur.company.split(' — ')[0]}</span>
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>
                  {cur.period} · {cur.location}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {cur.bullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ color: 'var(--color-accent)', marginTop: 6, flexShrink: 0, fontSize: 18, lineHeight: 1 }}>·</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Projects ──────────────────────────────────────────────────────────── */

function ProjectCard({ p, i }: { p: typeof projects[0]; i: number }) {
  const [hov, setHov] = useState(false)
  return (
    <Reveal delay={i * 50} as="article">
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: 28, border: '1px solid rgba(255,255,255,0.07)', height: '100%', display: 'flex', flexDirection: 'column',
          backgroundColor: hov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
          transform: hov ? 'translateY(-4px)' : 'none',
          transition: 'background-color 0.25s, transform 0.25s, border-color 0.25s',
          borderColor: hov ? 'rgba(79,142,247,0.3)' : 'rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.2">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {p.star && (
              <span style={{ fontSize: 12, color: 'var(--color-accent)', border: '1px solid rgba(79,142,247,0.3)', padding: '2px 8px' }}>
                featured
              </span>
            )}
            <a href={p.repo} aria-label="GitHub" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a href={p.link} aria-label="External link" style={{ color: 'rgba(255,255,255,0.3)', transition: 'color 0.18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>

        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e8e6e0', margin: '0 0 12px', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {p.title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.42)', margin: '0 0 auto 0', paddingBottom: 24 }}>
          {p.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {p.tags.map(t => (
            <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(79,142,247,0.85)', letterSpacing: '0.02em' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  )
}

function Projects() {
  return (
    <section id="projects" style={{ padding: '100px 28px', maxWidth: 1100, margin: '0 auto' }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
          
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e6e0', margin: 0 }}>Projects</h2>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)', maxWidth: 300, marginLeft: 8 }} />
        </div>
      </Reveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="proj-grid">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </div>
    </section>
  )
}

/* ─── Resume ────────────────────────────────────────────────────────────── */

function Resume() {
  return (
    <section id="resume" style={{ padding: '100px 28px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
            
            <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e6e0', margin: 0 }}>Resume</h2>
            <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)', maxWidth: 300, marginLeft: 8 }} />
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="resume-grid">
          <Reveal>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e6e0', margin: '0 0 16px' }}>
                Kai Nakamura
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>
                My resume covers my education, internships, research experience, and notable projects — all on one page. Feel free to download it or view it inline below.
              </p>

              <div style={{ marginBottom: 40 }}>
                {resumeItems.map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{r.label}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="#" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px', border: '1px solid var(--color-accent)', color: 'var(--color-accent)',
                  fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(79,142,247,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download PDF
                </a>
                <a href="#" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 24px', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)',
                  fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  View Online
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            {/* Resume preview card */}
            <div style={{ border: '1px solid rgba(255,255,255,0.08)', padding: 32, backgroundColor: 'rgba(255,255,255,0.015)', position: 'relative' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 20, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#e8e6e0', letterSpacing: '-0.01em', marginBottom: 4 }}>Kai Nakamura</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>kai@mit.edu · Cambridge, MA · github.com/kainakamura</div>
              </div>
              {[
                { heading: 'Education', lines: ['MIT — BS Computer Science & Mathematics, GPA 4.8/5.0', 'Expected May 2026 · Dean\'s List, NSF GRFP Honorable Mention'] },
                { heading: 'Experience', lines: ['Palantir Technologies — SWE Intern (Summer 2024)', 'Stripe — SWE Intern (Summer 2023)', 'MIT CSAIL — Undergrad Research Assistant'] },
                { heading: 'Projects', lines: ['Kestrel (Go, Raft) · Flux (Python, CUDA) · Arbor (OCaml, LLVM)'] },
                { heading: 'Skills', lines: ['Go · Python · TypeScript · Java · C++ · Rust · Docker · AWS'] },
              ].map(s => (
                <div key={s.heading} style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{s.heading}</div>
                  {s.lines.map((l, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{l}</div>
                  ))}
                </div>
              ))}
              {/* Blur overlay hint */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(transparent, rgba(13,13,17,0.95))', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 16 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>↓ download for full version</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ───────────────────────────────────────────────────────────── */

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Required'
    return e
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('sending')
    setTimeout(() => setStatus('done'), 1600)
  }

  const inputStyle = (err?: string): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', backgroundColor: 'rgba(255,255,255,0.03)',
    border: `1px solid ${err ? '#c06060' : 'rgba(255,255,255,0.1)'}`,
    color: '#e8e6e0', fontSize: 14, fontFamily: 'var(--font-sans)', outline: 'none',
    transition: 'border-color 0.2s',
  })

  return (
    <section id="contact" style={{ padding: '100px 28px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            
            <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e6e0', margin: 0 }}>Get In Touch</h2>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.42)', marginBottom: 52 }}>
            I'm looking for Summer 2025 internship opportunities in software engineering. Whether you have a question, an opportunity, or just want to say hello — my inbox is always open.
          </p>
        </Reveal>

        {status === 'done' ? (
          <Reveal>
            <div style={{ border: '1px solid rgba(79,142,247,0.3)', padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, border: '1px solid var(--color-accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 600, color: '#e8e6e0', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}>Message received.</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>I'll get back to you within 24–48 hours.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={100}>
            <form onSubmit={submit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                {(['name', 'email'] as const).map(f => (
                  <div key={f}>
                    <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                      {f === 'name' ? 'Name' : 'Email'}
                    </label>
                    <input
                      type={f === 'email' ? 'email' : 'text'}
                      value={form[f]}
                      placeholder={f === 'name' ? 'Your name' : 'you@example.com'}
                      onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                      onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                      onBlur={e => (e.target.style.borderColor = errors[f] ? '#c06060' : 'rgba(255,255,255,0.1)')}
                      style={inputStyle(errors[f])}
                    />
                    {errors[f] && <p style={{ fontSize: 11, color: '#e07070', margin: '4px 0 0' }}>{errors[f]}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Message
                </label>
                <textarea
                  rows={6}
                  value={form.message}
                  placeholder="Tell me about the opportunity, role, or question..."
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.target.style.borderColor = errors.message ? '#c06060' : 'rgba(255,255,255,0.1)')}
                  style={{ ...inputStyle(errors.message), resize: 'vertical', minHeight: 130 }}
                />
                {errors.message && <p style={{ fontSize: 11, color: '#e07070', margin: '4px 0 0' }}>{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  padding: '14px 36px', border: '1px solid var(--color-accent)', backgroundColor: 'transparent',
                  color: 'var(--color-accent)', fontSize: 13, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  alignSelf: 'center', marginTop: 8,
                  opacity: status === 'sending' ? 0.5 : 1,
                  transition: 'background-color 0.2s, opacity 0.2s',
                }}
                onMouseEnter={e => { if (status !== 'sending') e.currentTarget.style.backgroundColor = 'rgba(79,142,247,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 28px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: '0 0 6px' }}>
        Designed & built by Kai Nakamura
      </p>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
        MIT Class of 2026 · Open to Summer 2025 Internships
      </p>
    </footer>
  )
}

/* ─── App ───────────────────────────────────────────────────────────────── */

export default function App() {
  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        @media (max-width: 900px) {
          .desk-nav { display: none !important; }
          .mob-btn { display: block !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .exp-grid { grid-template-columns: 1fr !important; }
          .exp-tabs { flex-direction: row !important; border-left: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; overflow-x: auto; }
          .exp-tabs button { border-left: none !important; border-bottom: 2px solid transparent; margin-left: 0 !important; margin-bottom: -1px; }
          .proj-grid { grid-template-columns: 1fr 1fr !important; }
          .resume-grid { grid-template-columns: 1fr !important; }
          .side-links { display: none !important; }
        }
        @media (max-width: 580px) {
          .proj-grid { grid-template-columns: 1fr !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
