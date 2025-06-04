
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterState {
  riskLevels: string[];
  sectors: string[];
  recommendations: string[];
  priceRange: [number, number];
  marketCap: string;
  dividendYield: string;
}

interface InvestmentFilterProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const InvestmentFilter = ({ isOpen, onOpenChange, onApplyFilters, onClearFilters }: InvestmentFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({
    riskLevels: [],
    sectors: [],
    recommendations: [],
    priceRange: [0, 1000],
    marketCap: '',
    dividendYield: ''
  });

  const riskOptions = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
  const sectorOptions = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods', 'Real Estate'];
  const recommendationOptions = ['Strong Buy', 'Buy', 'Hold', 'Sell'];

  const handleRiskChange = (risk: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      riskLevels: checked 
        ? [...prev.riskLevels, risk]
        : prev.riskLevels.filter(r => r !== risk)
    }));
  };

  const handleSectorChange = (sector: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      sectors: checked 
        ? [...prev.sectors, sector]
        : prev.sectors.filter(s => s !== sector)
    }));
  };

  const handleRecommendationChange = (rec: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      recommendations: checked 
        ? [...prev.recommendations, rec]
        : prev.recommendations.filter(r => r !== rec)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      riskLevels: [],
      sectors: [],
      recommendations: [],
      priceRange: [0, 1000],
      marketCap: '',
      dividendYield: ''
    });
    onClearFilters();
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Investments
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Risk Level */}
          <div>
            <Label className="text-base font-medium mb-3 block">Risk Level</Label>
            <div className="space-y-2">
              {riskOptions.map((risk) => (
                <div key={risk} className="flex items-center space-x-2">
                  <Checkbox
                    id={`risk-${risk}`}
                    checked={filters.riskLevels.includes(risk)}
                    onCheckedChange={(checked) => handleRiskChange(risk, !!checked)}
                  />
                  <Label htmlFor={`risk-${risk}`} className="text-sm">{risk}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div>
            <Label className="text-base font-medium mb-3 block">Sectors</Label>
            <div className="space-y-2">
              {sectorOptions.map((sector) => (
                <div key={sector} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sector-${sector}`}
                    checked={filters.sectors.includes(sector)}
                    onCheckedChange={(checked) => handleSectorChange(sector, !!checked)}
                  />
                  <Label htmlFor={`sector-${sector}`} className="text-sm">{sector}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <Label className="text-base font-medium mb-3 block">Recommendations</Label>
            <div className="space-y-2">
              {recommendationOptions.map((rec) => (
                <div key={rec} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rec-${rec}`}
                    checked={filters.recommendations.includes(rec)}
                    onCheckedChange={(checked) => handleRecommendationChange(rec, !!checked)}
                  />
                  <Label htmlFor={`rec-${rec}`} className="text-sm">{rec}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Market Cap */}
          <div>
            <Label className="text-base font-medium mb-3 block">Market Cap</Label>
            <Select value={filters.marketCap} onValueChange={(value) => setFilters(prev => ({ ...prev, marketCap: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select market cap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="small">Small Cap (< $2B)</SelectItem>
                <SelectItem value="mid">Mid Cap ($2B - $10B)</SelectItem>
                <SelectItem value="large">Large Cap (> $10B)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dividend Yield */}
          <div>
            <Label className="text-base font-medium mb-3 block">Dividend Yield</Label>
            <Select value={filters.dividendYield} onValueChange={(value) => setFilters(prev => ({ ...prev, dividendYield: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select dividend yield" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="0-2">0% - 2%</SelectItem>
                <SelectItem value="2-4">2% - 4%</SelectItem>
                <SelectItem value="4+">4%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={clearAllFilters} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentFilter;
