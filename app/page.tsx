import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page
  // In a real app, check for auth token and redirect to dashboard if logged in
  redirect('/login');
}