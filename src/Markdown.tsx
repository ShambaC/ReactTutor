import { Marked } from "marked";
import { cn } from "./ui";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const trusted = new Marked({ gfm: true, breaks: false });
// AI replies: raw HTML in the text is shown as text, never rendered
const safe = new Marked({ gfm: true, breaks: true, renderer: { html: (t) => esc(t.text) } });

/** Course text is trusted; anything from a model must pass `untrusted`. */
export default function Markdown({ text, untrusted, className }: { text: string; untrusted?: boolean; className?: string }) {
  const html = (untrusted ? safe : trusted).parse(text, { async: false }) as string;
  return <div className={cn("prose-rt", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
