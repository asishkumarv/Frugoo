import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Video as VideoIcon, Trash2, Save, FileVideo } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "frugoo_hero_videos";
const SLIDE_COUNT = 3;
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB safety cap for localStorage

type SlideState = {
  /** data URL (saved) */
  saved: string | null;
  /** data URL (preview, unsaved) */
  draft: string | null;
  fileName: string | null;
};

const emptySlides = (): SlideState[] =>
  Array.from({ length: SLIDE_COUNT }, () => ({ saved: null, draft: null, fileName: null }));

const HeroVideos = () => {
  const [slides, setSlides] = useState<SlideState[]>(emptySlides());
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    fetch('https://frugoo.onrender.com/api/hero-videos')
      .then(res => res.json())
      .then((videos: any[]) => {
        setSlides(
          Array.from({ length: SLIDE_COUNT }, (_, i) => {
            const video = videos.find(v => v.slideIndex === i);
            return {
              saved: video ? video.saved : null,
              draft: null,
              fileName: video && video.fileName ? video.fileName : (video ? `Slide ${i + 1} video` : null),
            };
          })
        );
      })
      .catch(err => console.error(err));
  }, []);

  const handleFile = async (idx: number, file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please upload a video file (MP4 recommended).");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error(`Video too large. Max ${MAX_BYTES / 1024 / 1024} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSlides((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], draft: dataUrl, fileName: file.name };
        return next;
      });
      toast.success(`Loaded ${file.name} for Slide ${idx + 1}. Click Save to apply.`);
    };
    reader.onerror = () => toast.error("Failed to read video file.");
    reader.readAsDataURL(file);
  };

  const saveSlide = async (idx: number) => {
    const draft = slides[idx].draft;
    const fileName = slides[idx].fileName;
    if (!draft) return;
    try {
      await fetch('https://frugoo.onrender.com/api/hero-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideIndex: idx, saved: draft, fileName })
      });
      setSlides((prev) => {
        const next = [...prev];
        next[idx] = { saved: draft, draft: null, fileName };
        return next;
      });
      toast.success(`Slide ${idx + 1} saved. The homepage will use this video.`);
    } catch (err) {
      toast.error("Could not save to backend. Try a smaller video.");
    }
  };

  const removeSlide = async (idx: number) => {
    try {
      await fetch(`https://frugoo.onrender.com/api/hero-videos/${idx}`, { method: 'DELETE' });
      setSlides((prev) => {
        const next = [...prev];
        next[idx] = { saved: null, draft: null, fileName: null };
        return next;
      });
      if (inputRefs.current[idx]) inputRefs.current[idx]!.value = "";
      toast.success(`Slide ${idx + 1} cleared`);
    } catch (err) {
      toast.error("Failed to clear slide");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Hero Videos</h1>
        <p className="text-muted-foreground text-sm">
          Upload, preview and replace the 3 videos shown in the homepage hero carousel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {slides.map((slide, idx) => {
          const previewSrc = slide.draft ?? slide.saved;
          const hasDraft = !!slide.draft;

          return (
            <div key={idx} className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <VideoIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Slide {idx + 1}</div>
                    <div className="text-xs text-muted-foreground">
                      {slide.fileName ?? "No video uploaded"}
                    </div>
                  </div>
                </div>
                {hasDraft && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">
                    Unsaved
                  </span>
                )}
              </div>

              <div className="aspect-video bg-muted relative flex items-center justify-center">
                {previewSrc ? (
                  <video
                    key={previewSrc}
                    src={previewSrc}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <FileVideo className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No video yet</p>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-wrap gap-2">
                <input
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="file"
                  accept="video/mp4,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(idx, f);
                  }}
                />
                <Button
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                  onClick={() => inputRefs.current[idx]?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {slide.saved || slide.draft ? "Replace" : "Upload MP4"}
                </Button>
                <Button
                  className="flex-1 min-w-[100px] text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                  disabled={!hasDraft}
                  onClick={() => saveSlide(idx)}
                >
                  <Save className="w-4 h-4 mr-2" /> Save
                </Button>
                {(slide.saved || slide.draft) && (
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeSlide(idx)}
                    aria-label={`Remove slide ${idx + 1} video`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">How it works:</strong> Videos are stored in this admin
          panel and consumed by the website homepage via the
          <code className="mx-1 px-1.5 py-0.5 rounded bg-card text-foreground border border-border">
            frugoo_hero_videos
          </code>
          key. Use MP4 for best browser support. Keep clips under 15 MB each for smooth playback.
        </p>
      </div>
    </div>
  );
};

export default HeroVideos;
