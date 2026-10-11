import { useRef, type PointerEvent, type ReactElement } from 'react';
import { contact, contents, cover, letter, posy, projects, style, work } from '../content/copy';
import { Page } from '../components/Page';
import { Label } from '../components/Label';
import { LinkButton } from '../components/LinkButton';
import { Img } from '../components/Img';
import { Barcode } from '../components/Barcode';
import { StatCard } from '../components/StatCard';
import { DropCap } from '../components/DropCap';

const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

function Cover({ reduced }: { reduced: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse' || !stage.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.current.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    stage.current.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    stage.current.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    stage.current?.style.setProperty('--rx', '0deg');
    stage.current?.style.setProperty('--ry', '0deg');
  };
  return (
    <Page n={1} side="right" variant="burgundy" label="Cover" folio={false} className="cover">
      <div className="cover__hit" onPointerMove={onMove} onPointerLeave={onLeave}>
        <p className="cover__top">{cover.topLine}</p>
        <h1 className="masthead">
          {cover.masthead}
          <span className="sr-only"> Barthel de Weydenthal</span>
        </h1>
        <p className="cover__subtitle">{cover.subtitle}</p>
        <div className="cover__stage" ref={stage}>
          <div className="cover__star">
            <Img src={asset('memoji.png')} alt="Sara's memoji" /* NEW COPY: alt text */ placeholder="memoji.png" eager className="cover__memoji" />
          </div>
          <ul className="cover__lines">
            {cover.lines.map((l, i) => (
              <li key={l} className={`cover__line cover__line--${i}`}>
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="cover__bottom">
          <p>{cover.bottom}</p>
          <Barcode />
        </div>
      </div>
      <div className="cover__sheen" aria-hidden="true" />
    </Page>
  );
}

function ContentsPage() {
  return (
    <Page n={2} side="left" label="Contents" className="contents">
      <h2 className="contents__title">{contents.label}</h2>
      <p className="contents__issue">Issue 01</p>
      <ol className="contents__list">
        {contents.items.map((it) => (
          <li key={it.hash}>
            <a href={`#${it.hash}`} className="contents__link">
              <span className="contents__folio">{it.folio}</span>
              <span className="contents__name">{it.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </Page>
  );
}

function LetterPage() {
  return (
    <Page n={3} side="right" label="Editor's Letter" className="letter">
      <Label>{letter.label}</Label>
      <div className="letter__head">
        <h2 className="headline headline--md">{letter.heading}</h2>
        <Img src={asset('memoji.png')} alt="" placeholder="memoji.png" className="letter__memoji" />
      </div>
      <div className="prose">
        {letter.body.map((p, i) => (i === 0 ? <DropCap key={i} text={p} /> : <p key={i}>{p}</p>))}
      </div>
      <p className="signature" aria-hidden="true">
        {letter.signature}
      </p>
      <p className="signoff">{letter.signoff}</p>
    </Page>
  );
}

function PosyStatsPage({ reduced }: { reduced: boolean }) {
  return (
    <Page n={4} side="left" variant="burgundy" label="Posy by the numbers" className="posy-stats">
      <div className="phone">
        <div className="phone__screen">
          <Img src={asset('posy-screen.png')} alt="The Posy app on iPhone" placeholder="posy-screen.png" />
        </div>
      </div>
      <div className="stats">
        {posy.stats.map((s) => (
          <StatCard key={s.label} {...s} reduced={reduced} />
        ))}
      </div>
      {posy.asOf && <p className="stats__note">{posy.asOf}</p>}
    </Page>
  );
}

function PosyStoryPage() {
  return (
    <Page n={5} side="right" label="Cover Story: Posy" className="posy-story">
      <Label>{posy.label}</Label>
      <h2 className="headline headline--lg">{posy.headline}</h2>
      <p className="subhead">{posy.subhead}</p>
      <div className="prose prose--cols">
        {posy.body.map((p, i) => (i === 0 ? <DropCap key={i} text={p} /> : <p key={i}>{p}</p>))}
      </div>
      <div className="btn-row">
        {posy.buttons.map((b, i) => (
          <LinkButton key={b.label} {...b} variant={i === 3 ? 'outline' : 'solid'} />
        ))}
      </div>
    </Page>
  );
}

function WorkPage() {
  return (
    <Page n={6} side="left" label="Work" className="work-list work-page">
      <Label>{work.label}</Label>
      <h2 className="headline headline--md">{work.heading}</h2>
      <ol className="roles">
        {work.roles.map((r) => (
          <li key={r.company} className="role">
            <p className="role__year">{r.year}</p>
            <div>
              <h3 className="role__company">{r.company}</h3>
              <p className="role__meta">
                {r.title}
                {r.location && <> · {r.location}</>}
              </p>
              <p className="role__line">{r.line}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="btn-row">
        {work.buttons.map((b) => (
          <LinkButton key={b.label} {...b} />
        ))}
      </div>
    </Page>
  );
}

function ProjectsPage() {
  return (
    <Page n={7} side="right" label="Projects" className="projects">
      <Label>{projects.label}</Label>
      <h2 className="headline headline--md">{projects.heading}</h2>
      <ul className="columns">
        {projects.items.map((m) => (
          <li key={m.name} className="column">
            <h3 className="column__name">{m.name}</h3>
            <p className="role__meta">{m.meta}</p>
            <p className="product__line">{m.line}</p>
            {'button' in m && m.button && <LinkButton {...m.button} variant="text" />}
          </li>
        ))}
      </ul>
    </Page>
  );
}

function StylePage() {
  return (
    <Page n={8} side="left" label="Fashion Scholarship Fund" className="style-page">
      <Label>{style.label}</Label>
      <h2 className="headline headline--md">{style.heading}</h2>
      <p className="prose">{style.body}</p>
      <ul className="cases">
        {style.caseStudies.map((c) => (
          <li key={c.year}>
            <a className="case" href={c.href} target="_blank" rel="noopener">
              <Img src={asset(c.img)} alt={`${c.year} Fashion Scholarship Fund case study: ${c.name}`} placeholder={c.img} className="case__img" />
              <span className="case__year">{c.year}</span>
              <span className="case__name">{c.name}</span>
            </a>
          </li>
        ))}
      </ul>
      <Label>{style.alsoLabel}</Label>
      <ul className="also">
        {style.also.map((a) => {
          const [role, org] = a.split(', ');
          return (
            <li key={a}>
              <span className="also__role">{role},</span> <span className="also__org">{org}</span>
            </li>
          );
        })}
      </ul>
    </Page>
  );
}

function ContactPage() {
  return (
    <Page n={9} side="right" label="Say Hi" className="contact-page">
      <Label>Say Hi</Label>
      <h2 className="headline headline--lg">{contact.heading}</h2>
      <p className="prose">{contact.body}</p>
      <div className="btn-row">
        {contact.buttons.map((b) => (
          <LinkButton key={b.label} {...b} variant="solid" />
        ))}
      </div>
    </Page>
  );
}

function BackCover() {
  return (
    <Page n={10} side="left" variant="burgundy" label="Back cover" folio={false} className="back">
      <p className="masthead masthead--back" aria-hidden="true">
        {contact.masthead}
      </p>
      <p className="back__footer">{contact.footer}</p>
      <Barcode code="SAYHI2026" />
    </Page>
  );
}

/** The ten pages of the issue, in order. */
export function issuePages(reduced: boolean): ReactElement[] {
  return [
    <Cover key="1" reduced={reduced} />,
    <ContentsPage key="2" />,
    <LetterPage key="3" />,
    <PosyStatsPage key="4" reduced={reduced} />,
    <PosyStoryPage key="5" />,
    <WorkPage key="6" />,
    <ProjectsPage key="7" />,
    <StylePage key="8" />,
    <ContactPage key="9" />,
    <BackCover key="10" />,
  ];
}
