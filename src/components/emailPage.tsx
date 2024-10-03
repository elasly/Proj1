import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select'
import EmailTypeSelect from '@/components/EmailTypeSelect';
import EmailSenderSelect from '@/components/EmailSenserSelect';


const emailFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'Email content is required'),
  text: z.string().default('Text content is required'),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

const AdminEmailPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [emailType, setEmailType] = useState<'individual' | 'campaign'>('individual');
  const [emailSender, setEmailSender] = useState<'info@strattrader.app' | 'alerts@strattrader.app' | 'admin@strattrader.app' | 'subscription@strattrader.app'>('info@strattrader.app');

  const { control, handleSubmit } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
  });

  const { data: users, isLoading: isLoadingUsers } = api.email.getUsers.useQuery();
  const sendIndividualEmail = api.email.sendIndividualEmail.useMutation();
  const sendCampaign = api.email.sendCampaign.useMutation();

  const onSubmit = async (data: EmailFormValues) => {
    if (emailType === 'individual') {
      if (selectedUsers.length > 0) {
        await sendIndividualEmail.mutateAsync({
          userId: selectedUsers[0]!,
          from: emailSender,
          ...data,
        });
      } else {
        // Handle the case when no user is selected
        console.error('No user selected for individual email');
        // You might want to show an error message to the user here
      }
    } else {
      await sendCampaign.mutateAsync({
        userId: selectedUsers,
        from: emailSender,
        ...data,
      });
    }
    // Handle success (e.g., show a toast notification)
  };

  if (isLoadingUsers) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Admin Email Dashboard</h1>
      <div className="mb-4">
      <Label>Email Type</Label>
        <EmailTypeSelect 
          value={emailType} 
          onChange={(value) => setEmailType(value)} 
        />
      </div>
      <div className="mb-4">
      <Label>Email Sender</Label>
        <EmailSenderSelect 
          value={emailSender} 
          onChange={(value) => setEmailSender(value)} 
        />
      </div>
      <div className="mb-4">
        <Label>Select Users</Label>
        {users?.map((user) => (
          <div key={user.id} className="flex items-center">
            <Checkbox
              id={user.id}
              checked={selectedUsers.includes(user.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedUsers([...selectedUsers, user.id]);
                } else {
                  setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                }
              }}
            />
            <label htmlFor={user.id} className="ml-2">
              {user.name} ({user.email})
            </label>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => <Input {...field} id="subject" />}
          />
        </div>
        <div>
          <Label htmlFor="html">Email Content (HTML)</Label>
          <Controller
            name="html"
            control={control}
            render={({ field }) => <Textarea {...field} id="html" rows={10} />}
          />
        </div>
        <div>
          <Label htmlFor="text">Email Content (text)</Label>
          <Controller
            name="text"
            control={control}
            render={({ field }) => <Textarea {...field} id="text" rows={10} />}
          />
        </div>
        <Button type="submit">Send Email</Button>
      </form>
    </div>
  );
};

export default AdminEmailPage;