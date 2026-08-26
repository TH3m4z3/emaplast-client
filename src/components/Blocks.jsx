export default function Blocks({ content }) {
  const blocks = Array.isArray(content) ? content : [];
  return (
    <div className="journey">
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "p") return <p key={i}>{b.text}</p>;
        if (b.type === "ul") return (
          <ul key={i}>{(b.items || []).map((it) => <li key={it}>{it}</li>)}</ul>
        );
        if (b.type === "ol") return (
          <ol key={i}>{(b.items || []).map((it) => <li key={it}>{it}</li>)}</ol>
        );
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
