import dynamic from 'next/dynamic';
import { LegacyRef, useRef, useState } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import { Save } from 'lucide-react';

type QuillJSProps = {
  forwardedRef: LegacyRef<ReactQuill>;
} & ReactQuillProps;

const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');

    const QuillJS = ({ forwardedRef, ...rest }: QuillJSProps) => (
      <RQ ref={forwardedRef} {...rest} />
    );
    return QuillJS;
  },
  { ssr: false }
);

const modules = {
  toolbar: [
    [{ size: [] }],
    ['bold', 'italic'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [
      { align: '' },
      { align: 'center' },
      { align: 'right' },
      { align: 'justify' },
    ],
  ],
};

const formats = ['bold', 'italic', 'list', 'bullet', 'indent', 'align', 'size'];

const limitOfChars = 700;

export function RichText() {
  const [value, setValue] = useState('');
  const [currentCharsLength, setCurrentCharsLength] = useState(0);

  const quillRef = useRef<ReactQuill>(null);

  const remainingChars = limitOfChars - currentCharsLength;

  function checkCharacterCount(event: KeyboardEvent) {
    if (quillRef.current?.unprivilegedEditor) {
      const unprivilegedEditor = quillRef.current?.unprivilegedEditor;
      const currentLength = unprivilegedEditor.getLength();

      if (currentLength > limitOfChars && event.key !== 'Backspace') {
        event.preventDefault();
        return;
      }

      if (event.ctrlKey && event.key === 'v') {
        event.preventDefault();
        return;
      }
    }
  }

  function handleText(text: string) {
    if (quillRef.current?.unprivilegedEditor) {
      const unprivilegedEditor = quillRef.current?.unprivilegedEditor;
      const currentLengthDiffWhiteSpace =
        unprivilegedEditor.getLength() - 1 ?? 0;
      setCurrentCharsLength(() => currentLengthDiffWhiteSpace);
      setValue(text);
    }
  }

  return (
    <div className="w-full">
      <QuillNoSSRWrapper
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={handleText}
        onKeyDown={checkCharacterCount}
        forwardedRef={quillRef}
        placeholder="Digite aqui a sua mensagem."
      />

      <div className="mt-5 flex items-center justify-between">
        <span>
          {remainingChars}{' '}
          {remainingChars > 1 ? 'caracteres restantes' : 'caractere restante'}
        </span>

        <button
          type="submit"
          className="w-max bg-leaf py-3 px-4 rounded hover:brightness-90 transition-colors "
          // disabled={isSubmitting}
        >
          {/* {isSubmitting ? (
          <Spinner />
        ) : ( */}
          <span className="flex items-center gap-2 text-white">
            <Save strokeWidth={1} /> Salvar
          </span>
          {/* )} */}
        </button>
      </div>
    </div>
  );
}
