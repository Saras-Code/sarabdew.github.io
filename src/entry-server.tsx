import { renderToString } from 'react-dom/server';
import { issuePages } from './issue/Pages';

/** Static, single-column copy of the issue for crawlers and readers without JavaScript. */
export function render(): string {
  return renderToString(
    <div className="scroll prerender">
      {issuePages(true).map((p, i) => (
        <div className="scroll__page" key={i}>
          {p}
        </div>
      ))}
    </div>,
  );
}
