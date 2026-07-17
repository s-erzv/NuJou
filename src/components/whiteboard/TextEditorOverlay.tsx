import { useEffect, useRef } from 'react';

interface TextEditorOverlayProps {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  value: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}

export default function TextEditorOverlay({
  x,
  y,
  width,
  fontSize,
  value,
  onCommit,
  onCancel,
}: TextEditorOverlayProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  return (
    <textarea
      ref={ref}
      defaultValue={value}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width,
        fontSize,
        fontFamily: 'Inter, sans-serif',
        border: '1px solid #7679b7',
        borderRadius: 6,
        padding: 4,
        background: 'white',
        color: '#0f172a',
        resize: 'none',
        outline: 'none',
        zIndex: 50,
      }}
      onBlur={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        }
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          onCommit((e.target as HTMLTextAreaElement).value);
        }
      }}
    />
  );
}
