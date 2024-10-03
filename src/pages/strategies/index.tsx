import { api } from "@/utils/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import StrategyForm from "@/components/StrategyForm";
import StrategiesTable from "@/components/StrategiesTable";




export default function StrategiesPage({
  groups,
}: {
  groups: any[];
}): JSX.Element {
  const { data: indGroups, isLoading: isLoadingGroups } = api.queries.getIndGroups.useQuery();
  const { data: strategies, isLoading: isLoadingStrategies } = api.queries.getUserStrategies.useQuery();

  return (
    <main className="col-span-full flex w-full flex-col bg-cover bg-no-repeat p-4">
      <h1 className="mb-8 self-center text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-[5rem]">
        <span className="text-[hsl(123,91%,70%)]">Strategy</span> Setup Page
      </h1>

      <Tabs
        defaultValue="create"
        className="flex-center mx-auto w-full max-w-6xl"
      >
        <TabsList className="mb-4 flex justify-start">
          <TabsTrigger value="create">Create Strategy</TabsTrigger>
          <TabsTrigger value="review">Review Strategies</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-300px)] w-auto">
          <TabsContent value="create">
            {isLoadingGroups ? (
              <div>Loading...</div>
            ) : (
              <StrategyForm groups={indGroups} />
            )}
          </TabsContent>
          <TabsContent value="review">
            {isLoadingStrategies ? (
              <div>Loading...</div>
            ) : (
              <StrategiesTable strategies={strategies} />
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </main>
  );
}
