"use client";

import * as React from "react";
import { Loader2, Send, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useChannel } from "@/hooks/use-channel";
import { cn } from "@/lib/utils";

/**
 * Threaded comments with @mentions and live updates. Composes the
 * existing realtime stack — `useChannel` listens for `comment.created`
 * / `comment.deleted` so every viewer sees new comments without
 * polling. Suggestion picker is keyboard-driven (↑↓ then Enter).
 *
 *   <CommentsThread
 *     channelName={`doc-${docId}`}
 *     me={{ id: user.id, name: user.name, avatarUrl: user.image }}
 *     loadComments={async () => fetch(`/api/docs/${docId}/comments`).then(r => r.json())}
 *     createComment={async (body, mentions) => (await fetch(`/api/docs/${docId}/comments`, {
 *       method: "POST",
 *       body: JSON.stringify({ body, mentions }),
 *     })).json()}
 *     deleteComment={async (id) => { await fetch(`/api/comments/${id}`, { method: "DELETE" }); }}
 *     searchMentions={async (q) => fetch(`/api/users/search?q=${q}`).then(r => r.json())}
 *   />
 *
 * Mentions are stored as `@[Name](userId)` in the raw body so they
 * survive edits and lookups; the renderer formats them back into
 * clickable badges.
 */

export interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt: string | Date;
  canDelete?: boolean;
}

interface CommentsThreadProps {
  channelName: string;
  me: CommentAuthor;
  loadComments: () => Promise<Comment[]>;
  createComment: (body: string, mentions: string[]) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
  searchMentions: (query: string) => Promise<CommentAuthor[]>;
  className?: string;
}

const MENTION_REGEX = /@\[([^\]]+)\]\(([^)]+)\)/g;

export function CommentsThread({
  channelName,
  me,
  loadComments,
  createComment,
  deleteComment,
  searchMentions,
  className,
}: CommentsThreadProps) {
  const qc = useQueryClient();
  const queryKey = ["comments", channelName] as const;

  const { data: comments = [], isLoading } = useQuery({ queryKey, queryFn: loadComments });

  const channel = useChannel(channelName);

  React.useEffect(() => {
    const offCreated = channel.subscribe<{ id: string }>("comment.created", () => {
      qc.invalidateQueries({ queryKey });
    });
    const offDeleted = channel.subscribe<{ id: string }>("comment.deleted", () => {
      qc.invalidateQueries({ queryKey });
    });
    return () => {
      offCreated();
      offDeleted();
    };
  }, [channel, qc, queryKey]);

  const create = useMutation({
    mutationFn: async (input: { body: string; mentions: string[] }) => {
      const c = await createComment(input.body, input.mentions);
      void channel.publish("comment.created", { id: c.id });
      return c;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await deleteComment(id);
      void channel.publish("comment.deleted", { id });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <ul className="space-y-3">
        {isLoading ? (
          <li className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
          </li>
        ) : comments.length === 0 ? (
          <li className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            No comments yet — start the conversation.
          </li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar className="h-7 w-7">
                <AvatarImage src={c.author.avatarUrl ?? undefined} />
                <AvatarFallback>{initials(c.author.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                  </span>
                  {c.canDelete ? (
                    <button
                      type="button"
                      onClick={() => remove.mutate(c.id)}
                      className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  ) : null}
                </div>
                <div className="mt-1 text-sm leading-relaxed text-foreground">{renderBody(c.body)}</div>
              </div>
            </li>
          ))
        )}
      </ul>

      <Composer me={me} searchMentions={searchMentions} onSubmit={(body, mentions) => create.mutate({ body, mentions })} pending={create.isPending} />
    </div>
  );
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function renderBody(body: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  body.replace(MENTION_REGEX, (match, name: string, id: string, offset: number) => {
    if (offset > lastIndex) parts.push(body.slice(lastIndex, offset));
    parts.push(
      <span key={`${id}-${offset}`} className="rounded bg-primary/10 px-1 py-0.5 text-xs font-medium text-primary">
        @{name}
      </span>,
    );
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < body.length) parts.push(body.slice(lastIndex));
  return parts;
}

interface ComposerProps {
  me: CommentAuthor;
  searchMentions: (q: string) => Promise<CommentAuthor[]>;
  onSubmit: (body: string, mentions: string[]) => void;
  pending: boolean;
}

function Composer({ me, searchMentions, onSubmit, pending }: ComposerProps) {
  const [value, setValue] = React.useState("");
  const [mentionQuery, setMentionQuery] = React.useState<string | null>(null);
  const [suggestions, setSuggestions] = React.useState<CommentAuthor[]>([]);
  const [hoverIndex, setHoverIndex] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (mentionQuery === null) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    searchMentions(mentionQuery).then((result) => {
      if (!cancelled) {
        setSuggestions(result);
        setHoverIndex(0);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mentionQuery, searchMentions]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const next = e.target.value;
    setValue(next);
    const cursor = e.target.selectionStart;
    const upTo = next.slice(0, cursor);
    const match = upTo.match(/(?:^|\s)@(\w*)$/);
    setMentionQuery(match ? match[1] : null);
  }

  function pickMention(user: CommentAuthor): void {
    setValue((prev) => {
      const ta = textareaRef.current;
      if (!ta) return prev;
      const cursor = ta.selectionStart;
      const upTo = prev.slice(0, cursor);
      const after = prev.slice(cursor);
      const replaced = upTo.replace(/@\w*$/, `@[${user.name}](${user.id}) `);
      return replaced + after;
    });
    setMentionQuery(null);
    textareaRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (mentionQuery !== null && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHoverIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHoverIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && !e.shiftKey) {
        const picked = suggestions[hoverIndex];
        if (picked) {
          e.preventDefault();
          pickMention(picked);
        }
      } else if (e.key === "Escape") {
        setMentionQuery(null);
      }
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  }

  function submit(): void {
    const body = value.trim();
    if (!body) return;
    const mentions: string[] = [];
    body.replace(MENTION_REGEX, (_, _name, id: string) => {
      mentions.push(id);
      return "";
    });
    onSubmit(body, mentions);
    setValue("");
  }

  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7">
        <AvatarImage src={me.avatarUrl ?? undefined} />
        <AvatarFallback>{initials(me.name)}</AvatarFallback>
      </Avatar>
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          rows={2}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder="Add a comment… use @ to mention"
          className="w-full resize-none rounded-md border border-border bg-background p-2 text-sm focus:border-foreground/40 focus:outline-none focus:ring-0"
        />
        {mentionQuery !== null && suggestions.length > 0 ? (
          <div className="absolute left-0 z-10 mt-1 w-64 rounded-md border border-border bg-popover shadow-md">
            {suggestions.map((user, i) => (
              <button
                key={user.id}
                type="button"
                onClick={() => pickMention(user)}
                onMouseEnter={() => setHoverIndex(i)}
                className={cn(
                  "flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm",
                  i === hoverIndex ? "bg-muted" : "hover:bg-muted",
                )}
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={user.avatarUrl ?? undefined} />
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>⌘ + Enter to send</span>
          <Button size="sm" onClick={submit} disabled={!value.trim() || pending}>
            {pending ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Send className="mr-1.5 h-3 w-3" />}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
