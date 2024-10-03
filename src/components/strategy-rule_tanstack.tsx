// StrategyRules.tsx
import React, { useEffect } from "react";
import { useFormContext, useFieldArray, useWatch, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ReusableSelect } from "@/components/ui/ReusableSelect";
import { RuleType, CompareToType, OperatorType, SlopeType, PriceActionType } from "@/pages/strategies/enums";
import  type { EntryRules, ExitRules } from "@/lib/interfaces";

interface IndicatorDetail {
  id: number;
  name: string;
}

interface IndicatorData {
  details: IndicatorDetail[];
}

interface StrategyRulesProps {
  indicatorData: Record<string, IndicatorData>;
}
interface FormValues {
  entryRules: EntryRules[];
  exitRules: ExitRules[];
}
const StrategyRules: React.FC<StrategyRulesProps> = ({ indicatorData }) => {
  const { control, watch } = useFormContext();

  const { fields: entryFields, append: appendEntry, remove: removeEntry } = useFieldArray({
    control,
    name: "entryRules",
  });

  const { fields: exitFields, append: appendExit, remove: removeExit } = useFieldArray({
    control,
    name: "exitRules",
  });

  const { entryRules, exitRules } = watch<FormValues>(["entryRules", "exitRules"]);

  useEffect(() => {
    // You can perform any side effects here when rules change
    // For example, logging the updated rules
    console.log("Updated Entry rules:", [entryRules],"\nUpdated Exit rules:", [ exitRules]);
  }, [entryRules, exitRules]);

  const addEntryRule = () => {
    appendEntry({
      ruleType: "hold",
      ruleAction: "none",
      indicatorId: 0,
      operator: "",
      value: 0,
      sequence: entryFields.length,
      logicalOperator: "",
      compareTo: "",
      compIndicatorId: 0,
      slope: "",
      priceAction: "",
    });
  };
  
  const addExitRule = () => {
    appendExit({
      ruleType: "hold",
      ruleAction: "none",
      indicatorId: 0,
      operator: "",
      value: 0,
      sequence: exitFields.length,
      logicalOperator: "",
      compareTo: "",
      compIndicatorId: 0,
      slope: "",
      priceAction: "",
    });
  };

  const ruleTypeOptions = Object.entries(RuleType).map(([key, value]) => ({ value, label: key }));
  const compareToOptions = Object.entries(CompareToType).map(([key, value]) => ({ value, label: key }));
  const operatorOptions = Object.entries(OperatorType).map(([key, value]) => ({ value, label: key }));
  const slopeOptions = Object.entries(SlopeType).map(([key, value]) => ({ value, label: key }));
  const priceActionOptions = Object.entries(PriceActionType).map(([key, value]) => ({ value, label: key }));

  const ConditionalFields: React.FC<{ fieldName: string; index: number }> = ({ fieldName, index }) => {
    const compareTo = useWatch({
      control,
      name: `${fieldName}.${index}.compareTo`,
    }) as CompareToType;

    switch (compareTo) {
      case CompareToType.Threshold:
        return (
          <>
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.operator`}
              options={operatorOptions}
              placeholder="Select operator"
              label="Operator"
            />
            <Controller
              name={`${fieldName}.${index}.value`}
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
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
            options={slopeOptions}
            placeholder="Select slope"
            label="Slope"
          />
        );
      case CompareToType.Price:
        return (
          <>
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.operator`}
              options={operatorOptions}
              placeholder="Select operator"
              label="Operator"
            />
            <ReusableSelect
              control={control}
              name={`${fieldName}.${index}.priceAction`}
              options={priceActionOptions}
              placeholder="Select price action"
              label="Price action"
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
            <Controller
              control={control}
              name={`${fieldName}.${index}.compIndicatorId`}
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compare indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(indicatorData).flatMap(([id, data]) =>
                      data.details.map((indicator: { id: number; name: string }) => (
                        <SelectItem key={indicator.id} value={indicator.id}>
                          {`${indicator.name}-${id}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
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
        options={ruleTypeOptions}
        placeholder="Select rule type"
        label="Rule type"
      />
      <Controller
        control={control}
        name={`${fieldName}.${index}.indicatorId`}
        render={({ field }) => (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an indicator" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(indicatorData).flatMap(([id, data]) =>
                data?.details?.map((indicator: { id: number; name: string }) => (
                  <SelectItem key={indicator.id+'-'+index} value={indicator.id.toString()}>
                    {`${indicator.name}-${id}`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      />
      <ReusableSelect
        control={control}
        name={`${fieldName}.${index}.compareTo`}
        options={compareToOptions}
        placeholder="Compare to"
        label="Compare to"
      />
      <ConditionalFields fieldName={fieldName} index={index} />
    </>
  );

  return (
    <div className="flex flex-col gap-4">      
      <Card className="flex w-full flex-col">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Entry Rules</CardTitle>
          <CardDescription>Select indicators for entry rules.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {entryFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              {renderRuleFields("entryRules", index)}
              <Button variant="destructive" onClick={() => removeEntry(index)}>
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={addEntryRule}>Add Entry Rule</Button>
        </CardFooter>
      </Card>
      <Card className="flex w-full flex-col">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Exit Rules</CardTitle>
          <CardDescription className="items-center justify-between text-sm text-gray-500">
            Select the indicators you want to use for exit rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {exitFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              {renderRuleFields("exitRules", index)}
              <Button variant="destructive" onClick={() => removeExit(index)}>
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={addExitRule}>Add Exit Rule</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StrategyRules;