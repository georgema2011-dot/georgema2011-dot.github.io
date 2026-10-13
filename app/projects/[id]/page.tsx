/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "../../projects-data";

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);
  if (!project) return {};
  return {
    title: `${project.title} | Ma Shun Ngai George`,
    description: project.description,
    alternates: { canonical: `/projects/${project.id}/` },
    openGraph: {
      title: `${project.title} | Ma Shun Ngai George`,
      description: project.description,
      type: "article",
      url: `/projects/${project.id}/`,
      images: [{ url: project.boards[0].src, alt: project.boards[0].alt }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = projects.findIndex((item) => item.id === id);
  const project = projects[index];
  if (!project) notFound();
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    dateCreated: project.year,
    creator: { "@type": "Person", name: "Ma Shun Ngai George" },
    url: `https://georgema2011-dot.github.io/projects/${project.id}/`,
    image: project.boards.map((board) => `https://georgema2011-dot.github.io${board.src}`),
  };

  return <main className="project-page" id="top">
    <a className="skip-link" href="#case-study">Skip to case study</a>
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="brand" href="/">Ma / George</a>
      <span className="nav-role">{project.discipline} / {project.year}</span>
      <div className="nav-links"><a href="/#work" aria-current="page">Projects</a><a href="/#photography">Photography</a><a href="/#contact">Contact</a></div>
    </nav>
    <article className="dossier project-case" id="case-study">
      <header className="dossier-head">
        <div className="dossier-number"><p className="label">Project</p><span>{project.number}</span></div>
        <div className="dossier-title"><p className="label">{project.discipline} / {project.year}</p><h1>{project.title}</h1></div>
        <div className="dossier-copy"><p className="statement">{project.statement}</p><div><p>{project.description}</p>{project.facts&&<dl className="project-facts">{project.facts.map((fact)=><div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}{project.document&&<a className="deck-link" href={project.document.href} target="_blank" rel="noreferrer">{project.document.label} ↗</a>}</div></div>
      </header>
      <div className={`board-grid ${project.boards.length > 3 ? "board-grid-many" : `board-grid-${project.boards.length}`}`}>
        {project.boards.map((board, boardIndex) => <figure className={`board board-${boardIndex + 1}`} key={board.src}>
          <a className="board-view" href={board.src} target="_blank" rel="noreferrer" aria-label={`Open full-size image: ${board.alt}`}><img src={board.src} alt={board.alt} loading={boardIndex === 0 ? "eager" : "lazy"} decoding="async"/></a>
          <figcaption><span>{project.number}.{String(boardIndex + 1).padStart(2, "0")}</span><span>{board.caption}</span></figcaption>
        </figure>)}
      </div>
    </article>
    <nav className="project-pagination" aria-label="Project navigation">
      <a href={`/projects/${previous.id}/`}><span>Previous</span><strong>← {previous.title}</strong></a>
      <a href="/#work"><span>Index</span><strong>All projects</strong></a>
      <a href={`/projects/${next.id}/`}><span>Next</span><strong>{next.title} →</strong></a>
    </nav>
    <section className="project-contact"><p className="label">Interested in this work?</p><h2>Let’s discuss a role or project.</h2><a href="mailto:georgem2011@gmail.com">Email George ↗</a></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(creativeWork)}}/>
  </main>;
}
