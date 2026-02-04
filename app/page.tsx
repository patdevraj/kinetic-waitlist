"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-6 pb-20 pt-10 sm:pt-14">
        <header className="flex items-center justify-between">
          <div className="text-lg font-semibold tracking-tight">Kinetic</div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            Private beta
          </div>
        </header>

        <section className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            Founding 200 get 3 months free + priority onboarding
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Movement intelligence, built for humans.
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Kinetic fuses phone-camera biomechanics and wearable data to
              deliver stage-aware coaching.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              How it works
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Capture",
                  text: "Film key movements with your phone.",
                },
                {
                  title: "Fuse",
                  text: "Combine biomechanics with wearable signals.",
                },
                {
                  title: "Personalize",
                  text: "Get coaching tuned to your training stage.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Integrations
          </h2>
          <div className="flex flex-wrap gap-3">
            {["Apple Watch", "WHOOP", "Oura"].map((name) => (
              <span
                key={name}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
              >
                {name}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {status !== "success" ? (
            <form
              className="flex flex-col gap-5"
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
                    throw new Error(data?.error || "Unable to join the waitlist.");
                  }

                  setStatus("success");
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
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  Join the waitlist
                </h2>
                <p className="text-sm text-slate-600">
                  Early access is limited. We’ll reach out with next steps.
                </p>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@domain.com"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                Training stage (optional)
                <select
                  name="stage"
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a stage
                  </option>
                  <option value="building">Building base</option>
                  <option value="intensifying">Intensifying</option>
                  <option value="peaking">Peaking</option>
                  <option value="recovering">Recovering</option>
                </select>
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="h-11 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {status === "submitting" ? "Submitting..." : "Request access"}
              </button>

              {status === "error" ? (
                <p className="text-sm text-rose-600">{errorMessage}</p>
              ) : null}
            </form>
          ) : (
            <div className="flex flex-col gap-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                You’re on the list
              </h2>
              <p className="text-sm text-slate-600">
                Thanks for joining. We’ll be in touch with your onboarding
                window soon.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
