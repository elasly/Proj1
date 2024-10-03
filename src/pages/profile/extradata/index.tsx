import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { ExtraDataForm } from "@/components/ExtraDataForm";

export default function ExtraDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: userExtraData, isLoading } = api.userExtraData.getUserExtraData.useQuery(
    undefined,
    { enabled: !!session?.user.id }
  );

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/login");
    return null;
  }

  if (userExtraData) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Please provide additional information</h1>
      <ExtraDataForm />
    </div>
  );
}