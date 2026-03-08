
import { useState } from 'react';
import { Target, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/PageTransition';

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
  progress: number;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 3500,
      deadline: '2024-12-31',
      category: 'Safety',
      progress: 35
    },
    {
      id: 2,
      name: 'House Down Payment',
      target: 50000,
      current: 12000,
      deadline: '2026-06-30',
      category: 'Investment',
      progress: 24
    },
    {
      id: 3,
      name: 'Retirement Fund',
      target: 100000,
      current: 15420,
      deadline: '2035-12-31',
      category: 'Retirement',
      progress: 15
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 0,
    current: 0,
    deadline: '',
    category: 'Investment'
  });

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addGoal = () => {
    if (newGoal.name && newGoal.target > 0) {
      const progress = newGoal.current > 0 ? (newGoal.current / newGoal.target) * 100 : 0;
      const goal: Goal = {
        ...newGoal,
        id: Date.now(),
        progress: Math.round(progress)
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', target: 0, current: 0, deadline: '', category: 'Investment' });
      setIsDialogOpen(false);
    }
  };

  const updateGoal = (id: number, updates: Partial<Goal>) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const updated = { ...goal, ...updates };
        updated.progress = Math.round((updated.current / updated.target) * 100);
        return updated;
      }
      return goal;
    }));
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Safety': return 'bg-green-100 text-green-800';
      case 'Investment': return 'bg-blue-100 text-blue-800';
      case 'Retirement': return 'bg-purple-100 text-purple-800';
      case 'Education': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalGoalsAmount = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSavedAmount = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = totalGoalsAmount > 0 ? (totalSavedAmount / totalGoalsAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Financial Goals
            </h1>
            <p className="text-muted-foreground">Track and achieve your financial milestones</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>Set a new financial goal to work towards</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input
                    id="goalName"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({...newGoal, target: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={newGoal.current || ''}
                    onChange={(e) => setNewGoal({...newGoal, current: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    className="w-full p-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="Investment">Investment</option>
                    <option value="Safety">Safety</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                
                <Button onClick={addGoal} className="w-full">
                  Add Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Goals</p>
                  <p className="text-2xl font-bold text-primary">{goals.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Target</p>
                  <p className="text-2xl font-bold text-primary">₹{totalGoalsAmount.toLocaleString()}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold text-primary">₹{totalSavedAmount.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Combined progress across all your financial goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{totalSavedAmount.toLocaleString()} saved</span>
                <span>₹{totalGoalsAmount.toLocaleString()} target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGoal(goal)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{goal.current.toLocaleString()}
                    </span>
                    <span className="text-gray-500">
                      of ₹{goal.target.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  {goal.deadline && (
                    <div className="text-sm text-muted-foreground">
                      Target: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Add amount"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const amount = parseInt((e.target as HTMLInputElement).value) || 0;
                          if (amount > 0) {
                            updateGoal(goal.id, { current: goal.current + amount });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                        const amount = parseInt(input?.value || '0') || 0;
                        if (amount > 0) {
                          updateGoal(goal.id, { current: goal.current + amount });
                          if (input) input.value = '';
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Goal Dialog */}
        {editingGoal && (
          <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Goal</DialogTitle>
                <DialogDescription>Update your goal details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editName">Goal Name</Label>
                  <Input
                    id="editName"
                    value={editingGoal.name}
                    onChange={(e) => setEditingGoal({...editingGoal, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editTarget">Target Amount (₹)</Label>
                  <Input
                    id="editTarget"
                    type="number"
                    value={editingGoal.target}
                    onChange={(e) => setEditingGoal({...editingGoal, target: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editCurrent">Current Amount (₹)</Label>
                  <Input
                    id="editCurrent"
                    type="number"
                    value={editingGoal.current}
                    onChange={(e) => setEditingGoal({...editingGoal, current: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editDeadline">Target Date</Label>
                  <Input
                    id="editDeadline"
                    type="date"
                    value={editingGoal.deadline}
                    onChange={(e) => setEditingGoal({...editingGoal, deadline: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      updateGoal(editingGoal.id, editingGoal);
                      setEditingGoal(null);
                    }}
                    className="flex-1"
                  >
                    Update Goal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingGoal(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      </PageTransition>
      <Footer />
    </div>
  );
};

export default Goals;
