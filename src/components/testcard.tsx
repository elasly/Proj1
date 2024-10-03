"use client";
import { useState, useEffect, useCallback } from "react";

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
  SelectLabel,
  SelectSeparator,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { getindicatorOfGroup } from "@/server/db/queries";

function IndicatorCard() {
  const [IndGroup, setIndGroup] = useState("");
  const [Indicator, setIndicator] = useState("");
  const [Newindicatorlist, setNewindicatorlist] = useState([]);

  const fetchIndicators = useCallback(async () => {
    if (IndGroup) {
      try {
        console.log("Fetching indicators for group:", IndGroup);
        const { data } = await getindicatorOfGroup(IndGroup);
        console.log("Fetched indicators:", data);
        setNewindicatorlist(data);
      } catch (error) {
        console.error("Error fetching indicators:", error);
      }
    }
  }, [IndGroup]);

  useEffect(() => {
    fetchIndicators();
  }, [IndGroup, fetchIndicators]);

  const onGroupChange = (val: string) => {
    if (val === "") {
    } else setIndGroup(val);
    fetchIndicators();
    console.log("Group value changed to", val);
  };

  const onIndicatorChange = (val: string) => {
    if (val === "") {
    } else setIndicator(val);
    // console.log("indicator value changed to", val);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full max-w-xs">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Indicator Card
          </CardTitle>
          <CardDescription className="items-center justify-between text-sm text-gray-500">
            Select the Group containing your desired indicator.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Select onValueChange={onGroupChange} value={IndGroup}>
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator Group" />
            </SelectTrigger>
            <SelectContent className="w-64">
              <SelectGroup>
                <SelectLabel>IndicatorGroups</SelectLabel>
                <SelectSeparator />
                <SelectItem value="Cycle Indicators">
                  Cycle Indicators
                </SelectItem>
                <SelectItem value="Math Operators">Math Operators</SelectItem>
                <SelectItem value="Math Transform">Math Transform</SelectItem>
                <SelectItem value="Momentum Indicators">
                  Momentum Indicators
                </SelectItem>
                <SelectItem value="Overlap Studies">Overlap Studies</SelectItem>
                <SelectItem value="Pattern Recognition">
                  Pattern Recognition
                </SelectItem>
                <SelectItem value="Price Transform">Price Transform</SelectItem>
                <SelectItem value="Statistic Functions">
                  Statistic Functions
                </SelectItem>
                <SelectItem value="Volatility Indicators">
                  Volatility Indicators
                </SelectItem>
                <SelectItem value="Volume Indicators">
                  Volume Indicators
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
        <CardContent>
          <Select onValueChange={onIndicatorChange} value={Indicator}>
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent className="w-64">
              <SelectGroup>
                <SelectLabel>{IndGroup}</SelectLabel>
                <SelectSeparator />
                {Newindicatorlist.map((perIndicator) => (
                  <SelectItem
                    id={perIndicator.id}
                    value={perIndicator.name}
                    key={perIndicator.id}
                  >
                    {perIndicator.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          Selected value is {IndGroup}
        </CardFooter>
      </Card>
    </div>
  );
}
export { IndicatorCard };
