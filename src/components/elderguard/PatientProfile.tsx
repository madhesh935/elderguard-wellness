import { motion } from "framer-motion";
import { User, Phone, Droplet, FileText, MapPin, Stethoscope, Pill, Calendar } from "lucide-react";
import { PATIENT } from "@/lib/elderguard/types";

const DOCTOR = {
  name: "Dr. Priya Rao",
  specialty: "Cardiologist",
  contact: "+91 98400 12345",
  hospital: "Apollo Hospital, Chennai",
};

const MEDICATIONS = [
  { name: "Metoprolol 50mg", schedule: "Morning · daily", type: "Beta-blocker" },
  { name: "Amlodipine 5mg", schedule: "Evening · daily", type: "Calcium channel blocker" },
  { name: "Aspirin 75mg", schedule: "Morning · daily", type: "Antiplatelet" },
];

export function PatientProfile() {
  const initials = PATIENT.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <motion.section
      id="patient"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl overflow-hidden"
    >
      {/* Header gradient band */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.45_0.18_270)] text-lg font-bold text-white shadow-md">
            {initials}
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">{PATIENT.name}</h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground">{PATIENT.age} yrs · {PATIENT.gender}</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {PATIENT.bloodGroup}
              </span>
              <span className="rounded-full bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning-foreground">
                High Risk
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Basic info grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoChip icon={MapPin} label="Location" value="Room 204, Ward B" />
          <InfoChip icon={Calendar} label="Admitted" value="May 12, 2025" />
          <InfoChip icon={Droplet} label="Blood Group" value={PATIENT.bloodGroup} tone="text-danger" />
          <InfoChip icon={Phone} label="Emergency" value={PATIENT.emergencyContact} tone="text-danger" />
        </div>

        {/* Doctor info */}
        <div className="rounded-xl bg-primary/5 p-3 border border-primary/15">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Attending Physician</p>
          </div>
          <p className="font-semibold text-sm">{DOCTOR.name}</p>
          <p className="text-xs text-muted-foreground">{DOCTOR.specialty} · {DOCTOR.hospital}</p>
          <p className="text-xs text-primary mt-1 font-medium">{DOCTOR.contact}</p>
        </div>

        {/* Medications */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Pill className="h-4 w-4 text-chart-5" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medications</p>
          </div>
          <div className="space-y-2">
            {MEDICATIONS.map((med) => (
              <div key={med.name} className="flex items-start justify-between rounded-lg bg-muted/50 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.type}</p>
                </div>
                <span className="shrink-0 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-medium text-success">
                  {med.schedule}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Medical notes */}
        <div className="flex gap-3 rounded-xl bg-warning-soft/60 p-3 border border-warning/20">
          <FileText className="h-4 w-4 shrink-0 text-warning-foreground mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-warning-foreground">Clinical Notes</p>
            <p className="mt-0.5 text-sm text-foreground/80">{PATIENT.medicalNotes}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function InfoChip({
  icon: Icon,
  label,
  value,
  tone = "text-foreground",
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-2.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        {label}
      </div>
      <p className={`text-sm font-semibold truncate ${tone}`}>{value}</p>
    </div>
  );
}
