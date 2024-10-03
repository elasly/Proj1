// pages/index.js
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

// Mock API functions
const fetchInitialData = async () => {
  // Simulating API call
  return {
    strategyName: '',
    assetClass: [],
    timeFrame: '',
    strategyType: '',
    indicators: [],
    riskTolerance: 5,
    initialCapital: '',
    positionSize: '',
    strategyDescription: ''
  };
};

const saveStrategy = async (data) => {
  // Simulating API call
  console.log('Saving strategy:', data);
  return data;
};

export default function Home() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch } = useForm();

  const { data: initialData, isLoading } = useQuery({
    queryKey: ['initialData'],
    queryFn: fetchInitialData,
  });

  const mutation = useMutation({
    mutationFn: saveStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['initialData'] });
      toast({
        title: "Strategy Saved",
        description: "Your trading strategy has been successfully saved.",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your Trading Strategy</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="strategyName">Strategy Name</Label>
          <Input
            id="strategyName"
            {...register("strategyName")}
            placeholder="Enter a name for your strategy"
          />
        </div>

        <div>
          <Label htmlFor="assetClass">Asset Class</Label>
          <Select onValueChange={(value) => setValue("assetClass", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
              <SelectItem value="crypto">Cryptocurrencies</SelectItem>
              <SelectItem value="commodities">Commodities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeFrame">Time Frame</Label>
          <Select onValueChange={(value) => setValue("timeFrame", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Strategy Type</Label>
          <RadioGroup onValueChange={(value) => setValue("strategyType", value)}>
            {['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="indicators">Indicators</Label>
          <Select onValueChange={(value) => setValue("indicators", value)} multiple>
            <SelectTrigger>
              <SelectValue placeholder="Select indicators" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ma">Moving Average</SelectItem>
              <SelectItem value="rsi">RSI</SelectItem>
              <SelectItem value="macd">MACD</SelectItem>
              <SelectItem value="bb">Bollinger Bands</SelectItem>
              <SelectItem value="stoch">Stochastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="riskTolerance">Risk Tolerance</Label>
          <Slider
            id="riskTolerance"
            min={1}
            max={10}
            step={1}
            defaultValue={[5]}
            onValueChange={(value) => setValue("riskTolerance", value[0])}
          />
          <span>{watch("riskTolerance")}</span>
        </div>

        <div>
          <Label htmlFor="initialCapital">Initial Capital</Label>
          <Input
            id="initialCapital"
            type="number"
            {...register("initialCapital")}
            placeholder="Enter your initial capital"
          />
        </div>

        <div>
          <Label htmlFor="positionSize">Position Size (%)</Label>
          <Input
            id="positionSize"
            type="number"
            {...register("positionSize")}
            placeholder="Enter position size as percentage"
          />
        </div>

        <div>
          <Label htmlFor="strategyDescription">Strategy Description</Label>
          <Textarea
            id="strategyDescription"
            {...register("strategyDescription")}
            placeholder="Describe your trading strategy in detail"
          />
        </div>

        <Button type="submit">Save Strategy</Button>
      </form>
    </div>
  );
}