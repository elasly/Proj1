"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { EntryRule, ExitRule } from "@/server/db/schema";

// interface Rule {
//   ruleType: string;
//   ruleAction: string;
//   indicatorId: number;
//   operator: string;
//   value: number;
//   sequence: number;
//   logicalOperator: string;
//   compareTo: string;
//   compIndicatorId: number;
//   slope: string;
//   priceAction: string;
// }

interface StrategyRulesProps {
  onSubmit: (entryRules: EntryRule[], exitRules: ExitRule[]) => void;
  indicatorData: Record<string, any>;
  pageId: number;
  stratid: number,
}

const StrategyRules: React.FC<StrategyRulesProps> = ({
  onSubmit,
  indicatorData,
  pageId,
  stratid,
}) => {
  // console.log("indicatorData", indicatorData);
  const [entryRules, setEntryRules] = useState<EntryRule[]>([
    
  ]);
  const [exitRules, setExitRules] = useState<ExitRule[]>([
    
  ]);
  // console.log("entryRules", entryRules);
  // console.log("exitRules", exitRules);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("onsubmit entryRules", entryRules);
    // console.log("onsubmit exitRules", exitRules);
    onSubmit(entryRules, exitRules);
  };

  const handleEntryRuleChange = (
    EntryIndex: number,
    field: keyof EntryRule,
    value: number| string,
  ) => {
    setEntryRules((prevEntryRules) => {
      const updatedEntryRules = [...prevEntryRules];
      updatedEntryRules[EntryIndex] = { ...updatedEntryRules[EntryIndex], [field]: value };
      // updatedEntryRules[EntryIndex] = { ...updatedEntryRules[EntryIndex] };
      console.log("updatedEntryRules", updatedEntryRules);
      return updatedEntryRules;
      
    });
  };

  const handleExitRuleChange = (
    exitIndex: number,
    field: keyof ExitRule,
    value: number|string,
    
  ) => {
    setExitRules((prevExitRules) => {
      const updatedExitRules = [...prevExitRules];
      updatedExitRules[exitIndex] = { ...updatedExitRules[exitIndex], [field]: value };
      // updatedExitRules[exitIndex] = { ...updatedExitRules[exitIndex] };
      console.log("updatedExitRules", updatedExitRules);
      return updatedExitRules;
      
    });
  };

  const addEntryRule = () => {
    // console.log("addEntryRule", entryRules);
    setEntryRules((prevEntryRules: EntryRule[]) => [
      ...prevEntryRules,
      {
        strategyID: stratid,
        ruleType: "entryRule",
        ruleAction: "None",
        indicatorId: 0,
        operator: "",
        value: 0,
        sequence: 0,
        logicalOperator: "",
        compareTo: "",
        compIndicatorId: 0,
        slope: "",
        priceAction: "",
      },
    ]);
  };
  
  const addExitRule = () => {
    setExitRules((prevExitRules: ExitRule[]) => [
      ...prevExitRules,
      {
        strategyID: stratid,
        ruleType: "exitRule",
        ruleAction: "None",
        indicatorId: 0,
        operator: "",
        value: 0,
        sequence: 0,
        logicalOperator: "",
        compareTo: "",
        compIndicatorId: 0,
        slope: "",
        priceAction: "",
      },
    ]);
  };


  const removeEntryRule = (EntryIndex: number) => {
    setEntryRules((prevRules) => {
      const updatedEntryRules = [...prevRules];
      updatedEntryRules.splice(EntryIndex, 1);
      return updatedEntryRules;
    });
  };

  const removeExitRule = (index: number) => {
    setExitRules((prevRules) => {
      const updatedExitRules = [...prevRules];
      updatedExitRules.splice(index, 1);
      return updatedExitRules;
    });
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-wrap justify-center gap-4 py-8 px-72'>
      <Card className="flex w-full flex-col">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Entry Rules</CardTitle>
          <CardDescription className="items-center justify-between text-sm text-gray-500">
            Select the indicators you want to use for entry rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {entryRules.map((rule, EntryIndex) => (
              <div key={EntryIndex} className="flex items-center gap-2">
                 <div>
                        <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "ruleType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long">{"Long"}</SelectItem>
                          <SelectItem value="short">{"short"}</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>
                <Select
                  onValueChange={(value) =>
                    handleEntryRuleChange(EntryIndex, "indicatorId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(indicatorData).map(([id, data]) =>
                      data.details.map((indicator) => (
                        <SelectItem
                          key={`${pageId}-${id}-${indicator.id}`}
                          value={`${indicator.id}`}
                        >
                          {`${indicator.name}-${id}`}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                  </Select>

            <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "compareTo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Compare to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indicator">{"indicator"}</SelectItem>
                <SelectItem value="threshold">{"threshold"}</SelectItem>
                <SelectItem value="slope">{"slope"}</SelectItem>
                <SelectItem value="price">{"price"}</SelectItem>
              </SelectContent>
            </Select>
            {entryRules[EntryIndex]?.compareTo === "indicator"  &&(
              <div>
              <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "operator", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crossOver">{"Cross Over"}</SelectItem>
                <SelectItem value="crossUnder">{"Cross Under"}</SelectItem>
              </SelectContent>
            </Select>
            </div>
          )}
          {entryRules[EntryIndex]?.compareTo === "indicator"  &&(

            <Select
            onValueChange={(value) =>
              handleEntryRuleChange(EntryIndex, "compIndicatorId", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an indicator" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(indicatorData).map(([id, data]) =>
                data.details.map((indicator) => (
                  <SelectItem
                    key={`${pageId}-${id}-${indicator.id}`}
                    value={`${indicator.id}`}>
                    {`${indicator.name}-${id}`}
                  </SelectItem>
                )),
              )}
            </SelectContent>
          </Select>
          )}

            {entryRules[EntryIndex]?.compareTo === "threshold"  &&(
              <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "operator", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<">{"<"}</SelectItem>
                <SelectItem value=">">{">"}</SelectItem>
                <SelectItem value="=">{"="}</SelectItem>
                <SelectItem value="<=">{"<="}</SelectItem>
                <SelectItem value=">=">{">="}</SelectItem>
              </SelectContent>
            </Select>
            )}
            {entryRules[EntryIndex]?.compareTo === "threshold"  &&(
            
                <Input
                  type="number"
                  placeholder="Value"
                  onChange={(e) =>
                    handleEntryRuleChange(
                      EntryIndex,
                      "value",
                      parseFloat(e.target.value),
                    )
                  }
                />)}

              {entryRules[EntryIndex]?.compareTo === "slope"  &&(
              <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "slope", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">{"positive"}</SelectItem>
                <SelectItem value="negative">{"negative"}</SelectItem>
                <SelectItem value="zero">{"zero"}</SelectItem>
                <SelectItem value="positiveOrZero">{"positiveOrZero"}</SelectItem>
                <SelectItem value="negativeOrZero">{"negativeOrZero"}</SelectItem>
              </SelectContent>
            </Select>
            )}
            {entryRules[EntryIndex]?.compareTo === "price"  &&(
              <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "operator", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<">{"<"}</SelectItem>
                <SelectItem value=">">{">"}</SelectItem>
                <SelectItem value="=">{"="}</SelectItem>
                <SelectItem value="<=">{"<="}</SelectItem>
                <SelectItem value=">=">{">="}</SelectItem>
              </SelectContent>
            </Select>
            )} 
            {entryRules[EntryIndex]?.compareTo === "price"  &&(
              <Select onValueChange={(value) => handleEntryRuleChange(EntryIndex, "priceAction", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selct price action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Close">{"Close"}</SelectItem>
                <SelectItem value="Open">{"Open"}</SelectItem>
                <SelectItem value="High">{"High"}</SelectItem>
                <SelectItem value="Low">{"Low"}</SelectItem>
              </SelectContent>
            </Select>
            
            )} 

                {/* Add other form elements for entry rules */}
                <Button
                  variant="destructive"
                  onClick={() => removeEntryRule(EntryIndex)}
                >
                  Delete
                </Button>
              </div>
            ))
      }
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={() => addEntryRule()}>Add Entry Rule</Button>
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
          {exitRules.map((rule, exitIndex) => (
              <div key={exitIndex} className="flex items-center gap-2">
                 <div>
                        <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "ruleType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="trade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="long">{"Long"}</SelectItem>
                          <SelectItem value="short">{"short"}</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>
                <Select
                  onValueChange={(value) =>
                    handleExitRuleChange(exitIndex, "indicatorId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(indicatorData).map(([id, data]) =>
                      data.details.map((indicator) => (
                        <SelectItem
                          key={`${pageId}-${id}-${indicator.id}`}
                          value={`${indicator.id}`}>
                          {`${indicator.name}-${id}`}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
               
            <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "compareTo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Compare to" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indicator">{"indicator"}</SelectItem>
                <SelectItem value="threshold">{"threshold"}</SelectItem>
                <SelectItem value="slope">{"slope"}</SelectItem>
                <SelectItem value="price">{"price"}</SelectItem>
              </SelectContent>
            </Select>
            {exitRules[exitIndex]?.compareTo === "indicator"  &&(
              <div>
              <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "operator", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crossOver">{"Cross Over"}</SelectItem>
                <SelectItem value="crossUnder">{"Cross Under"}</SelectItem>
              </SelectContent>
            </Select>
            
            </div>
          )}
            {exitRules[exitIndex]?.compareTo === "indicator"  &&(
            <Select
            onValueChange={(value) =>
              handleExitRuleChange(exitIndex, "compIndicatorId", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an indicator" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(indicatorData).map(([id, data]) =>
                data.details.map((indicator) => (
                  <SelectItem
                    key={`${pageId}-${data.id}-${indicator.id}`}
                    value={`${indicator.id}`}>
                    {`${indicator.name}-${id}`}
                  </SelectItem>
                )),
              )}
            </SelectContent>
          </Select>
            )}

            {exitRules[exitIndex]?.compareTo === "threshold"  &&(
              <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "operator", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<">{"<"}</SelectItem>
                <SelectItem value=">">{">"}</SelectItem>
                <SelectItem value="=">{"="}</SelectItem>
                <SelectItem value="<=">{"<="}</SelectItem>
                <SelectItem value=">=">{">="}</SelectItem>
              </SelectContent>
            </Select>
            )}
            {exitRules[exitIndex]?.compareTo === "threshold"  &&(
            
                <Input
                  type="number"
                  placeholder="Value"
                  onChange={(e) =>
                    handleExitRuleChange(
                      exitIndex,
                      "value",
                      parseFloat(e.target.value),
                    )
                  }
                />)}

              {exitRules[exitIndex]?.compareTo === "slope"  &&(
              <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "slope", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">{"positive"}</SelectItem>
                <SelectItem value="negative">{"negative"}</SelectItem>
                <SelectItem value="zero">{"zero"}</SelectItem>
                <SelectItem value="positiveOrZero">{"positiveOrZero"}</SelectItem>
                <SelectItem value="negativeOrZero">{"negativeOrZero"}</SelectItem>
              </SelectContent>
            </Select>
            )}
              {exitRules[exitIndex]?.compareTo === "price"  &&(
              <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "operator", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Comparison" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<">{"<"}</SelectItem>
                <SelectItem value=">">{">"}</SelectItem>
                <SelectItem value="=">{"="}</SelectItem>
                <SelectItem value="<=">{"<="}</SelectItem>
                <SelectItem value=">=">{">="}</SelectItem>
              </SelectContent>
            </Select>
            )}
            {exitRules[exitIndex]?.compareTo === "price"  &&(
              <Select onValueChange={(value) => handleExitRuleChange(exitIndex, "priceAction", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selct price action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Close">{"Close"}</SelectItem>
                <SelectItem value="Open">{"Open"}</SelectItem>
                <SelectItem value="High">{"High"}</SelectItem>
                <SelectItem value="Low">{"Low"}</SelectItem>
              </SelectContent>
            </Select>
            )}


                {/* Add other form elements for entry rules */}
                <Button
                  variant="destructive"
                  onClick={() => removeExitRule(exitIndex)}
                >
                  Delete
                </Button>
              </div>
              
            ))
          }
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={() => addExitRule()}>Add ExitR Rule</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
export default StrategyRules;
