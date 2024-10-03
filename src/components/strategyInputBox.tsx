import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {Card} from "@/components/ui/card"

export function StrategyInputBox({ onStrategyChange }) {
    return (
        <Card className="flex flex-col gap-4" >
            <Card className="flex items-center gap-2">
                <div className="grid gap-0.5">
                    <Card title="Strategy Name" className="text-xl font-semibold">
                        <Input placeholder="Strategy Name" value={} onChange={(e) => onStrategyChange(e.target.value)} />
                    </Card>
                    <Card title="Strategy Description" className="text-xl font-semibold">
                        <Textarea placeholder="Strategy Description" /> 
                    </Card>
                </div>
            </Card>
        </Card>
        )
};
                