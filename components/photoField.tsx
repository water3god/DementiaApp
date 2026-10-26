"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonAvatar from "@/components/personAvatar";
import { MAX_PHOTO_MB, PHOTO_TYPES } from "@/lib/photos";

// Submits the chosen file as "photo", or "removePhoto" when the current one is cleared.
export default function PhotoField({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(undefined);
    if (!file) return setPreview(undefined);
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      event.target.value = "";
      setPreview(undefined);
      return setError(`Please choose a photo under ${MAX_PHOTO_MB} MB.`);
    }
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  }

  function remove() {
    if (input.current) input.current.value = "";
    setPreview(undefined);
    setRemoved(true);
    setError(undefined);
  }

  const shown = preview ?? (removed ? undefined : photoUrl);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Photo</span>
      <div className="flex items-center gap-3">
        <PersonAvatar name={name || "?"} photoUrl={shown} className="size-16" />
        <input
          ref={input}
          id="photo"
          name="photo"
          type="file"
          accept={PHOTO_TYPES.join(",")}
          className="sr-only"
          onChange={choose}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}>
          <ImagePlus data-icon="inline-start" />
          {shown ? "Change" : "Add photo"}
        </Button>
        {shown && (
          <Button type="button" variant="ghost" size="sm" onClick={remove}>
            <X data-icon="inline-start" />
            Remove
          </Button>
        )}
        {removed && <input type="hidden" name="removePhoto" value="1" />}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
