import { cn } from '@/lib/utils';

const Prose = ({ html, className }: { html: string; className?: string }) => {
  return (
    <div
      className={cn(
        'prose text-xs leading-tight max-w-6xl text-foreground',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
