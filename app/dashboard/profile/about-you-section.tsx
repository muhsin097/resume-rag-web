'use client';

import { useState } from 'react';
import { updateContactInfo } from './actions';

interface Me {
  name: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
}

// Candidates type these without a scheme ("linkedin.com/in/x") -- as a
// plain href that makes it a same-site relative link (broken). Only
// normalize for display; the stored value stays exactly what was typed.
function withScheme(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

// Bio/phone/location/name/links are each a single value, not a list -- so
// this is display-then-edit (one value, one form, toggled), not an
// ever-present form. Once there's data, show it as plain text with an Edit
// affordance.
export function AboutYouSection({ me }: { me: Me }) {
  const hasData = Boolean(
    me.phone || me.location || me.bio || me.linkedinUrl || me.githubUrl || me.websiteUrl,
  );
  const [editing, setEditing] = useState(!hasData);

  if (!editing) {
    return (
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">About you</h2>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="btn-secondary"
          >
            Edit
          </button>
        </div>
        <div className="card space-y-1 text-sm">
          <p className="font-medium">{me.name}</p>
          {(me.location || me.phone) && (
            <p className="muted">
              {[me.location, me.phone].filter(Boolean).join(' · ')}
            </p>
          )}
          {me.bio && <p>{me.bio}</p>}
          {(me.linkedinUrl || me.githubUrl || me.websiteUrl) && (
            <p className="flex flex-wrap gap-x-3 pt-1">
              {me.linkedinUrl && (
                <a
                  href={withScheme(me.linkedinUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  LinkedIn
                </a>
              )}
              {me.githubUrl && (
                <a
                  href={withScheme(me.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  GitHub
                </a>
              )}
              {me.websiteUrl && (
                <a
                  href={withScheme(me.websiteUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  Website
                </a>
              )}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-2 text-lg font-semibold">About you</h2>
      <form
        action={async (formData) => {
          await updateContactInfo(formData);
          setEditing(false);
        }}
        className="card grid grid-cols-2 gap-3"
      >
        <input
          name="name"
          defaultValue={me.name}
          placeholder="Full name"
          required
          className="input col-span-2"
        />
        <input
          name="phone"
          defaultValue={me.phone ?? ''}
          placeholder="Phone"
          className="input col-span-1"
        />
        <input
          name="location"
          defaultValue={me.location ?? ''}
          placeholder="Location"
          className="input col-span-1"
        />
        <textarea
          name="bio"
          defaultValue={me.bio ?? ''}
          placeholder="Short professional bio"
          rows={2}
          className="input col-span-2"
        />
        <input
          name="linkedinUrl"
          defaultValue={me.linkedinUrl ?? ''}
          placeholder="LinkedIn URL"
          className="input col-span-1"
        />
        <input
          name="githubUrl"
          defaultValue={me.githubUrl ?? ''}
          placeholder="GitHub URL"
          className="input col-span-1"
        />
        <input
          name="websiteUrl"
          defaultValue={me.websiteUrl ?? ''}
          placeholder="Personal website URL"
          className="input col-span-2"
        />
        <div className="col-span-2 flex gap-2">
          <button type="submit" className="btn-primary">
            Save
          </button>
          {hasData && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
