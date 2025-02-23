
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ROIOption {
  type: 'Low' | 'Medium' | 'High';
  sellingPrice: number;
  fees: number;
  profit: number;
  roi: number;
}

interface ROIAnalysisProps {
  options: ROIOption[];
  onApprove: (option: ROIOption) => void;
  onSaveForLater: (option: ROIOption) => void;
}

export const ROIAnalysis = ({ options, onApprove, onSaveForLater }: ROIAnalysisProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideIn">
      {options.map((option) => (
        <Card key={option.type} className="p-6 hover:shadow-lg transition-shadow">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                {option.type} ROI
              </span>
              <span className="text-2xl font-bold">${option.sellingPrice}</span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>eBay Fees:</span>
                <span>-${option.fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-foreground">
                <span>Profit:</span>
                <span className="text-green-600">${option.profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>ROI:</span>
                <span>{option.roi.toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1"
                onClick={() => onApprove(option)}
                variant="default"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                className="flex-1"
                onClick={() => onSaveForLater(option)}
                variant="secondary"
              >
                Save
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
