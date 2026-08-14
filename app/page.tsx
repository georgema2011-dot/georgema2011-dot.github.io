const projects = [
  {
    index: "01",
    title: "Local AI Toolkit",
    type: "AI systems · 2026",
    description: "A private, Apple Silicon–native coding setup pairing Qwen, oMLX, MTP speculative decoding, and OpenCode into one repeatable workflow.",
    tags: ["oMLX", "Qwen", "OpenCode"],
    href: "https://github.com/georgema2011-dot/storage/tree/main/outputs",
    status: "View build",
  },
  {
    index: "02",
    title: "Storage System",
    type: "Developer experience · 2026",
    description: "A private GitHub repository designed for durable file storage, clear structure, and large-asset versioning with Git LFS.",
    tags: ["GitHub", "Git LFS", "Automation"],
    href: "https://github.com/georgema2011-dot/storage",
    status: "View repository",
  },
  {
    index: "03",
    title: "Visual Archive",
    type: "Design practice · Ongoing",
    description: "A growing collection of visual identity, image-making, and editorial experiments—organized as a living record of the process.",
    tags: ["Identity", "Editorial", "Image"],
    href: "#contact",
    status: "In progress",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="George Ma, home">GM<span>.</span></a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-kicker"><span className="availability-dot" aria-hidden="true" />Singapore · Available for collaboration</div>
        <h1>George Ma is a<br /><em>creative technologist</em><br />building useful things.</h1>
        <div className="hero-footer">
          <p>I connect visual thinking with practical systems—from identity and image-making to local AI workflows.</p>
          <a className="round-link" href="#work" aria-label="Explore selected work">Explore<span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="work shell" id="work" aria-labelledby="work-title">
        <header className="section-heading">
          <p>Selected work</p>
          <h2 id="work-title">Ideas made tangible.</h2>
        </header>
        <div className="project-list">
          {projects.map((project) => (
            <article className="project" key={project.index}>
              <div className="project-number">{project.index}</div>
              <div className="project-body">
                <p className="project-type">{project.type}</p>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="tag-list" aria-label={`${project.title} disciplines`}>
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <a className="project-link" href={project.href} target={project.href.startsWith("http") ? "_blank" : undefined} rel={project.href.startsWith("http") ? "noreferrer" : undefined}>
                {project.status}<span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about" aria-labelledby="about-title">
        <div className="shell about-grid">
          <p className="eyebrow">A little context</p>
          <div>
            <h2 id="about-title">Curious by nature,<br />practical by choice.</h2>
            <div className="about-copy">
              <p>I enjoy the space between creative direction and technical execution: finding the shape of an idea, then building the system that lets it live.</p>
              <p>My current interests include local-first AI, visual systems, thoughtful automation, and tools that make complex work feel calm.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer shell" id="contact">
        <p className="eyebrow">Start a conversation</p>
        <h2>Have an interesting problem?</h2>
        <a className="email-link" href="mailto:georgem2011@gmail.com">georgem2011@gmail.com <span aria-hidden="true">↗</span></a>
        <div className="footer-meta">
          <p>© 2026 George Ma</p>
          <div>
            <a href="https://github.com/georgema2011-dot" target="_blank" rel="noreferrer">GitHub</a>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
