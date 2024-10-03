import { useSession } from "next-auth/react";

const User = () => {
  const { data: session } = useSession();

  if (!session) {
    // Handle unauthenticated state, e.g. render a SignIn component
    return <p>Please sign in to access this page.</p>;
  }

  return <p>Welcome {session.user.name}!</p>;
};