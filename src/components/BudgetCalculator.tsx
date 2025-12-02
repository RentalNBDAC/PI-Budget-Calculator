import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { itemData, getUniqueLocations, getUniqueUnits, filterItems, ItemData } from "@/data/itemData";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const BudgetCalculator = () => {
  const [budget, setBudget] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filteredItems, setFilteredItems] = useState<ItemData[]>([]);

  const locations = getUniqueLocations();
  const units = getUniqueUnits();

  useEffect(() => {
    if (selectedLocation && selectedUnit) {
      setFilteredItems(filterItems(selectedLocation, selectedUnit));
      setSelectedItems(new Set());
    }
  }, [selectedLocation, selectedUnit]);

  useEffect(() => {
    if (locations.length > 0) setSelectedLocation(locations[0]);
    if (units.length > 0) setSelectedUnit(units[0]);
  }, []);

  const getItemKey = (item: ItemData) => 
    `${item.location}-${item.unit}-${item.name}`;

  const toggleItem = (item: ItemData) => {
    const key = getItemKey(item);
    const newSelected = new Set(selectedItems);
    
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    
    setSelectedItems(newSelected);
  };

  const calculateTotal = () => {
    return filteredItems
      .filter(item => selectedItems.has(getItemKey(item)))
      .reduce((sum, item) => sum + item.price, 0);
  };

  const total = calculateTotal();
  const isOverBudget = budget > 0 && total > budget;
  const isBudgetReached = budget > 0 && total >= budget;
  const remaining = budget > 0 ? budget - total : 0;

  const selectedItemsList = filteredItems.filter(item => 
    selectedItems.has(getItemKey(item))
  );

  const isItemDisabled = (item: ItemData) => {
    if (selectedItems.has(getItemKey(item))) return false;
    if (budget <= 0) return false;
    return total + item.price > budget;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 md:p-10 shadow-elegant border-2">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Price Intelligence
            </h1>
            <p className="text-muted-foreground text-lg">Budget Calculator</p>
          </div>

          {/* Budget Input */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <Label htmlFor="budget" className="text-lg font-semibold text-foreground mb-3 block">
              Your Budget (Target Max Value)
            </Label>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">RM</span>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget"
                value={budget || ""}
                onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                className="text-2xl font-mono h-14 border-2 focus-visible:ring-primary"
                min="0"
                step="0.01"
              />
            </div>
          </Card>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <Label className="text-base font-semibold mb-3 block">Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-base font-semibold mb-3 block">Unit</Label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🛒 Your Selection
              {selectedItemsList.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedItemsList.length}
                </Badge>
              )}
            </h2>
            <Card className="p-4 min-h-[120px] max-h-64 overflow-y-auto bg-success-light border-success/30">
              {selectedItemsList.length === 0 ? (
                <p className="text-center text-muted-foreground italic py-8">
                  No items selected yet
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedItemsList.map(item => (
                    <div 
                      key={getItemKey(item)} 
                      className="flex justify-between items-center p-3 bg-card rounded-lg border"
                    >
                      <span className="font-medium text-success-foreground">{item.name}</span>
                      <span className="font-bold text-success">
                        RM {item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Available Items */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Available Items</h2>
            <Card className="p-4 max-h-96 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <p className="text-center text-danger font-semibold py-8">
                  No items for this location/unit combination
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredItems.map(item => {
                    const key = getItemKey(item);
                    const disabled = isItemDisabled(item);
                    
                    return (
                      <div
                        key={key}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-smooth
                          ${disabled ? 'opacity-50 bg-muted' : 'bg-card hover:bg-accent/10 hover:border-primary/50'}`}
                      >
                        <div className="flex items-center gap-4 flex-grow">
                          <Checkbox
                            id={key}
                            checked={selectedItems.has(key)}
                            onCheckedChange={() => toggleItem(item)}
                            disabled={disabled}
                            className="h-5 w-5"
                          />
                          <Label
                            htmlFor={key}
                            className={`text-base font-medium cursor-pointer
                              ${disabled ? 'cursor-not-allowed' : ''}`}
                          >
                            {item.name}
                          </Label>
                        </div>
                        <span className="text-lg font-bold text-primary ml-4">
                          RM {item.price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Total Summary */}
          <Card className={`p-6 transition-smooth ${
            isOverBudget 
              ? 'bg-danger-light border-danger' 
              : isBudgetReached 
              ? 'bg-success-light border-success' 
              : 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-4xl font-extrabold text-primary">
                RM {total.toFixed(2)}
              </span>
            </div>

            {budget > 0 && (
              <div className={`p-4 rounded-lg flex items-center gap-3 transition-smooth ${
                isOverBudget 
                  ? 'bg-danger text-danger-foreground' 
                  : isBudgetReached 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-warning-light text-foreground'
              }`}>
                {isOverBudget ? (
                  <>
                    <AlertCircle className="h-6 w-6" />
                    <div>
                      <p className="font-bold">⚠️ OVER BUDGET!</p>
                      <p>Total (RM {total.toFixed(2)}) exceeds budget by RM {Math.abs(remaining).toFixed(2)}</p>
                    </div>
                  </>
                ) : isBudgetReached ? (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    <div>
                      <p className="font-bold">✅ Budget Reached!</p>
                      <p>Selection complete</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Info className="h-6 w-6" />
                    <div>
                      <p className="font-bold">Budget Remaining:</p>
                      <p className="text-xl font-bold">RM {remaining.toFixed(2)}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default BudgetCalculator;
