import { motion } from "framer-motion";
import { User, Phone, Droplet, FileText } from "lucide-react";
import { PATIENT } from "@/lib/elderguard/types";

export function PatientProfile() {
  const rows = [
    { label: "Name", value: PATIENT.name },
    { label: "Age", value: `${PATIENT.age} years` },
    { label: "Gender", value: PATIENT.gender },
    { label: "Blood Group", value: PATIENT.bloodGroup },
  ];

  return (
    <motion.section
      id="patient"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <User className="h-7 w-7" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">{PATIENT.name}</h2>
          <p className="text-sm text-muted-foreground">Patient Profile</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground">{r.label}</dt>
            <dd className="mt-0.5 font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-3 border-t border-border pt-5">
        <Row icon={Phone} label="Emergency Contact" value={PATIENT.emergencyContact} tone="text-danger" />
        <Row icon={Droplet} label="Blood Group" value={PATIENT.bloodGroup} tone="text-primary" />
        <div className="flex gap-3 rounded-xl bg-muted/60 p-3">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Medical Notes</p>
            <p className="mt-0.5 text-sm">{PATIENT.medicalNotes}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
