'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  extractResumeItems,
  saveExtractedResume,
  type ExtractedContactInfo,
  type ExtractedItem,
  type ExtractedItemType,
} from './import-actions';
import { TYPE_BADGE_CLASSES } from './type-colors';

const FACT_TYPES: ExtractedItemType[] = [
  'EXPERIENCE',
  'EDUCATION',
  'CERTIFICATION',
  'PROJECT',
  'ACHIEVEMENT',
];

export function ImportResumeSection() {
  const router = useRouter();
  const [extractState, extractAction, isExtracting] = useActionState(
    extractResumeItems,
    {},
  );
  // Skills/languages are shown as a chip row, not a card per entry. Facts
  // (experience/education/etc.) get individual cards since those need more
  // fields.
  const [facts, setFacts] = useState<ExtractedItem[] | null>(null);
  const [skillsText, setSkillsText] = useState('');
  const [languagesText, setLanguagesText] = useState('');
  const [contactInfo, setContactInfo] = useState<ExtractedContactInfo>({});
  // Each section shows a clean read-only summary by default; "Edit" toggles
  // it into an editable form. Nothing is saved until "Save to profile".
  const [editingContact, setEditingContact] = useState(false);
  const [editingSkills, setEditingSkills] = useState(false);
  const [editingLanguages, setEditingLanguages] = useState(false);
  const [editingFacts, setEditingFacts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (extractState.items) {
      setFacts(
        extractState.items.filter(
          (item) => item.type !== 'SKILL' && item.type !== 'LANGUAGE',
        ),
      );
      setSkillsText(
        extractState.items
          .filter((item) => item.type === 'SKILL')
          .map((item) => item.title)
          .join(', '),
      );
      setLanguagesText(
        extractState.items
          .filter((item) => item.type === 'LANGUAGE')
          .map((item) => item.title)
          .join(', '),
      );
      setContactInfo(extractState.contactInfo ?? {});
      setEditingContact(false);
      setEditingSkills(false);
      setEditingLanguages(false);
      setEditingFacts(false);
    }
  }, [extractState.items, extractState.contactInfo]);

  function updateFact(index: number, patch: Partial<ExtractedItem>) {
    setFacts((current) =>
      current
        ? current.map((item, i) => (i === index ? { ...item, ...patch } : item))
        : current,
    );
  }

  function removeFact(index: number) {
    setFacts((current) =>
      current ? current.filter((_, i) => i !== index) : current,
    );
  }

  const skillChips = skillsText
    .split(/[,\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);

  const languageChips = languagesText
    .split(/[,\n]/)
    .map((language) => language.trim())
    .filter(Boolean);

  async function handleSaveAll() {
    if (!facts) return;
    const skillItems: ExtractedItem[] = skillChips.map((title) => ({
      type: 'SKILL',
      title,
    }));
    const languageItems: ExtractedItem[] = languageChips.map((title) => ({
      type: 'LANGUAGE',
      title,
    }));
    const allItems = [...facts, ...skillItems, ...languageItems];
    const hasContact =
      contactInfo.phone || contactInfo.location || contactInfo.bio;
    if (allItems.length === 0 && !hasContact) return;

    setSaving(true);
    setSaveError(null);
    try {
      await saveExtractedResume(allItems, contactInfo);
      setFacts(null);
      setSkillsText('');
      setLanguagesText('');
      setContactInfo({});
      router.refresh();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Could not save resume data.',
      );
    } finally {
      setSaving(false);
    }
  }

  const hasReviewData = facts !== null;

  return (
    <section className="card space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Import from resume</h2>
        <p className="text-sm muted">
          Upload a PDF, DOCX, or text resume and we&apos;ll fill in your
          profile for you.
        </p>
      </div>
      <form
        action={extractAction}
        className="flex flex-wrap items-center gap-3"
      >
        <input
          type="file"
          name="file"
          accept=".pdf,.docx,.txt"
          required
          className="text-sm"
        />
        <button type="submit" disabled={isExtracting} className="btn-primary">
          {isExtracting ? 'Reading resume...' : 'Extract'}
        </button>
      </form>
      {extractState.error && (
        <p className="text-sm text-red-600">{extractState.error}</p>
      )}

      {hasReviewData && (
        <div
          className="space-y-3 pt-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <p className="text-sm muted">
            Here&apos;s what we found. Nothing is saved to your profile yet.
          </p>

          {/* Contact & bio */}
          <div className="card-muted">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium">Contact &amp; bio</p>
              <button
                type="button"
                onClick={() => setEditingContact((v) => !v)}
                className="link text-xs"
              >
                {editingContact ? 'Done' : 'Edit'}
              </button>
            </div>
            {editingContact ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={contactInfo.phone ?? ''}
                    onChange={(e) =>
                      setContactInfo((c) => ({ ...c, phone: e.target.value }))
                    }
                    placeholder="Phone"
                    className="input"
                  />
                  <input
                    value={contactInfo.location ?? ''}
                    onChange={(e) =>
                      setContactInfo((c) => ({
                        ...c,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Location"
                    className="input"
                  />
                </div>
                <textarea
                  value={contactInfo.bio ?? ''}
                  onChange={(e) =>
                    setContactInfo((c) => ({ ...c, bio: e.target.value }))
                  }
                  placeholder="Short professional bio"
                  rows={2}
                  className="input"
                />
              </div>
            ) : contactInfo.phone || contactInfo.location || contactInfo.bio ? (
              <div className="text-sm">
                {(contactInfo.phone || contactInfo.location) && (
                  <p className="muted">
                    {[contactInfo.location, contactInfo.phone]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
                {contactInfo.bio && <p>{contactInfo.bio}</p>}
              </div>
            ) : (
              <p className="text-sm muted">Nothing found.</p>
            )}
          </div>

          {/* Skills */}
          <div className="card-muted">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium">Skills</p>
              <button
                type="button"
                onClick={() => setEditingSkills((v) => !v)}
                className="link text-xs"
              >
                {editingSkills ? 'Done' : 'Edit'}
              </button>
            </div>
            {editingSkills ? (
              <textarea
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                rows={2}
                placeholder="Kubernetes, AWS, Terraform"
                className="input"
              />
            ) : skillChips.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skillChips.map((skill) => (
                  <span
                    key={skill}
                    className={`chip ${TYPE_BADGE_CLASSES.SKILL} border-0 text-xs`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm muted">Nothing found.</p>
            )}
          </div>

          {/* Languages */}
          <div className="card-muted">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium">Languages</p>
              <button
                type="button"
                onClick={() => setEditingLanguages((v) => !v)}
                className="link text-xs"
              >
                {editingLanguages ? 'Done' : 'Edit'}
              </button>
            </div>
            {editingLanguages ? (
              <textarea
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                rows={2}
                placeholder="English (Native), Spanish (Fluent)"
                className="input"
              />
            ) : languageChips.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {languageChips.map((language) => (
                  <span
                    key={language}
                    className={`chip ${TYPE_BADGE_CLASSES.LANGUAGE} border-0 text-xs`}
                  >
                    {language}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm muted">Nothing found.</p>
            )}
          </div>

          {/* Experience, education, certifications, projects, achievements */}
          <div className="card-muted">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">
                Experience, education &amp; more
              </p>
              <button
                type="button"
                onClick={() => setEditingFacts((v) => !v)}
                className="link text-xs"
              >
                {editingFacts ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="space-y-2">
              {facts && facts.length === 0 && (
                <p className="text-sm muted">Nothing found.</p>
              )}
              {facts?.map((item, index) =>
                editingFacts ? (
                  <div key={index} className="card grid grid-cols-2 gap-2">
                    <select
                      value={item.type}
                      onChange={(e) =>
                        updateFact(index, {
                          type: e.target.value as ExtractedItemType,
                        })
                      }
                      className="input col-span-1"
                    >
                      {FACT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeFact(index)}
                      className="col-span-1 justify-self-end text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                    <input
                      value={item.title}
                      onChange={(e) =>
                        updateFact(index, { title: e.target.value })
                      }
                      placeholder="Title"
                      className="input col-span-2"
                    />
                    <input
                      value={item.organization ?? ''}
                      onChange={(e) =>
                        updateFact(index, { organization: e.target.value })
                      }
                      placeholder="Organization"
                      className="input col-span-2"
                    />
                    <textarea
                      value={item.description ?? ''}
                      onChange={(e) =>
                        updateFact(index, { description: e.target.value })
                      }
                      placeholder="Description"
                      rows={2}
                      className="input col-span-2"
                    />
                  </div>
                ) : (
                  <div key={index} className="card flex items-start justify-between">
                    <div>
                      <span
                        className={`chip ${TYPE_BADGE_CLASSES[item.type]} border-0 text-xs`}
                      >
                        {item.type}
                      </span>
                      <p className="font-medium">
                        {item.title}
                        {item.organization ? ` at ${item.organization}` : ''}
                      </p>
                      {item.description && (
                        <p className="text-sm muted">{item.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFact(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>

          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save to profile'}
          </button>
        </div>
      )}
    </section>
  );
}
