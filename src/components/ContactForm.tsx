"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const TRANSLATIONS = {
  es: {
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono",
    subject: "Asunto",
    message: "Mensaje",
    submit: "Enviar mensaje →",
    subjects: ["Cotización de productos", "Información de productos", "Asesoría de instalación", "Agendar visita al showroom", "Otro"],
    defaultSubject: "Cotización de productos",
    errorName: "Ingresa tu nombre",
    errorEmail: "Ingresa un correo válido",
    errorMessage: "Escribe tu mensaje",
    successTitle: "Mensaje enviado",
    successBody: "Tu cliente de correo se abrió con el mensaje listo. Te responderemos a la brevedad.",
    successAgain: "Enviar otro mensaje",
    hint: "Al enviar abres tu cliente de correo con el mensaje listo. También puedes escribirnos directamente a",
  },
  en: {
    name: "Name",
    email: "Email address",
    phone: "Phone",
    subject: "Subject",
    message: "Message",
    submit: "Send message →",
    subjects: ["Product quote", "Product information", "Installation advice", "Schedule a showroom visit", "Other"],
    defaultSubject: "Product quote",
    errorName: "Please enter your name",
    errorEmail: "Please enter a valid email",
    errorMessage: "Please write your message",
    successTitle: "Message sent",
    successBody: "Your email client opened with the message ready. We will get back to you shortly.",
    successAgain: "Send another message",
    hint: "Sending will open your email client with the message ready. You can also email us directly at",
  },
};

export default function ContactForm({ locale = "es" }: { locale?: string }) {
  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] ?? TRANSLATIONS.es;
  const INITIAL: FormState = { name: "", email: "", phone: "", subject: t.defaultSubject, message: "" };

  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = t.errorName;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.errorEmail;
    if (!form.message.trim()) e.message = t.errorMessage;
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const body = [
      `${t.name}: ${form.name}`,
      `${t.email}: ${form.email}`,
      form.phone ? `${t.phone}: ${form.phone}` : null,
      `${t.subject}: ${form.subject}`,
      "",
      form.message,
    ].filter(Boolean).join("\n");

    const mailto = `mailto:manager@aydhomedecor.com?subject=${encodeURIComponent(form.subject + " — AD Home Decor")}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    setSubmitted(true);
    setForm(INITIAL);
    setErrors({});
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-brand-orange/10 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-brand-orange">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-heading text-xl uppercase tracking-wide text-brand-dark mb-3">
          {t.successTitle}
        </h3>
        <p className="font-body text-brand-muted text-sm leading-relaxed max-w-xs mb-8">
          {t.successBody}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="font-body text-xs uppercase tracking-widest text-brand-orange border-b border-brand-orange/40 hover:border-brand-orange pb-0.5 transition-colors"
        >
          {t.successAgain}
        </button>
      </div>
    );
  }

  const inputBase = "w-full font-body text-sm text-brand-dark bg-white border border-brand-border px-4 py-3 outline-none focus:border-brand-orange transition-colors duration-200 placeholder:text-stone-400";
  const errorBase = "mt-1.5 font-body text-[11px] text-red-500";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-heading text-[10px] uppercase tracking-widest text-brand-dark mb-2 block">
            {t.name} <span className="text-brand-orange">*</span>
          </label>
          <input type="text" value={form.name} onChange={set("name")} className={`${inputBase} ${errors.name ? "border-red-400" : ""}`} />
          {errors.name && <p className={errorBase}>{errors.name}</p>}
        </div>
        <div>
          <label className="font-heading text-[10px] uppercase tracking-widest text-brand-dark mb-2 block">
            {t.email} <span className="text-brand-orange">*</span>
          </label>
          <input type="email" value={form.email} onChange={set("email")} className={`${inputBase} ${errors.email ? "border-red-400" : ""}`} />
          {errors.email && <p className={errorBase}>{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-heading text-[10px] uppercase tracking-widest text-brand-dark mb-2 block">
            {t.phone}
          </label>
          <input type="tel" value={form.phone} onChange={set("phone")} className={inputBase} />
        </div>
        <div>
          <label className="font-heading text-[10px] uppercase tracking-widest text-brand-dark mb-2 block">
            {t.subject}
          </label>
          <select value={form.subject} onChange={set("subject")} className={`${inputBase} appearance-none cursor-pointer`}>
            {t.subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="font-heading text-[10px] uppercase tracking-widest text-brand-dark mb-2 block">
          {t.message} <span className="text-brand-orange">*</span>
        </label>
        <textarea rows={5} value={form.message} onChange={set("message")} className={`${inputBase} resize-none ${errors.message ? "border-red-400" : ""}`} />
        {errors.message && <p className={errorBase}>{errors.message}</p>}
      </div>

      <button type="submit" className="w-full bg-brand-orange text-white font-body text-xs font-semibold uppercase tracking-widest py-4 hover:bg-brand-orange-hover transition-colors duration-300">
        {t.submit}
      </button>

      <p className="font-body text-[10px] text-brand-muted text-center leading-relaxed">
        {t.hint}{" "}
        <a href="mailto:manager@aydhomedecor.com" className="text-brand-orange hover:underline">
          manager@aydhomedecor.com
        </a>
      </p>
    </form>
  );
}
