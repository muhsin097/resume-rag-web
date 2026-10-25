import { describe, it, expect } from 'vitest';
import { getTechIcon } from './tech-icons';

describe('getTechIcon', () => {
  it('matches common exact names case-insensitively', () => {
    expect(getTechIcon('React')).not.toBeNull();
    expect(getTechIcon('react')).not.toBeNull();
    expect(getTechIcon('REACT')).not.toBeNull();
  });

  it('tolerates separator variation (space/hyphen/underscore/dot) after an exact match fails', () => {
    expect(getTechIcon('Node JS')?.title).toBe('Node.js');
    expect(getTechIcon('node-js')?.title).toBe('Node.js');
    expect(getTechIcon('Node.js')?.title).toBe('Node.js');
    expect(getTechIcon('React JS')?.title).toBe('React');
    expect(getTechIcon('react_js')?.title).toBe('React');
    expect(getTechIcon('Socket.IO')?.title).toBe('Socket.io');
  });

  it('does not let separator-stripping collide "C" with "C#" or "C++"', () => {
    expect(getTechIcon('C')?.title).toBe('C');
    expect(getTechIcon('C#')?.title).toBe('sharp');
    expect(getTechIcon('C++')?.title).toBe('C++');
  });

  it('distinguishes Spring from Spring Boot', () => {
    expect(getTechIcon('Spring')?.title).toBe('Spring');
    expect(getTechIcon('Spring Boot')?.title).toBe('Spring Boot');
    expect(getTechIcon('SpringBoot')?.title).toBe('Spring Boot');
  });

  it('returns null for non-tech soft skills -- simple-icons is a brand-logo library, not a generic icon set', () => {
    expect(getTechIcon('Leadership')).toBeNull();
    expect(getTechIcon('Communication')).toBeNull();
    expect(getTechIcon('Agile Development')).toBeNull();
  });

  it('returns null for brands with no icon in this installed version (confirmed trademark takedowns)', () => {
    expect(getTechIcon('AWS')).toBeNull();
    expect(getTechIcon('LinkedIn')).toBeNull();
    expect(getTechIcon('Microsoft Azure')).toBeNull();
    expect(getTechIcon('Slack')).toBeNull();
  });

  it('trims whitespace before matching', () => {
    expect(getTechIcon('  Docker  ')).not.toBeNull();
  });

  it('matches a representative sample of the expanded dictionary', () => {
    for (const name of ['Stripe', 'Jira', 'Postman', 'Redux', 'Ansible', 'Grafana', 'Sentry', 'Figma', 'Kubernetes']) {
      expect(getTechIcon(name), `expected an icon for "${name}"`).not.toBeNull();
    }
  });
});
