import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Admin from "./Admin";

import {
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Loader2,
} from "lucide-react";

function WeddingHome() {
  const weddingDate = new Date("2026-10-03T14:00:00+00:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    attending: "yes",
    guests: "1",
    message: "",
  });

  // =========================
  // COUNTDOWN
  // =========================
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      setTimeLeft({
        days: Math.floor(
          difference / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (difference / (1000 * 60 * 60)) % 24
        ),
        minutes: Math.floor(
          (difference / (1000 * 60)) % 60
        ),
        seconds: Math.floor(
          (difference / 1000) % 60
        ),
      });
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  // =========================
  // FORM HANDLER
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // =========================
  // SUBMIT RSVP
  // =========================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) {
    return;
  }

  setIsSubmitting(true);
  setErrorMessage("");

  try {
    const apiUrl = import.meta.env.VITE_API_URL;

    console.log("API URL:", apiUrl);

    if (!apiUrl) {
      throw new Error(
        "The RSVP service is not configured correctly."
      );
    }

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/rsvp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          attending: form.attending,
          guests: Number(form.guests),
          message: form.message.trim(),
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    console.log("RSVP status:", response.status);
    console.log("RSVP response:", data);

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "We could not submit your RSVP."
      );
    }

    // SUCCESS
    setSubmitted(true);

    setForm({
      name: "",
      phone: "",
      attending: "yes",
      guests: "1",
      message: "",
    });
  } catch (error) {
    console.error("RSVP submission error:", error);

    setErrorMessage(
      error.message ||
        "Sorry, we could not submit your RSVP. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  // =========================
  // RESET RSVP
  // =========================
  const submitAnotherRSVP = () => {
    setSubmitted(false);
    setErrorMessage("");

    window.scrollTo({
      top:
        document.getElementById("rsvp")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  // =========================
  // NAVIGATION
  // =========================
  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
      });

    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f4faf6] text-green-950">
      {/* =========================================
          NAVBAR
      ========================================= */}
      <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-700 text-green-800">
              <Heart size={19} fill="currentColor" />
            </div>

            <div>
              <p className="font-serif text-lg font-semibold text-green-900">
                Alfred & Pearl
              </p>

              <p className="text-[9px] uppercase tracking-[0.3em] text-green-600">
                Our Wedding
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {[
              ["Home", "home"],
              ["Our Story", "story"],
              ["Details", "details"],
              ["Location", "location"],
              ["RSVP", "rsvp"],
            ].map(([label, id]) => (
              <button
                type="button"
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-sm font-medium text-green-900 transition hover:text-green-600"
              >
                {label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => scrollToSection("rsvp")}
              className="flex items-center gap-2 rounded-full bg-green-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-900"
            >
              <MessageCircle size={16} />
              RSVP
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-green-900 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="border-t border-green-100 bg-white px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              {[
                ["Home", "home"],
                ["Our Story", "story"],
                ["Details", "details"],
                ["Location", "location"],
                ["RSVP", "rsvp"],
              ].map(([label, id]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-left text-sm font-medium text-green-900"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* =========================================
          MAIN INVITATION CARD
      ========================================= */}
      <main className="mx-auto max-w-6xl overflow-hidden bg-white shadow-xl">
        {/* =========================================
            HERO
        ========================================= */}
        <section
          id="home"
          className="relative overflow-hidden px-5 py-12 sm:px-10 sm:py-16 lg:px-16"
        >
          <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-green-100/60 blur-3xl" />

          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-green-100/60 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* Hero Text */}
            <div className="text-center lg:text-left">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.45em] text-green-600">
                Together Forever
              </p>

              <h1 className="font-serif text-6xl leading-none text-green-900 sm:text-7xl lg:text-8xl">
                Alfred

                <span className="mx-3 block text-4xl font-normal text-green-500 sm:inline">
                  &
                </span>

                Pearl
              </h1>

              <p className="mt-7 text-sm font-medium uppercase tracking-[0.35em] text-green-800">
                Are Getting Married
              </p>

              <div className="mx-auto mt-8 h-px w-24 bg-green-300 lg:mx-0" />

              <div className="mt-8 flex flex-col items-center gap-4 text-green-900 sm:flex-row sm:justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="text-green-700"
                    size={21}
                  />

                  <div className="text-left">
                    <p className="font-semibold">
                      Saturday, 03 October 2026
                    </p>

                    <p className="text-sm text-gray-500">
                      2:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <p className="mx-auto mt-8 max-w-md font-serif text-lg italic leading-8 text-green-700 lg:mx-0">
                You are warmly invited to share in
                our special day as we begin this
                beautiful journey together.
              </p>

              <button
                type="button"
                onClick={() => scrollToSection("rsvp")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-green-800 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-green-900"
              >
                <Heart size={17} fill="currentColor" />
                RSVP Now
              </button>
            </div>

            {/* Hero Image */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -bottom-5 -left-5 h-full w-full rounded-3xl border-2 border-green-200" />

              <img
                src="/wed.jpg"
                alt="Wedding couple"
                className="relative h-[480px] w-full rounded-3xl object-cover shadow-xl sm:h-[560px]"
              />

              <div className="absolute -bottom-5 -right-5 flex h-24 w-24 items-center justify-center rounded-full bg-white p-3 shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-full border border-green-200 text-center">
                  <Heart
                    size={24}
                    className="text-green-700"
                    fill="currentColor"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            COUNTDOWN
        ========================================= */}
        <section className="px-5 pb-12 sm:px-10">
          <div className="rounded-3xl bg-green-50 px-4 py-10 sm:px-10">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Countdown To Our Big Day
              </p>

              <h2 className="mt-3 font-serif text-2xl text-green-900 sm:text-3xl">
                The wait is almost over
              </h2>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Days", timeLeft.days],
                ["Hours", timeLeft.hours],
                ["Minutes", timeLeft.minutes],
                ["Seconds", timeLeft.seconds],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white px-4 py-5 text-center shadow-sm"
                >
                  <p className="font-serif text-3xl font-semibold text-green-800 sm:text-4xl">
                    {String(value).padStart(2, "0")}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            OUR STORY
        ========================================= */}
        <section
          id="story"
          className="scroll-mt-24 px-5 py-12 sm:px-10 lg:px-16"
        >
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl bg-green-100" />

              <img
                src="/wed2.jpg"
                alt="Wedding rings"
                className="relative h-80 w-full rounded-3xl object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Our Story
              </p>

              <h2 className="mt-3 font-serif text-4xl text-green-900">
                Alfred & Pearl
              </h2>

              <div className="mt-5 whitespace-pre-line leading-8 text-gray-600">
                {`Our Story,

Our journey to this day has not been easy.
Our story was written not only in beautiful moments, but also through tears, challenges, waiting, uncertainty, and countless prayers. There were moments when we wondered if we would make it this far.
But through every season, God remained faithful.
When we couldn't understand what He was doing, He was preparing us. When we thought some chapters were coming to an end, God was simply turning the page.
Our journey taught us that love is not about having a perfect story. It is about choosing each other through the difficult seasons, giving grace, forgiving, praying, and trusting God together.
Today, as we stand before God and our loved ones, we realize that every challenge was part of our testimony.
We are not here because the journey was easy. We are here because God was faithful.
And to anyone reading our story who may be going through a difficult season: don't give up.
Your current chapter may be painful, but it is not the end of your story. Keep praying. Keep believing. Keep trusting God.
Because sometimes, the most beautiful part of your story is the chapter you haven't reached yet.
Today, we look at our journey with grateful hearts and simply say:
“Look what the Lord has done.”
Alfred & Pearl`}
              </div>

              <div className="mt-7 flex items-center gap-4">
                <div className="h-px w-16 bg-green-300" />

                <Heart
                  size={17}
                  className="text-green-700"
                  fill="currentColor"
                />

                <div className="h-px w-16 bg-green-300" />
              </div>

              <p className="mt-5 font-serif text-lg italic text-green-700">
                Same love, new chapter.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            WEDDING DETAILS
        ========================================= */}
        <section
          id="details"
          className="scroll-mt-24 bg-green-50 px-5 py-14 sm:px-10 lg:px-16"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
              Save The Date
            </p>

            <h2 className="mt-3 font-serif text-4xl text-green-900">
              Wedding Details
            </h2>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
            {/* Date */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <CalendarDays
                className="mx-auto text-green-700"
                size={30}
              />

              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Date
              </p>

              <p className="mt-2 font-serif text-lg text-green-900">
                Saturday
              </p>

              <p className="text-sm text-gray-600">
                03 October 2026
              </p>
            </div>

            {/* Time */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <Clock3
                className="mx-auto text-green-700"
                size={30}
              />

              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Time
              </p>

              <p className="mt-2 font-serif text-lg text-green-900">
                2:00 PM
              </p>

              <p className="text-sm text-gray-600">
                Ceremony & Celebration
              </p>
            </div>

            {/* Venue */}
            <div className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <MapPin
                className="mx-auto text-green-700"
                size={30}
              />

              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Venue
              </p>

              <p className="mt-2 font-serif text-lg text-green-900">
                E-Mens Guest House
              </p>

              <p className="text-sm text-gray-600">
                Teshie Agblizaa, Accra
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            LOCATION
        ========================================= */}
        <section
          id="location"
          className="scroll-mt-24 px-5 py-14 sm:px-10 lg:px-16"
        >
          <div className="grid overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm lg:grid-cols-2">
            {/* Map */}
            <div className="h-80 bg-green-100 lg:h-full">
              <iframe
                title="Wedding Venue Map"
                src="https://www.google.com/maps?q=E-Mens%20Guest%20House%20%26%20Events%20Centre%2C%20Teshie%20Agblizaa%2C%20Accra%2C%20Ghana&output=embed"
                className="h-full min-h-[320px] w-full border-0"
                loading="lazy"
              />
            </div>

            {/* Location Details */}
            <div className="p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Our Venue
              </p>

              <h2 className="mt-3 font-serif text-3xl text-green-900">
                E-Mens Guest House & Events Centre
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Ebenezer, Teshie Agblizaa,
                <br />
                Accra, Ghana
              </p>

              <p className="mt-6 leading-7 text-gray-600">
                We can't wait to celebrate with you
                at this beautiful venue. Your presence
                will make our special day even more
                memorable.
              </p>

              <a
                href="https://www.google.com/maps/search/?api=1&query=E-Mens+Guest+House+%26+Events+Centre+Teshie+Agblizaa+Accra+Ghana"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-green-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                <Navigation size={17} />
                Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* =========================================
            RSVP
        ========================================= */}
        <section
          id="rsvp"
          className="scroll-mt-24 bg-green-50 px-5 py-14 sm:px-10 lg:px-16"
        >
          <div className="grid gap-10 lg:grid-cols-2">
            {/* RSVP Intro */}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-green-600">
                Kindly RSVP
              </p>

              <h2 className="mt-4 font-serif text-4xl leading-tight text-green-900 sm:text-5xl">
                We look forward to celebrating with you!
              </h2>

              <p className="mt-5 max-w-md leading-7 text-gray-600">
                Please let us know if you will be
                joining us as we celebrate this
                beautiful beginning.
              </p>

              <div className="mt-7 flex w-fit items-center gap-3 rounded-full border-2 border-green-700 bg-white px-6 py-3 font-semibold text-green-800">
                <MessageCircle size={20} />
                We would love to celebrate with you
              </div>

              <div className="mt-7 space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-3">
                  <Phone
                    size={17}
                    className="text-green-700"
                  />
                  Jake: 0550993838
                </p>

                <p className="flex items-center gap-3">
                  <Phone
                    size={17}
                    className="text-green-700"
                  />
                  Priscilla: 0241544076
                </p>

                <p className="flex items-center gap-3">
                  <Phone
                    size={17}
                    className="text-green-700"
                  />
                  Edith: 0207927297
                </p>
              </div>
            </div>

            {/* RSVP Form / Success */}
            <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
              {!submitted ? (
                <>
                  <h3 className="font-serif text-2xl text-green-900">
                    Confirm Your Attendance
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Kindly fill in your details below.
                  </p>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-900">
                        Full Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-900">
                        Phone Number *
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter your phone number"
                        className="w-full rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {/* Attending */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-green-900">
                          Attending?
                        </label>

                        <div className="relative">
                          <select
                            name="attending"
                            value={form.attending}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full appearance-none rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value="yes">
                              Yes, I'll be there
                            </option>

                            <option value="no">
                              Sorry, I can't attend
                            </option>
                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                        </div>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-green-900">
                          Number of Guests
                        </label>

                        <div className="relative">
                          <select
                            name="guests"
                            value={form.guests}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="w-full appearance-none rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm outline-none focus:border-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <option value="1">
                              1 Guest
                            </option>

                            <option value="2">
                              2 Guests
                            </option>

                            <option value="3">
                              3 Guests
                            </option>

                          

                           
                          </select>

                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-green-900">
                        Message
                      </label>

                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows="4"
                        disabled={isSubmitting}
                        placeholder="Leave us a message..."
                        className="w-full resize-none rounded-xl border border-green-100 bg-green-50/50 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                          Submitting RSVP...
                        </>
                      ) : (
                        <>
                          <Send size={17} />
                          Submit 
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* =====================================
                   RSVP SUCCESS
                ===================================== */
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2
                      size={48}
                      className="text-green-700"
                    />
                  </div>

                  <h3 className="mt-7 font-serif text-3xl text-green-900">
                    Thank You!
                  </h3>

                  <p className="mt-4 max-w-md text-lg leading-7 text-green-800">
                    Thank you for celebrating with us.
                    We would love to see you there!
                  </p>

                 

                  <div className="mt-7 flex items-center gap-3 text-green-700">
                    <Heart
                      size={18}
                      fill="currentColor"
                    />

                    <span className="font-serif text-lg italic">
                      Alfred & Pearl
                    </span>

                    <Heart
                      size={18}
                      fill="currentColor"
                    />
                  </div>

                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gray-400">
                    03 October 2026
                  </p>

                  <button
                    type="button"
                    onClick={submitAnotherRSVP}
                    className="mt-8 rounded-full border border-green-700 px-6 py-3 text-sm font-semibold text-green-800 transition hover:bg-green-800 hover:text-white"
                  >
                    Submit Another RSVP
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            FOOTER
        ========================================= */}
        <footer className="px-5 py-10 text-center">
          <div className="mx-auto flex max-w-md items-center justify-center gap-4">
            <div className="h-px flex-1 bg-green-200" />

            <Heart
              size={17}
              className="text-green-700"
              fill="currentColor"
            />

            <div className="h-px flex-1 bg-green-200" />
          </div>

          <p className="mt-5 font-serif text-lg italic text-green-700">
            With God’s guidance, love wins.
          </p>

          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gray-400">
            Alfred & Pearl • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<WeddingHome />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />
    </Routes>
  );
}