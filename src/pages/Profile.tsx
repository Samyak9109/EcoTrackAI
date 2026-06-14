import { useState, type FormEvent } from "react";
import type {
  DietType,
  ShoppingFrequency,
  TransportMode,
  UserProfile,
} from "../types";
import {
  DIET_OPTIONS,
  SHOPPING_OPTIONS,
  TRANSPORT_OPTIONS,
} from "../data/domainMetadata";

const DEFAULT_PROFILE: UserProfile = {
  commuteKmPerDay: 10,
  transportMode: "car",
  electricityUnitsPerMonth: 150,
  dietType: "mixed",
  onlineOrdersPerMonth: 3,
  shoppingFrequency: "medium",
  recyclesWaste: true,
  usesACDaily: false,
};

type ProfileProps = {
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
};

export function Profile({ profile, onSave }: ProfileProps) {
  const [form, setForm] = useState<UserProfile>(profile ?? DEFAULT_PROFILE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!Number.isFinite(form.commuteKmPerDay) || form.commuteKmPerDay < 0) {
      nextErrors.commuteKmPerDay = "Enter a distance of zero or more.";
    }
    if (
      !Number.isFinite(form.electricityUnitsPerMonth) ||
      form.electricityUnitsPerMonth < 0
    ) {
      nextErrors.electricityUnitsPerMonth = "Enter electricity use of zero or more.";
    }
    if (!Number.isFinite(form.onlineOrdersPerMonth) || form.onlineOrdersPerMonth < 0) {
      nextErrors.onlineOrdersPerMonth = "Enter zero or a positive order count.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSave(form);
  }

  return (
    <section className="page-width page-section">
      <div className="page-heading split-heading">
        <div>
          <span className="section-kicker">YOUR LIFESTYLE</span>
          <h1>Build your carbon profile</h1>
          <p>Eight quick inputs create your personalized monthly estimate.</p>
        </div>
        <div className="step-indicator"><strong>1</strong><span>Profile</span><i /><strong>2</strong><span>Insights</span></div>
      </div>

      <form className="profile-form" onSubmit={submit} noValidate>
        <fieldset className="form-section">
          <legend><span>01</span> Daily travel</legend>
          <div className="form-grid">
            <label className="field">
              <span>How do you usually commute?</span>
              <select
                value={form.transportMode}
                onChange={(event) => update("transportMode", event.target.value as TransportMode)}
              >
                {TRANSPORT_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Daily commute distance</span>
              <div className="input-suffix">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.commuteKmPerDay}
                  onChange={(event) => update("commuteKmPerDay", Number(event.target.value))}
                  aria-describedby={errors.commuteKmPerDay ? "commute-error" : undefined}
                />
                <span>km/day</span>
              </div>
              {errors.commuteKmPerDay && <small className="field-error" id="commute-error">{errors.commuteKmPerDay}</small>}
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend><span>02</span> Home energy</legend>
          <div className="form-grid">
            <label className="field">
              <span>Monthly electricity use</span>
              <div className="input-suffix">
                <input
                  type="number"
                  min="0"
                  value={form.electricityUnitsPerMonth}
                  onChange={(event) => update("electricityUnitsPerMonth", Number(event.target.value))}
                  aria-describedby={errors.electricityUnitsPerMonth ? "electricity-error" : undefined}
                />
                <span>units</span>
              </div>
              {errors.electricityUnitsPerMonth && <small className="field-error" id="electricity-error">{errors.electricityUnitsPerMonth}</small>}
            </label>
            <ToggleField
              label="Do you use AC daily?"
              value={form.usesACDaily}
              onChange={(value) => update("usesACDaily", value)}
            />
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend><span>03</span> Food and shopping</legend>
          <div className="form-grid three-columns">
            <label className="field">
              <span>Diet type</span>
              <select value={form.dietType} onChange={(event) => update("dietType", event.target.value as DietType)}>
                {DIET_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Shopping frequency</span>
              <select value={form.shoppingFrequency} onChange={(event) => update("shoppingFrequency", event.target.value as ShoppingFrequency)}>
                {SHOPPING_OPTIONS.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Online orders each month</span>
              <input
                type="number"
                min="0"
                value={form.onlineOrdersPerMonth}
                onChange={(event) => update("onlineOrdersPerMonth", Number(event.target.value))}
                aria-describedby={errors.onlineOrdersPerMonth ? "orders-error" : undefined}
              />
              {errors.onlineOrdersPerMonth && <small className="field-error" id="orders-error">{errors.onlineOrdersPerMonth}</small>}
            </label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend><span>04</span> Waste habits</legend>
          <ToggleField
            label="Do you separate and recycle household waste?"
            value={form.recyclesWaste}
            onChange={(value) => update("recyclesWaste", value)}
          />
        </fieldset>

        <div className="form-submit-row">
          <p><strong>Private prototype:</strong> this information never leaves your browser.</p>
          <button className="primary-button" type="submit">
            Calculate my footprint <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </section>
  );
}

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="field">
      <span>{label}</span>
      <div className="segmented-control" role="group" aria-label={label}>
        <button className={value ? "selected" : ""} type="button" onClick={() => onChange(true)} aria-pressed={value}>Yes</button>
        <button className={!value ? "selected" : ""} type="button" onClick={() => onChange(false)} aria-pressed={!value}>No</button>
      </div>
    </div>
  );
}
