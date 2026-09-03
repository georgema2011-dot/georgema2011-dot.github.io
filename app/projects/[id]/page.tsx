/* eslint-disable @next/next/no-img-element, @next/next/no-html-link-for-pages */
import { notFound } from "next/navigation";
import { projects } from "../../projects-data";

export function generateStaticParams() {
  return projects.map(({ id }) => ({ id }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = projects.findIndex((item) => item.id === id);
  const project = projects[index];
  if (!project) notFound();
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return <main className="project-page" id="top">
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="brand" href="/">Ma / George</a>
      <span className="nav-role">{project.discipline} / {project.year}</span>
      <div className="nav-links"><a href="/#work">Projects</a><a href="/#photography">Photography</a><a href="/#contact">Contact</a></div>
    </nav>
    <article className="dossier project-case">
      <header className="dossier-head">
        <div className="dossier-number"><p className="label">Project</p><span>{project.number}</span></div>
        <div className="dossier-title"><p className="label">{project.discipline} / {project.year}</p><h1>{project.title}</h1></div>
        <div className="dossier-copy"><p className="statement">{project.statement}</p><div><p>{project.description}</p>{project.document&&<a className="deck-link" href={project.document.href} target="_blank" rel="noreferrer">{project.document.label} ↗</a>}</div></div>
      </header>
      <div className={`board-grid ${project.boards.length > 3 ? "board-grid-many" : `board-grid-${project.boards.length}`}`}>
        {project.boards.map((board, boardIndex) => <figure className={`board board-${boardIndex + 1}`} key={board.src}>
          <img src={board.src} alt={board.alt} loading={boardIndex === 0 ? "eager" : "lazy"}/>
          <figcaption><span>{project.number}.{String(boardIndex + 1).padStart(2, "0")}</span><span>{board.caption}</span></figcaption>
        </figure>)}
      </div>
    </article>
    <nav className="project-pagination" aria-label="Project navigation">
      <a href={`/projects/${previous.id}/`}><span>Previous</span><strong>← {previous.title}</strong></a>
      <a href="/#work"><span>Index</span><strong>All projects</strong></a>
      <a href={`/projects/${next.id}/`}><span>Next</span><strong>{next.title} →</strong></a>
    </nav>
  </main>;
}
