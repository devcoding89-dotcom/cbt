import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card, CardBody } from "@/components/ui/card";

export const metadata = { title: "Contact" };

const channels = [
  { icon: Mail, label: "Email", value: "support@prepai.ng", note: "We reply within 24 hours on weekdays." },
  { icon: MessageCircle, label: "WhatsApp", value: "+234 800 000 0000", note: "Fastest for payment issues." },
  { icon: Phone, label: "Phone", value: "+234 800 000 0000", note: "Mon–Fri, 9am–5pm WAT." },
];

export default function ContactPage() {
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-600">Contact</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">We are one message away</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
        Payment problem, a question that looks wrong, or a subject you want us to add — tell us and we will
        sort it out.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <Card key={c.label}>
            <CardBody className="pt-5">
              <c.icon className="size-5 text-brand-600" />
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-ink-400">{c.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-ink-950">{c.value}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-500">{c.note}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardBody className="pt-6">
          <h2 className="text-lg font-bold text-ink-950">Reporting a question error</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
            Include the subject, topic and the first few words of the question. We review every report and fix
            or remove the question, usually within a day.
          </p>
          <h2 className="mt-6 text-lg font-bold text-ink-950">Schools and study centres</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
            We offer bulk accounts with a shared progress dashboard for tutorial centres. Email us with the
            number of students and we will send pricing.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
