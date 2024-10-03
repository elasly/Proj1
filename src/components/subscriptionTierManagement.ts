import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';

const tierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  features: z.record(z.boolean()),
});

type TierFormValues = z.infer<typeof tierSchema>;

const SubscriptionTierManagement: React.FC = () => {
  const { data: tiers, refetch } = api.subscription.getTiers.useQuery();
  const createTier = api.subscription.createTier.useMutation();
  const updateTier = api.subscription.updateTier.useMutation();

  const { control, handleSubmit } = useForm<TierFormValues>({
    resolver: zodResolver(tierSchema),
  });

  const onSubmit = async (data: TierFormValues) => {
    await createTier.mutateAsync(data);
    refetch();
  };

  return (
    // <div>
    //   <h1>Manage Subscription Tiers</h1>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     {/* Form fields for tier name, price, and features */}
    //     <Button type="submit">Create Tier</Button>
    //   </form>
    //   <div>
    //     {tiers?.map((tier) => (
    //       <div key={tier.id}>
    //         {/* Display tier details and edit form */}
    //       </div>
    //     ))}
    //   </div>
    // </div>
  null);
};

export default SubscriptionTierManagement;