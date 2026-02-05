"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const totalSpots = 200;
  const claimedSpots = Math.min(waitlistCount ?? 142, totalSpots);
  const progressPercent = Math.min(
    100,
    Math.round((claimedSpots / totalSpots) * 100)
  );

  const fetchWaitlistCount = async () => {
    try {
      const response = await fetch("/api/waitlist-count");
      const data = await response.json();
      if (!response.ok || typeof data?.count !== "number") {
        setWaitlistCount(null);
        return;
      }
      setWaitlistCount(data.count);
    } catch {
      setWaitlistCount(null);
    }
  };

  useEffect(() => {
    fetchWaitlistCount();
  }, []);

  return (
    <div className="min-h-screen text-[color:var(--text)]">
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-10 sm:pt-14">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-[0.24em] text-[color:var(--cyan-1)]">
            Kinetic
          </div>
          <div className="rounded-full border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.7)] px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--cyan-0)]">
            Private beta
          </div>
        </header>

        <section className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <div className="fade-up flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.7)] px-3 py-1 text-xs font-medium text-[color:var(--cyan-0)] shadow-[0_0_18px_rgba(0,224,224,0.18)]">
              The Future of Fitness
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[color:var(--text)] sm:text-5xl">
                Stop Guessing. Start Training.
              </h1>
              <p className="text-lg font-medium text-[color:rgba(234,251,255,0.78)] sm:text-xl">
                The Future of Fitness.
              </p>
              <p className="text-base leading-relaxed text-[color:rgba(234,251,255,0.72)] sm:text-lg">
                Kinetic fuses phone-camera biomechanics with wearable biometrics
                to create movement intelligence—real coaching, in real time.
              </p>
            </div>

            <div className="glass-card flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[color:var(--text)]">
                    Join the waitlist
                  </h2>
                  <p className="text-sm text-[color:rgba(234,251,255,0.68)]">
                    Early access is limited. We’ll reach out with next steps.
                  </p>
                </div>
                <div className="rounded-full border border-[color:rgba(0,224,224,0.6)] bg-[color:rgba(0,16,32,0.9)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--cyan-1)] shadow-[0_0_18px_rgba(0,224,224,0.35)]">
                  Founding 200
                </div>
              </div>

              {status !== "success" ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setStatus("submitting");
                    setErrorMessage("");

                    const formData = new FormData(event.currentTarget);
                    const email = String(formData.get("email") ?? "").trim();
                    const stageValue = String(formData.get("stage") ?? "").trim();

                    try {
                      const response = await fetch("/api/waitlist", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email,
                          stage: stageValue.length > 0 ? stageValue : null,
                        }),
                      });

                      const data = await response
                        .json()
                        .catch(() => ({ error: "Unknown error" }));

                      if (!response.ok || !data?.success) {
                        throw new Error(
                          data?.error || "Unable to join the waitlist."
                        );
                      }

                      setStatus("success");
                      await fetchWaitlistCount();
                    } catch (error) {
                      setStatus("error");
                      setErrorMessage(
                        error instanceof Error
                          ? error.message
                          : "Unable to join the waitlist."
                      );
                    }
                  }}
                >
                  <label className="flex flex-col gap-2 text-sm font-medium text-[color:rgba(234,251,255,0.7)]">
                    Email
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="you@domain.com"
                      className="h-11 rounded-xl border border-[color:rgba(0,224,224,0.35)] bg-transparent px-3 text-base text-[color:var(--text)] shadow-[0_0_16px_rgba(0,224,224,0.08)] outline-none transition focus:border-[color:rgba(0,224,224,0.8)] focus:ring-2 focus:ring-[color:rgba(0,224,224,0.35)]"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm font-medium text-[color:rgba(234,251,255,0.7)]">
                    Current Training Phase (optional)
                    <select
                      name="stage"
                      className="h-11 rounded-xl border border-[color:rgba(0,224,224,0.35)] bg-transparent px-3 text-base text-[color:var(--text)] shadow-[0_0_16px_rgba(0,224,224,0.08)] outline-none transition focus:border-[color:rgba(0,224,224,0.8)] focus:ring-2 focus:ring-[color:rgba(0,224,224,0.35)]"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a stage
                      </option>
                      <option value="Building Base">Building Base</option>
                      <option value="Performance">Performance</option>
                      <option value="Peaking">Peaking</option>
                      <option value="Recovering">Recovering</option>
                    </select>
                  </label>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="neon-hover h-11 rounded-xl border border-[color:rgba(0,224,224,0.6)] bg-[color:rgba(0,16,32,0.9)] text-sm font-semibold text-[color:var(--text)] shadow-[0_0_22px_rgba(0,224,224,0.2)] transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting"
                      ? "Submitting..."
                      : "Get Early Access"}
                  </button>

                  {status === "error" ? (
                    <p className="text-sm text-[color:rgba(255,160,160,0.95)]">
                      {errorMessage}
                    </p>
                  ) : null}
                </form>
              ) : (
                <div className="flex flex-col gap-3 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:rgba(0,224,224,0.2)] text-[color:var(--cyan-1)] shadow-[0_0_20px_rgba(0,224,224,0.4)]">
                    ✓
                  </div>
                  <h2 className="text-lg font-semibold text-[color:var(--text)]">
                    You’re on the list
                  </h2>
                  <p className="text-sm text-[color:rgba(234,251,255,0.68)]">
                    Thanks for joining. We’ll be in touch with your onboarding
                    window soon.
                  </p>
                </div>
              )}
            </div>

            <div className="glow-panel fade-up fade-delay-1 rounded-2xl border border-[color:rgba(0,224,224,0.45)] bg-[color:rgba(0,16,32,0.6)] px-4 py-3 text-sm font-medium text-[color:var(--cyan-1)] shadow-[0_0_28px_rgba(0,224,224,0.22)]">
              Founding 200 get 3 months free + priority onboarding
            </div>

            <div className="glass-card flex flex-col gap-3 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyan-1)]">
                {waitlistCount === null
                  ? "142 / 200 Founding Spots Claimed"
                  : `${claimedSpots} / ${totalSpots} Founding Spots Claimed`}
              </div>
              <div className="h-2 w-full rounded-full bg-[color:rgba(0,224,224,0.12)]">
                <div
                  className="progress-glow h-2 rounded-full bg-[color:var(--cyan-1)] transition-all duration-700"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
              {waitlistCount === null ? (
                <p className="text-xs text-[color:rgba(234,251,255,0.55)]">
                  Limited spots available.
                </p>
              ) : null}
            </div>
          </div>

          <div className="fade-up fade-delay-2 order-1 md:order-none">
            <div className="glass-card relative overflow-hidden p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,224,224,0.18),_transparent_60%)]" />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,10,24,0.6)] shadow-[0_0_24px_rgba(0,224,224,0.16)]">
                <Image
                  src="/kinetic-hero.png"
                  alt="Kinetic biomechanics visual"
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="fade-up flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:rgba(0,224,224,0.7)]">
              From Data to Insight
            </h2>
          </div>
          <div className="glass-card flex flex-col gap-6 p-6">
            <div className="flex flex-col items-center gap-4 text-sm text-[color:rgba(234,251,255,0.75)] sm:flex-row sm:justify-between">
              <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[color:rgba(0,224,224,0.25)] bg-[color:rgba(0,10,24,0.7)] px-4 py-4 text-center sm:w-[30%]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.8)] text-lg text-[color:var(--cyan-1)] shadow-[0_0_16px_rgba(0,224,224,0.25)]">
                  ❤️
                </span>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyan-1)]">
                  Wearable
                </div>
                <div className="text-sm font-semibold text-[color:var(--text)]">
                  Heart Rate / Recovery
                </div>
              </div>

              <div className="text-[color:rgba(0,224,224,0.8)]">→</div>

              <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[color:rgba(0,224,224,0.25)] bg-[color:rgba(0,10,24,0.7)] px-4 py-4 text-center sm:w-[30%]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.8)] text-lg text-[color:var(--cyan-1)] shadow-[0_0_16px_rgba(0,224,224,0.25)]">
                  📐
                </span>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyan-1)]">
                  Vision
                </div>
                <div className="text-sm font-semibold text-[color:var(--text)]">
                  Joint Angles / Bar Path
                </div>
              </div>

              <div className="text-[color:rgba(0,224,224,0.8)]">→</div>

              <div className="flex w-full flex-col items-center gap-2 rounded-2xl border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.8)] px-4 py-4 text-center shadow-[0_0_18px_rgba(0,224,224,0.18)] sm:w-[30%]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.8)] text-lg text-[color:var(--cyan-1)] shadow-[0_0_16px_rgba(0,224,224,0.25)]">
                  ✨
                </span>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyan-1)]">
                  Coaching Insight
                </div>
                <div className="text-sm font-semibold text-[color:var(--text)]">
                  Next Best Action
                </div>
              </div>
            </div>
            <p className="text-sm text-[color:rgba(234,251,255,0.68)]">
              Kinetic fuses internal state with external movement to tell you
              what to do next.
            </p>
          </div>
        </section>

        <section className="fade-up rounded-2xl border border-[color:rgba(0,224,224,0.2)] bg-[color:rgba(0,16,32,0.82)] p-6 shadow-[0_0_30px_rgba(0,224,224,0.12)]">
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:rgba(0,224,224,0.7)]">
              How it works
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "🎥",
                  title: "Capture",
                  text: "Film key movements with your phone.",
                },
                {
                  icon: "🧬",
                  title: "Fuse",
                  text: "Combine biomechanics with wearable signals.",
                },
                {
                  icon: "✨",
                  title: "Personalize",
                  text: "Get coaching tuned to your training stage.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="glass-card glow-step flex flex-col gap-3 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(0,224,224,0.35)] bg-[color:rgba(0,16,32,0.8)] text-lg text-[color:var(--cyan-1)] shadow-[0_0_18px_rgba(0,224,224,0.25)]">
                      {item.icon}
                    </span>
                    <div className="text-sm font-semibold text-[color:var(--text)]">
                      {item.title}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[color:rgba(234,251,255,0.68)]">
                    {item.text}
          </p>
        </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fade-up rounded-2xl border border-[color:rgba(0,224,224,0.2)] bg-[color:rgba(0,10,24,0.7)] p-6 shadow-[0_0_26px_rgba(0,224,224,0.12)]">
          <div className="flex flex-col gap-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:rgba(0,224,224,0.7)]">
              Movement Intelligence
            </h2>
            <div className="grid gap-3">
              {[
                "Detect form breakdown before it becomes injury.",
                "Tie fatigue + recovery to movement quality.",
                "Stage-aware cues that evolve with you.",
              ].map((item) => (
                <div
                  key={item}
                  className="glass-card flex items-center gap-3 px-4 py-3 text-sm text-[color:rgba(234,251,255,0.78)]"
                >
                  <span className="h-2 w-2 rounded-full bg-[color:var(--cyan-1)] shadow-[0_0_10px_rgba(0,224,224,0.7)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fade-up flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:rgba(0,224,224,0.7)]">
            Integrates with
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-wrap gap-4">
              {["Apple", "WHOOP", "ŌURA"].map((name) => (
                <div
                  key={name}
                  className="glass-card flex h-12 w-40 items-center justify-center text-sm font-semibold uppercase tracking-[0.3em] text-[color:rgba(234,251,255,0.9)]"
                >
                  {name}
                </div>
              ))}
            </div>
          </div>

            <div className="group flex items-center justify-center">
              <div className="rounded-2xl bg-[color:rgba(0,10,24,0.7)] px-4 py-3">
                <Image
                  src="/logos/whoop.png"
                  alt="WHOOP"
                  width={120}
                  height={24}
                  className="logo-glow h-5 w-auto opacity-85 transition group-hover:opacity-100 md:h-6"
                />
              </div>
            </div>

            <div className="group flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-2xl bg-[color:rgba(0,10,24,0.7)] px-5 py-3 text-[color:rgba(234,251,255,0.92)] transition group-hover:text-[color:var(--text)]">
                <div className="relative text-[15px] font-semibold tracking-[0.35em] md:text-[16px]">
                  <span className="absolute left-[0.12em] top-0 h-[2px] w-[0.9em] rounded-full bg-[color:rgba(0,224,224,0.8)]" />
                  ŌURA
                </div>
              </div>
            </div>
        </section>

        <footer className="fade-up mt-6 flex flex-col items-center gap-2 border-t border-[color:rgba(0,224,224,0.2)] pt-8 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--cyan-1)]">
            Kinetic
        </div>
          <p className="text-xs text-[color:rgba(234,251,255,0.6)]">
            Movement intelligence engineered for the next era of training.
          </p>
        </footer>
      </main>
    </div>
  );
}
