import LogoutButton from '@/components/LogoutButton';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
}
