'use client';
import { redirect } from 'next/navigation';

// Catch-all settings routes -> main settings page
export default function SettingsCatchAllPage() {
  redirect('/settings');
}
