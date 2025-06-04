
import { useState } from 'react';
import { Target, Plus, Edit3, Trash2, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Goals = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 3500,
      progress: 35,
      category: 'Safety',
      deadline: '2024-12-31',
      priority: 'High'
    },
    {
      id: 2,
      name: 'House Down Payment',
      target: 50000,
      current: 12000,
      progress: 24,
      category: 'Real Estate',
      deadline: '2027-06-01',
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Retirement Fund',
      target: 100000,
      current: 15420,
      progress: 15,
      category: 'Retirement',
      deadline: '2030-01-01',
      priority: 'Low'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    category: '',
    deadline: '',
    priority: 'Medium'
  });

  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const addGoal = () => {
    const target = parseFloat(newGoal.target);
    const current = parseFloat(newGoal.current || '0');
    const progress = target > 0 ? Math.round((current / target) * 100) : 0;

    const goal = {
      id: goals.length + 1,
      name: newGoal.name,
      target,
      current,
      progress,
      category: newGoal.category,
      deadline: newGoal.deadline,
      priority: newGoal.priority
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', current: '', category: '', deadline: '', priority: 'Medium' });
    setIsAddDialogOpen(false);
    toast({
      title: "Goal Added!",
      description: `${goal.name} has been added to your goals.`,
    });
  };

  const updateGoal = () => {
    if (!editingGoal) return;

    const target = parseFloat(editingGoal.target);
    const current = parseFloat(editingGoal.current);
    const progress = target > 0 ? Math.round((current / target) * 100) : 0;

    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id 
        ? { ...editingGoal, target, current, progress }
        : goal
    );

    setGoals(updatedGoals);
    setEditingGoal(null);
    setIsEditDialogOpen(false);
    toast({
      title: "Goal Updated!",
      description: "Your goal has been successfully updated.",
    });
  };

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: "Goal Deleted",
      description: "Goal has been removed from your list.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months left`;
    return `${Math.round(diffDays / 365)} years left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Goals</h1>
            <p className="text-gray-600">Set, track, and achieve your financial objectives</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new financial goal to track your progress.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal-name">Goal Name</Label>
                  <Input
                    id="goal-name"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Emergency Fund"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-amount">Target Amount ($)</Label>
                    <Input
                      id="target-amount"
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current-amount">Current Amount ($)</Label>
                    <Input
                      id="current-amount"
                      type="number"
                      value={newGoal.current}
                      onChange={(e) => setNewGoal({...newGoal, current: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Safety">Emergency Fund</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retirement">Retirement</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                
                <Button onClick={addGoal} className="w-full" disabled={!newGoal.name || !newGoal.target}>
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{goals.length}</div>
                <p className="text-sm text-gray-600">Active Goals</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${goals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total Saved</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)}%
                </div>
                <p className="text-sm text-gray-600">Average Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{goal.name}</h3>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{goal.category}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingGoal({...goal, target: goal.target.toString(), current: goal.current.toString()})}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Goal</DialogTitle>
                          <DialogDescription>
                            Update your goal details and progress.
                          </DialogDescription>
                        </DialogHeader>
                        {editingGoal && (
                          <div className="space-y-4">
                            <div>
                              <Label>Goal Name</Label>
                              <Input
                                value={editingGoal.name}
                                onChange={(e) => setEditingGoal({...editingGoal, name: e.target.value})}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Target Amount ($)</Label>
                                <Input
                                  type="number"
                                  value={editingGoal.target}
                                  onChange={(e) => setEditingGoal({...editingGoal, target: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Current Amount ($)</Label>
                                <Input
                                  type="number"
                                  value={editingGoal.current}
                                  onChange={(e) => setEditingGoal({...editingGoal, current: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Priority</Label>
                                <Select value={editingGoal.priority} onValueChange={(value) => setEditingGoal({...editingGoal, priority: value})}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Target Date</Label>
                                <Input
                                  type="date"
                                  value={editingGoal.deadline}
                                  onChange={(e) => setEditingGoal({...editingGoal, deadline: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <Button onClick={updateGoal} className="w-full">
                              Update Goal
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{getTimeRemaining(goal.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>${(goal.target - goal.current).toLocaleString()} remaining</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Set</h3>
              <p className="text-gray-600 mb-6">
                Start your financial journey by setting your first goal.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Goals;
