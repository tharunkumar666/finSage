import { useState } from 'react';
import { TrendingUp, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';
import InvestmentOverview, { PortfolioAnalysis } from '@/components/investments/InvestmentOverview';
import InvestmentHoldings from '@/components/investments/InvestmentHoldings';
import AddInvestmentDialog from '@/components/investments/AddInvestmentDialog';
import EditInvestmentDialog from '@/components/investments/EditInvestmentDialog';
import InvestmentRecommendations from '@/components/investments/InvestmentRecommendations';
import { useInvestments, useDeleteInvestment } from '@/hooks/useInvestments';
import { useToast } from '@/hooks/use-toast';
import type { InvestmentWithMetrics } from '@/types';

const Investments = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<InvestmentWithMetrics | null>(null);

  const { data: rawInvestments, isLoading } = useInvestments();
  const deleteMutation = useDeleteInvestment();

  const userInvestments: InvestmentWithMetrics[] = (rawInvestments ?? []).map(inv => {
    const totalValue = Number(inv.shares) * Number(inv.current_price);
    const purchaseValue = inv.purchase_price ? Number(inv.shares) * Number(inv.purchase_price) : totalValue;
    const gainLoss = totalValue - purchaseValue;
    const gainLossPercent = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
    return { ...inv, totalValue, gainLoss, gainLossPercent };
  });

  const removeInvestment = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Investment removed', description: 'Your investment has been successfully removed.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to remove investment', variant: 'destructive' });
    }
  };

  const openEditDialog = (investment: InvestmentWithMetrics) => {
    setEditingInvestment(investment);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <PageTransition>
        <main id="main-content" role="main" className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-600" />
                Investment Portfolio
              </h1>
              <p className="text-muted-foreground">Manage and track your investments</p>
            </div>
            <Button className="gradient-bg text-primary-foreground" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Investment
            </Button>
          </div>

          <AddInvestmentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onSuccess={() => {}} />
          <EditInvestmentDialog investment={editingInvestment} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} onSuccess={() => setEditingInvestment(null)} />

          <InvestmentOverview investments={userInvestments} />

          <Tabs defaultValue="holdings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="holdings">My Holdings</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="holdings" className="space-y-6">
              <InvestmentHoldings investments={userInvestments} isLoading={isLoading} onEdit={openEditDialog} onDelete={removeInvestment} />
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <InvestmentRecommendations investments={userInvestments} />
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <PortfolioAnalysis investments={userInvestments} />
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Transactions</CardTitle>
                  <CardDescription className="text-muted-foreground">Your latest investment activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Transaction history coming soon</p>
                    <p className="text-sm text-muted-foreground mt-1">We're working on tracking your buy/sell activity automatically.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
};

export default Investments;
