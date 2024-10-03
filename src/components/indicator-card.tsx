// src/components/indicator-card.tsx
import { useState } from 'react';
import { api } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IndicatorCardProps {
  id: string;
  groups: any[];
  onIndicatorData: (id: string, data: any) => void;
}

export function IndicatorCard({ id, groups, onIndicatorData }: IndicatorCardProps): JSX.Element {
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
  const [selectedIndicator, setSelectedIndicator] = useState<string[]>([]);

  const { data: indicators } = api.queries.getIndicatorsOfGroup.useQuery(
    { group: selectedGroup ?? "" },
    { enabled: !!selectedGroup }
  );

  const { data: indicatorDetails } = api.queries.getIndicatorsDetails.useQuery(
    { name: selectedIndicator || "" },
    { enabled: !!selectedIndicator }
  );

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedIndicator(undefined);
  };

  const handleIndicatorChange = (value: string) => {
    setSelectedIndicator(value);
    onIndicatorData(id, { group: selectedGroup, indicator: value });
  };

  return (
    <Card className="w-full max-w-xs" style={{ height: '350px' }}>
      <CardHeader>
        <CardTitle>Indicator Card {id}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedGroup} onValueChange={handleGroupChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent>
            {groups?.map((group, index) => (
              <SelectItem key={`${index}-${id}`} value={group.group}>
                {group.group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedGroup && (
          <Select value={selectedIndicator} onValueChange={handleIndicatorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Indicator" />
            </SelectTrigger>
            <SelectContent>
              {indicators?.map((indicator, index) => (
                <SelectItem key={`${id}-${indicator.name}-${index}`} value={indicator.name}>
                  {indicator.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
      <CardFooter>
        {indicatorDetails && (
          <p>{indicatorDetails[0]?.description}</p>
        )}
      </CardFooter>
    </Card>
  );
}