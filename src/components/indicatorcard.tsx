// src/components/indicatorcard.tsx
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
// import { getindicatorOfGroup, getindicatorGroup, getindicatorDetails } from "@/server/db/queries";
import type { entryRules, exitRules, indicator, strategies, riskManagement,  } from "@/server/db/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { api } from "@/utils/api";
import { set } from "date-fns";
import { group } from "console";



interface IndicatorGroup 
  {
  key: number;
  group: string;   
}



interface IndicatorDetail {
  id: number;
  description: string;
  inputs: string;
  outputs: string;
  inputsMap: Record<string, string>;
}



interface IndicatorCardProps {
  id: string;
  onIndicatorData: (id: string, data: typeof indicator) => void;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({ id, onIndicatorData }) => {
   
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState<typeof indicator[]>([]);
  const [indicators, setIndicators] = useState< typeof indicator[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState("");
  const [indicatorDetails, setIndicatorDetails] = useState<IndicatorDetail[]>([]);

  const prevSelectedGroupRef = useRef("");
  const prevSelectedIndicatorRef = useRef("");
  const prevIndicatorDetailsRef = useRef<IndicatorDetail[]>([]);
  const { data: groupsData, isLoading } = api.queries.getIndGroups.useQuery();
  const { data: indicatorsData, refetch: refetchIndicators } = api.queries.getIndicatorsOfGroup.useQuery(
    { group: selectedGroup },
    { enabled: false }
  );
  const { data: indicatorDetailsData, refetch: refetchIndicatorDetails } = api.queries.getIndicatorsDetails.useQuery(
    { name: selectedIndicator },
    { enabled: true }
  );

  useEffect(() => {
    if (groupsData) {
      setGroups(groupsData);
    }
  }, [groupsData]);

  useEffect(() => {
    const data = {
      group: selectedGroup,
      name: selectedIndicator,
      details: indicatorDetails,
    };

    if (
      selectedGroup !== prevSelectedGroupRef.current ||
      selectedIndicator !== prevSelectedIndicatorRef.current ||
      JSON.stringify(indicatorDetails) !== JSON.stringify(prevIndicatorDetailsRef.current)
    ) {
      onIndicatorData(id, data);
    }

    prevSelectedGroupRef.current = selectedGroup;
    prevSelectedIndicatorRef.current = selectedIndicator;
    prevIndicatorDetailsRef.current = indicatorDetails;
  }, [selectedGroup, selectedIndicator, indicatorDetails, id, onIndicatorData]);

  useEffect(() => {
    if (selectedGroup) {
      refetchIndicators();
    }
  }, [selectedGroup, refetchIndicators]);

  useEffect(() => {
    if (indicatorsData) {
      setIndicators(indicatorsData);
    }
  }, [indicatorsData]);

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    setSelectedIndicator("");
    setIndicatorDetails([]);
  };

  const handleIndicatorChange = async (indicator: string) => {
    setSelectedIndicator(indicator);
    if (indicator) {
      await refetchIndicatorDetails();
    } else {
      setIndicatorDetails([]);
    }
  };

  useEffect(() => {
    if (indicatorDetailsData) {
      const parsedDetails = parseInputs(indicatorDetailsData);
      setIndicatorDetails(parsedDetails);
    }
  }, [indicatorDetailsData]);

  const handleInputChange = (detailId: number, key: string, value: string) => {
    setIndicatorDetails((prevDetails) =>
      prevDetails.map((detail) => {
        if (detail.id === detailId) {
          const updatedInputsMap = { ...detail.inputsMap, [key]: value };
          const inputsArray = detail.inputs.replace(/^{/, '').replace(/}$/, '').split(",");
          const updatedInputsArray = inputsArray.map((input) => {
            const [inputKey] = input.split("=");
            return inputKey === key ? `${key}=${value}` : input;
          });
          const updatedInputs = `{${updatedInputsArray.join(",")}}`;
          return { ...detail, inputsMap: updatedInputsMap, inputs: updatedInputs };
        }
        return detail;
      })
    );
  };

  const parseInputs = (details: IndicatorDetail[]): IndicatorDetail[] => {
    return details.map((detail) => {
      const inputsString = detail.inputs.replace(/^{/, '').replace(/}$/, '');
      const inputsArray = inputsString.split(",");
      const inputsMap: Record<string, string> = {};

      // inputsArray.forEach((input) => {
      //   const [key, value] = input.split("=");
      //   if (value) {
      //     inputsMap[key] = value;
      //   } else {}
      // });
      Object.entries(inputsArray).forEach(([key, value]) => {
        if (value !== undefined) {
          inputsMap[key as keyof typeof inputsMap] = value;
        }
      });

      return {
        ...detail,
        inputsMap,
      };
    });
  };

  return (
    <div key = {id} className="flex flex-col gap-4" >
      <Card className="w-full max-w-xs" style={{ height: '350px' }}>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Indicator Card {id}</CardTitle>
          <CardDescription className="items-center justify-between text-sm text-gray-500">
            Select the Group containing your desired indicator.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Select onValueChange={handleGroupChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Group" />
            </SelectTrigger>
            <SelectContent className="w-64">
              {groups.map((group, index) => (
                <SelectItem key={`${index}-${id}`} value={group.group}>
                  {group.group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardContent>
          <Select onValueChange={handleIndicatorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent className="w-64">
              {indicators.map((indicatorObj, index) => (
                <SelectItem key={`${id}-${indicatorObj.id}-${index}`} value={indicatorObj.name}>
                  {indicatorObj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Popover>
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger>
                    {indicatorDetails.map((indicatorObj, index) => (
                      <button
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                        key={`des-${index}-${indicatorObj.id}-${id}`}
                      >
                        {indicatorObj.description}
                      </button>
                    ))}
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent className="w-80 max-h-30 overflow-auto">
                  <p>Click to modify indicator parameters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Parameters</h4>
                  <p className="text-sm text-muted-foreground">
                    You can change the parameters of the indicator here.
                  </p>
                </div>
                <div className="grid gap-2">
                  {indicatorDetails.map((indicatorObj, index) => (
                    <div className="grid grid-cols-3 items-center gap-4" key={`${id}-${indicatorObj.id}-${index}`}>
                    {Object.entries(indicatorObj.inputsMap || {}).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <Label htmlFor={key}>{key}</Label>
                        <Input
                          id={key}
                          defaultValue={value}
                          className="col-span-2 h-8"
                          onChange={(e) => handleInputChange(indicatorObj.id, key, e.target.value)}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  </div>
);
};

export default IndicatorCard;