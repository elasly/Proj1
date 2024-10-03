import React from "react";
import { useForm, FormProvider, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReusableSelect } from "@/components/ui/ReusableSelect";
import { RuleType, CompareToType, OperatorType, SlopeType, PriceActionType } from "@/pages/strategies/enums";
import IndicatorCard from "@/components/indicatorcard";
import { strategyRulesSchema, type StrategyFormData } from "@/lib/zodSchema";
import * as z from "zod";


// ... (keep the ruleSchema and strategySchema as before)

interface StrategyInputFormProps {
  strategyName: string;
  strategyDescription: string;
  numIndicators: number;
  indicatorData: Record<string, any>;
  onIndicatorData: (id: string, data: any) => void;
}

const StrategyInputForm: React.FC<StrategyInputFormProps> = ({ 
  strategyName,
  strategyDescription,
  numIndicators, 
  indicatorData, 
  onIndicatorData 
}) => {
  const methods = useForm<StrategyFormData>({
    resolver: zodResolver(strategyRulesSchema),
    defaultValues: {
      name: "",
      description: "",
      entryRules: [],
      exitRules: [],
      lable:"",
    },
  });

  const { control, handleSubmit } = methods;

  const { fields: entryFields, append: appendEntry, remove: removeEntry } = useFieldArray({
    control,
    name: "entryRules",
  });

  const { fields: exitFields, append: appendExit, remove: removeExit } = useFieldArray({
    control,
    name: "exitRules",
  });

  const onSubmit = (data: StrategyFormData) => {
    console.log("Form submitted", data);
    // Here you would typically send the data to your backend
  };

  const ruleTypeOptions = Object.entries(RuleType).map(([key, value]) => ({ value, label: key }));
  const compareToOptions = Object.entries(CompareToType).map(([key, value]) => ({ value, label: key }));
  const operatorOptions = Object.entries(OperatorType).map(([key, value]) => ({ value, label: key }));
  const slopeOptions = Object.entries(SlopeType).map(([key, value]) => ({ value, label: key }));
  const priceActionOptions = Object.entries(PriceActionType).map(([key, value]) => ({ value, label: key }));

  const ConditionalFields = ({ fieldName, index }) => {
    const compareTo = useWatch({
      control,
      name: `${fieldName}.${index}.compareTo`,
    });

    switch (compareTo) {
      case CompareToType.Threshold:
        return (
          <>
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.operator`}
              label="Operator"
              options={operatorOptions}
              placeholder="Select operator"
            />
            <Controller
              name={`${fieldName}.${index}.value`}
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  placeholder="Threshold value"
                />
              )}
            />
          </>
        );
      case CompareToType.Slope:
        return (
          <ReusableSelect
            control={control}
            name={`${fieldName}.${index}.slope`}
            label="Slope"
            options={slopeOptions}
            placeholder="Select slope"
          />
        );
      case CompareToType.Price:
        return (
          <>
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.operator`}
              label="Operator"
              options={operatorOptions}
              placeholder="Select operator"
            />
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.priceAction`}
              label="Price Action"
              options={priceActionOptions}
              placeholder="Select price action"
            />
          </>
        );
      case CompareToType.Indicator:
        return (
          <>
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.operator`}
              label="Operator"
              options={[
                { value: OperatorType.CrossOver, label: "Cross Over" },
                { value: OperatorType.CrossUnder, label: "Cross Under" },
              ]}
              placeholder="Select operator"
            />
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.compIndicatorId`}
              label="Compare Indicator"
              options={Object.entries(indicatorData).flatMap(([id, data]) =>
                data.details.map((indicator) => ({
                  value: indicator.id.toString(),
                  label: `${indicator.name}-${id}`,
                }))
              )}
              placeholder="Select compare indicator"
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderRuleFields = (fieldName: "entryRules" | "exitRules", index: number) => (
    <>
      <ReusableSelect
        control={control}
        name={`${fieldName}.${index}.ruleType`}
        label="Rule Type"
        options={ruleTypeOptions}
        placeholder="Select rule type"
      />
      <ReusableSelect
        control={control}
        name={`${fieldName}.${index}.indicatorId`}
        label="Indicator"
        options={Object.entries(indicatorData).flatMap(([id, data]) =>
          data.details.map((indicator) => ({
            value: Number(indicator.id),
            label: `${indicator.name}-${id}`,
          }))
        )}
        placeholder="Select an indicator"
      />
      <ReusableSelect
        control={control}
        name={`${fieldName}.${index}.compareTo`}
        label="Compare To"
        options={compareToOptions}
        placeholder="Compare to"
      />
      <ConditionalFields fieldName={fieldName} index={index} />
    </>
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Strategy Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Strategy Name" defaultValue={strategyName} />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Strategy Description" defaultValue={strategyDescription} />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {Array.from({ length: numIndicators }, (_, index) => (
                <IndicatorCard
                  key={index}
                  id={`${index + 1}`}
                  onIndicatorData={onIndicatorData}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entry Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {entryFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-4">
                {renderRuleFields("entryRules", index)}
                <Button type="button" onClick={() => removeEntry(index)}>Remove</Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={() => appendEntry({ ruleType: "entryRule", ruleAction: "hold", indicatorId: 0, operator: "", value: 0, sequence: entryFields.length, logicalOperator: "", compareTo: "", compIndicatorId: 0 })}>
              Add Entry Rule
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exit Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {exitFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-4">
                {renderRuleFields("exitRules", index)}
                <Button type="button" onClick={() => removeExit(index)}>Remove</Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={() => appendExit({ ruleType: "exitRule", ruleAction: "hold", indicatorId: 0, operator: "", value: 0, sequence: exitFields.length, logicalOperator: "", compareTo: "", compIndicatorId: 0 })}>
              Add Exit Rule
            </Button>
          </CardFooter>
        </Card>

        <Button type="submit">Save Strategy</Button>
      </form>
    </FormProvider>
  );
};

export default StrategyInputForm;