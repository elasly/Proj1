// src/components/StrategyForm.tsx
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from "@/utils/api";
import StrategyNameInput from "@/components/StrategyNameInput";
import StrategyRules from "@/components/strategy-rule_tanstack";
import { IndicatorCard } from "@/components/indicator-card";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const strategySchema = z.object({
  name: z.string().min(1, "Strategy name is required"),
  description: z.string(),
  entryRules: z.array(z.any()),
  exitRules: z.array(z.any()),
  riskManagement: z.array(z.any()),
});

type StrategyFormData = z.infer<typeof strategySchema>;

interface StrategyFormProps {
  groups: any[];
}

export default function StrategyForm({ groups }: StrategyFormProps) {
  const [numIndicators, setNumIndicators] = useState(1);
  interface IndicatorData {
    group: string;
    name: string;
    details: Array<{
      id: number;
      description: string;
      inputs: string;
      outputs: string;
      inputsMap: Record<string, string>;
    }>;
  }
  
  const [selectedData, setSelectedData] = useState<Record<string, IndicatorData>>({});
  const { toast } = useToast();
  const methods = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      name: "",
      description: "",
      entryRules: [],
      exitRules: [],
      riskManagement: [],
    },
  });

  const saveStrategy = api.queries.saveStrategy.useMutation({
    onSuccess: () => {
      toast({ title: "Strategy created", description: "Your strategy has been successfully created." });
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to create strategy: ${error.message}`, variant: "destructive" });
    },
  });

  const handleIndicatorData = (id: string, data: any) => {
    setSelectedData(prev => ({ ...prev, [id]: data }));
  };

  useEffect(() => {
    if (selectedData) {
      console.log('Selected Data:', selectedData);
    }
  }, [selectedData]);

  const onSubmit = (data: StrategyFormData) => {
    saveStrategy.mutate([data]);
  };


  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <StrategyNameInput
          name={methods.watch('name')}
          description={methods.watch('description')}
          onNameChange={(value) => methods.setValue('name', value)}
          onDescriptionChange={(value) => methods.setValue('description', value)}
        />
        <Input
          type="number"
          value={numIndicators}
          onChange={(e) => setNumIndicators(parseInt(e.target.value, 10))}
          min={1}
          placeholder="Number of indicators"
        />
        <div className="flex flex-wrap justify-center gap-4 py-8">
          {Array.from({ length: numIndicators }, (_, index) => (
            <IndicatorCard
              key={`indicator-${index}`}
              id={`${index + 1}`}
              groups={groups}
              onIndicatorData={handleIndicatorData}
            />
          ))}
        </div>
        <StrategyRules indicatorData={selectedData} />
        <Button type="submit">Submit Strategy</Button>
      </form>
    </FormProvider>
  );
}