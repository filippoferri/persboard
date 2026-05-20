#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = [
  'APP_URL',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APPID',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
];

const PUBLIC_SECRET_NAMES = [
  'NEXT_PUBLIC_OPENAI_API_KEY',
  'NEXT_PUBLIC_STRIPE_SECRET_KEY',
];

const getArgValue = (args, name) => {
  const index = args.indexOf(name);

  if (index === -1) {
    return null;
  }

  return args[index + 1] || null;
};

const parseEnvFile = (filename) => {
  if (!filename || !fs.existsSync(filename)) {
    return {};
  }

  const contents = fs.readFileSync(filename, 'utf8');

  return contents.split(/\r?\n/).reduce((acc, line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return acc;
    }

    const equalsIndex = trimmed.indexOf('=');

    if (equalsIndex === -1) {
      return acc;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    acc[key] = value;
    return acc;
  }, {});
};

const hasValue = (env, key) => Boolean(env[key] && String(env[key]).trim());

const checkPrefix = (env, key, prefix, warnings) => {
  if (hasValue(env, key) && !String(env[key]).startsWith(prefix)) {
    warnings.push(`${key} is present but does not look like a ${prefix} value.`);
  }
};

const isLocalUrl = (value) => /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(value || '');

const args = process.argv.slice(2);
const target = getArgValue(args, '--target') || 'local';
const defaultEnvFile = fs.existsSync('.env.local') ? '.env.local' : null;
const envFile = getArgValue(args, '--env-file') || defaultEnvFile;
const fileEnv = parseEnvFile(envFile);
const env = { ...process.env, ...fileEnv };

const missing = REQUIRED.filter((key) => !hasValue(env, key));
const publicSecrets = PUBLIC_SECRET_NAMES.filter((key) => hasValue(env, key));
const warnings = [];

checkPrefix(env, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_', warnings);
checkPrefix(env, 'STRIPE_SECRET_KEY', 'sk_', warnings);
checkPrefix(env, 'STRIPE_WEBHOOK_SECRET', 'whsec_', warnings);
checkPrefix(env, 'OPENAI_API_KEY', 'sk-', warnings);

if (target === 'production' && isLocalUrl(env.APP_URL)) {
  missing.push('APP_URL must be a production URL when --target production is used');
}

if (hasValue(env, 'FIREBASE_PRIVATE_KEY')) {
  const privateKey = String(env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n');

  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    warnings.push('FIREBASE_PRIVATE_KEY is present but does not look like a service account private key.');
  }
}

console.log(`Environment check target: ${target}`);
console.log(`Environment file: ${envFile ? path.resolve(envFile) : 'process env only'}`);

if (missing.length === 0 && publicSecrets.length === 0) {
  console.log('Required variables: OK');
} else {
  if (missing.length > 0) {
    console.error('Missing or invalid required variables:');
    missing.forEach((key) => console.error(`- ${key}`));
  }

  if (publicSecrets.length > 0) {
    console.error('Public secret variable names detected. Remove and rotate these values:');
    publicSecrets.forEach((key) => console.error(`- ${key}`));
  }
}

if (warnings.length > 0) {
  console.warn('Warnings:');
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

if (missing.length > 0 || publicSecrets.length > 0) {
  process.exit(1);
}
