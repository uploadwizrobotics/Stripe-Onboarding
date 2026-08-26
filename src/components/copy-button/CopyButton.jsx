import { useClipboard } from '../../hooks/useClipboard';
import { Button } from '../button';

/** Copies `value` and flips its label while the confirmation shows. */
export function CopyButton({ value, onCopied, label = 'Copy' }) {
  const { copied, copy } = useClipboard();

  const handleClick = async (event) => {
    event.stopPropagation();
    await copy(value);
    onCopied?.();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleClick}>
      {copied ? 'Copied' : label}
    </Button>
  );
}
