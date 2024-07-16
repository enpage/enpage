type EditorProps = {
  htmlDoc: string;
};

export function Editor(props: EditorProps) {
  return (
    <div>
      <header>
        <h1>Editor</h1>
      </header>
      <iframe title="Site Preview" srcDoc={props.htmlDoc} />
    </div>
  );
}
