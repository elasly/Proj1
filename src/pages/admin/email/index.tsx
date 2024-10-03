import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminEmailPage from '@/components/emailPage';

const AdminEmailDashboard: NextPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

  
    if (status === "loading") {
      return <div>Loading...</div>;
    }
  
    if (status === "unauthenticated" || !session?.user.role) {
      void router.push("/api/auth/signin");
      return null;
    }

  return <AdminEmailPage />;
};

export default AdminEmailDashboard;