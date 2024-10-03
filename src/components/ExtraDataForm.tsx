import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const extraDataSchema = z.object({
  phoneNumber: z.string().optional(),
  birthdate: z.string().optional(),
  occupation: z.string().optional(),
});

type ExtraDataFormValues = z.infer<typeof extraDataSchema>;

export const ExtraDataForm: React.FC = () => {
  const { control, handleSubmit } = useForm<ExtraDataFormValues>({
    resolver: zodResolver(extraDataSchema),
  });

  const saveExtraDataMutation = api.userExtraData.saveExtraData.useMutation();

  const onSubmit = (data: ExtraDataFormValues) => {
    saveExtraDataMutation.mutate({
      ...data,
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => <Input {...field} id="phoneNumber" />}
        />
      </div>
      <div>
        <Label htmlFor="birthdate">Birthdate</Label>
        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => <Input {...field} id="birthdate" type="date" />}
        />
      </div>
      <div>
        <Label htmlFor="occupation">Occupation</Label>
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => <Input {...field} id="occupation" />}
        />
      </div>
      <Button type="submit">Save Extra Data</Button>
    </form>
  );
};