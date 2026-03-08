import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUpdateInvestment } from '@/hooks/useInvestments';
import type { InvestmentWithMetrics } from '@/types';

const investmentSchema = z.object({
  name: z.string().trim().min(1, 'Investment name is required').max(100, 'Name must be less than 100 characters'),
  symbol: z.string().trim().min(1, 'Symbol is required').max(10, 'Symbol must be less than 10 characters'),
  shares: z.number().positive('Shares must be greater than 0'),
  currentPrice: z.number().positive('Price must be greater than 0'),
  purchasePrice: z.number().positive('Purchase price must be greater than 0').optional(),
  purchaseDate: z.string().optional()
});

interface EditInvestmentDialogProps {
  investment: InvestmentWithMetrics | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditInvestmentDialog = ({ investment, open, onOpenChange, onSuccess }: EditInvestmentDialogProps) => {
  const { toast } = useToast();
  const updateMutation = useUpdateInvestment();
  const [editing, setEditing] = useState<InvestmentWithMetrics | null>(null);

  useEffect(() => {
    setEditing(investment);
  }, [investment]);

  const updateInvestmentHandler = async () => {
    if (!editing) return;
    try {
      const validatedData = investmentSchema.parse({
        name: editing.name,
        symbol: editing.symbol,
        shares: editing.shares,
        currentPrice: editing.current_price,
        purchasePrice: editing.purchase_price ?? undefined,
        purchaseDate: editing.purchase_date ?? undefined
      });
      await updateMutation.mutateAsync({
        id: editing.id,
        name: validatedData.name,
        symbol: validatedData.symbol,
        shares: validatedData.shares,
        current_price: validatedData.currentPrice,
        purchase_price: validatedData.purchasePrice,
        purchase_date: validatedData.purchaseDate,
      });
      onOpenChange(false);
      onSuccess();
      toast({ title: 'Investment updated', description: 'Your investment has been successfully updated.' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: 'Invalid input', description: error.issues[0].message, variant: 'destructive' });
      } else {
        toast({ title: 'Error', description: 'Failed to update investment', variant: 'destructive' });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Investment</DialogTitle>
          <DialogDescription>Update the details of your investment.</DialogDescription>
        </DialogHeader>
        {editing && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Investment Name</Label>
              <Input id="edit-name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g., Reliance Industries" />
            </div>
            <div>
              <Label htmlFor="edit-symbol">Symbol</Label>
              <Input id="edit-symbol" value={editing.symbol} onChange={(e) => setEditing({ ...editing, symbol: e.target.value.toUpperCase() })} placeholder="e.g., RELIANCE" />
            </div>
            <div>
              <Label htmlFor="edit-shares">Number of Shares</Label>
              <Input id="edit-shares" type="number" min="0.001" step="0.001" value={editing.shares || ''} onChange={(e) => setEditing({ ...editing, shares: parseFloat(e.target.value) || 0 })} placeholder="e.g., 10" />
            </div>
            <div>
              <Label htmlFor="edit-price">Current Price (₹)</Label>
              <Input id="edit-price" type="number" min="0.01" step="0.01" value={editing.current_price || ''} onChange={(e) => setEditing({ ...editing, current_price: parseFloat(e.target.value) || 0 })} placeholder="e.g., 2845.50" />
            </div>
            <div>
              <Label htmlFor="edit-purchasePrice">Purchase Price (₹)</Label>
              <Input id="edit-purchasePrice" type="number" min="0.01" step="0.01" value={editing.purchase_price || ''} onChange={(e) => setEditing({ ...editing, purchase_price: parseFloat(e.target.value) || 0 })} placeholder="e.g., 2600.00" />
            </div>
            <div>
              <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
              <Input id="edit-purchaseDate" type="date" value={editing.purchase_date || ''} onChange={(e) => setEditing({ ...editing, purchase_date: e.target.value })} />
            </div>
            <Button onClick={updateInvestmentHandler} className="w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update Investment'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditInvestmentDialog;
