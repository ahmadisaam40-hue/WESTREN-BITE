import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Calculator,
  Receipt,
  CreditCard,
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Clock,
  Package,
  Truck,
  XCircle,
  Edit2,
  Save,
  X,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  LogOut,
  Settings,
  Key,
  Star,
  MessageSquare,
  Printer,
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useMenuStore } from '@/store/menuStore';
import { useAdminStore } from '@/store/adminStore';
import { useReviewStore } from '@/store/reviewStore';
import { Order, Expense, MenuItem } from '@/types/menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from '@/components/ImageUploader';
import ReceiptDesigner from '@/components/ReceiptDesigner';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, logout, setCredentials, adminUsername, adminPassword } = useAdminStore();
  const {
    orders,
    expenses,
    updateOrderStatus,
    addExpense,
    markExpensePaid,
    deleteExpense,
    getAccountingStats,
  } = useOrderStore();
  
  const { items, categories, addItem, updateItem, deleteItem, addCategory, deleteCategory } = useMenuStore();
  const { reviews } = useReviewStore();
  // Category form
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', nameAr: '' });

  const [activeTab, setActiveTab] = useState('orders');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Expense form
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'purchase' | 'expense' | 'debt'>('expense');

  // Menu item form
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    image: '',
    category: 'burgers',
    isAvailable: true,
  });

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const stats = getAccountingStats();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(price) + ' IQD';
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'delivering':
        return <Truck className="w-4 h-4" />;
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'preparing':
        return 'bg-blue-500/20 text-blue-500';
      case 'delivering':
        return 'bg-purple-500/20 text-purple-500';
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500';
    }
  };

  const handleAddExpense = () => {
    if (!expenseDesc.trim() || !expenseAmount) {
      toast({
        title: 'Error',
        description: 'Please fill all fields.',
        variant: 'destructive',
      });
      return;
    }

    addExpense({
      description: expenseDesc,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      isPaid: expenseCategory !== 'debt',
    });

    setExpenseDesc('');
    setExpenseAmount('');
    toast({
      title: 'Added',
      description: `${expenseCategory === 'purchase' ? 'Purchase' : expenseCategory === 'debt' ? 'Debt' : 'Expense'} has been recorded.`,
    });
  };

  const handleAddMenuItem = () => {
    if (!newItem.name.trim() || !newItem.price) {
      toast({
        title: 'Error',
        description: 'Please fill required fields (name and price).',
        variant: 'destructive',
      });
      return;
    }

    addItem({
      name: newItem.name,
      nameAr: newItem.nameAr,
      description: newItem.description,
      descriptionAr: newItem.descriptionAr,
      price: parseFloat(newItem.price),
      image: newItem.image,
      category: newItem.category,
      isAvailable: newItem.isAvailable,
    });

    setNewItem({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      price: '',
      image: '',
      category: 'burgers',
      isAvailable: true,
    });
    setShowAddItem(false);
    toast({
      title: 'Added',
      description: 'Menu item has been added.',
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    updateItem(editingItem.id, editingItem);
    setEditingItem(null);
    toast({
      title: 'Updated',
      description: 'Menu item has been updated.',
    });
  };

  const handleUpdateCredentials = () => {
    if (newUsername.trim() && newPassword.length >= 4) {
      setCredentials(newUsername, newPassword);
      setNewUsername('');
      setNewPassword('');
      toast({
        title: 'Credentials Updated',
        description: 'Your admin credentials have been changed.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Username must not be empty and password must be at least 4 characters.',
        variant: 'destructive',
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return;
    }

    addCategory({
      name: newCategory.name,
      nameAr: newCategory.nameAr,
    });

    setNewCategory({ name: '', nameAr: '' });
    setShowAddCategory(false);
    toast({
      title: 'Added',
      description: 'Category has been added.',
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const itemsInCategory = items.filter((item) => item.category === categoryId);
    if (itemsInCategory.length > 0) {
      toast({
        title: 'Cannot Delete',
        description: `This category has ${itemsInCategory.length} items. Remove them first.`,
        variant: 'destructive',
      });
      return;
    }

    deleteCategory(categoryId);
    toast({
      title: 'Deleted',
      description: 'Category has been deleted.',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-full bg-secondary hover:bg-primary transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 text-foreground group-hover:text-primary-foreground" />
              </Link>
              <h1 className="font-display text-2xl text-gradient">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="card-western p-6 mb-8 animate-fade-in">
            <h3 className="font-display text-xl mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Admin Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Change Username */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary" />
                  New Username
                </Label>
                <Input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                />
                <p className="text-xs text-muted-foreground">Current: {adminUsername}</p>
              </div>

              {/* Change Password */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary" />
                  New Password
                </Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 4 chars)"
                />
                <p className="text-xs text-muted-foreground">Current: {adminPassword}</p>
              </div>
            </div>
            <Button onClick={handleUpdateCredentials} className="mt-4 bg-primary hover:bg-primary/90">
              Update Credentials
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card-western p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Revenue</span>
            </div>
            <p className="font-display text-lg">{formatPrice(stats.totalRevenue)}</p>
          </div>

          <div className="card-western p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Purchases</span>
            </div>
            <p className="font-display text-lg">{formatPrice(stats.totalPurchases)}</p>
          </div>

          <div className="card-western p-4">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Receipt className="w-5 h-5" />
              <span className="text-sm">Expenses</span>
            </div>
            <p className="font-display text-lg">{formatPrice(stats.totalExpenses)}</p>
          </div>

          <div className="card-western p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm">Total Debts</span>
            </div>
            <p className="font-display text-lg">{formatPrice(stats.totalDebts)}</p>
          </div>

          <div className="card-western p-4">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Unpaid</span>
            </div>
            <p className="font-display text-lg">{formatPrice(stats.unpaidDebts)}</p>
          </div>

          <div className="card-western p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Net Profit</span>
            </div>
            <p className={`font-display text-lg ${stats.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPrice(stats.netProfit)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="orders" className="font-display">
              <ClipboardList className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="menu" className="font-display">
              <UtensilsCrossed className="w-4 h-4 mr-2" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="reviews" className="font-display">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="receipt" className="font-display">
              <Printer className="w-4 h-4 mr-2" />
              Receipt
            </TabsTrigger>
            <TabsTrigger value="accounting" className="font-display">
              <Calculator className="w-4 h-4 mr-2" />
              Accounting
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="card-western p-8 text-center">
                  <ClipboardList className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="card-western p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-display text-primary">#{order.id.slice(-6)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-foreground font-semibold">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">{order.deliveryAddress}</p>
                        {order.notes && (
                          <p className="text-xs text-primary mt-1">Notes: {order.notes}</p>
                        )}
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Items:</p>
                          <div className="flex flex-wrap gap-1">
                            {order.items.map((item, idx) => (
                              <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded">
                                {item.name} x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="font-display text-lg text-primary">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString('en-IQ')}
                        </p>
                        
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                className="bg-blue-500 hover:bg-blue-600"
                              >
                                Start Preparing
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'delivering')}
                                className="bg-purple-500 hover:bg-purple-600"
                              >
                                Out for Delivery
                              </Button>
                            )}
                            {order.status === 'delivering' && (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            {/* Category Management */}
            <div className="card-western p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg">Categories</h3>
                <Button
                  size="sm"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="btn-western"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>

              {showAddCategory && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <Label>Name (English) *</Label>
                    <Input
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <Label>Name (Arabic)</Label>
                    <Input
                      value={newCategory.nameAr}
                      onChange={(e) => setNewCategory({ ...newCategory, nameAr: e.target.value })}
                      placeholder="اسم الفئة"
                      dir="rtl"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleAddCategory} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                  >
                    <span className="text-sm font-medium">{cat.name}</span>
                    {cat.nameAr && (
                      <span className="text-xs text-muted-foreground">({cat.nameAr})</span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="mb-6">
              {!showAddItem ? (
                <Button onClick={() => setShowAddItem(true)} className="btn-western">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              ) : (
                <div className="card-western p-6">
                  <h3 className="font-display text-lg mb-4">Add New Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name (English) *</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <Label>Name (Arabic)</Label>
                      <Input
                        value={newItem.nameAr}
                        onChange={(e) => setNewItem({ ...newItem, nameAr: e.target.value })}
                        placeholder="اسم الصنف"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label>Description (English)</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Description"
                      />
                    </div>
                    <div>
                      <Label>Description (Arabic)</Label>
                      <Input
                        value={newItem.descriptionAr}
                        onChange={(e) => setNewItem({ ...newItem, descriptionAr: e.target.value })}
                        placeholder="الوصف"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label>Price (IQD) *</Label>
                      <Input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Image</Label>
                      <ImageUploader
                        currentImage={newItem.image}
                        onImageChange={(img) => setNewItem({ ...newItem, image: img })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleAddMenuItem} className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddItem(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="card-western p-4">
                  {editingItem?.id === item.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        placeholder="Name"
                      />
                      <Input
                        type="number"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        placeholder="Price"
                      />
                      <ImageUploader
                        currentImage={editingItem.image}
                        onImageChange={(img) => setEditingItem({ ...editingItem, image: img })}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateItem} className="bg-green-500">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-24 mb-3 rounded-lg overflow-hidden bg-secondary">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-wood">
                            <span className="font-display text-2xl text-primary/30">WB</span>
                          </div>
                        )}
                      </div>
                      <h4 className="font-display text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.nameAr}</p>
                      <p className="text-primary font-display">{formatPrice(item.price)}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItem(item.id, { isAvailable: !item.isAvailable })}
                          className={item.isAvailable ? 'text-green-500' : 'text-red-500'}
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Accounting Tab */}
          <TabsContent value="accounting">
            {/* Add Expense Form */}
            <div className="card-western p-6 mb-8">
              <h3 className="font-display text-lg mb-4">Add Entry</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Type</Label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as 'purchase' | 'expense' | 'debt')}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="purchase">Purchase</option>
                    <option value="expense">Expense</option>
                    <option value="debt">Debt</option>
                  </select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    placeholder="Description"
                  />
                </div>
                <div>
                  <Label>Amount (IQD)</Label>
                  <Input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddExpense} className="btn-western w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-4">
              <h3 className="font-display text-xl">All Entries</h3>
              
              {expenses.length === 0 ? (
                <div className="card-western p-8 text-center">
                  <Receipt className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No entries yet.</p>
                </div>
              ) : (
                expenses.map((expense) => (
                  <div key={expense.id} className="card-western p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs uppercase ${
                            expense.category === 'purchase'
                              ? 'bg-blue-500/20 text-blue-500'
                              : expense.category === 'debt'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-orange-500/20 text-orange-500'
                          }`}
                        >
                          {expense.category}
                        </span>
                        {expense.category === 'debt' && (
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              expense.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                            }`}
                          >
                            {expense.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.createdAt).toLocaleDateString('en-IQ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display text-lg text-primary">
                        {formatPrice(expense.amount)}
                      </p>
                      <div className="flex gap-2">
                        {expense.category === 'debt' && !expense.isPaid && (
                          <Button
                            size="sm"
                            onClick={() => markExpensePaid(expense.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="card-western p-8 text-center">
                  <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reviews yet.</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="card-western p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-display text-primary">{review.customerName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleString('en-IQ')}
                          </span>
                        </div>
                        
                        {/* Restaurant Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-muted-foreground">Restaurant:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.restaurantRating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-500'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Item Ratings */}
                        {review.itemRatings.length > 0 && (
                          <div className="space-y-2 mb-3">
                            <span className="text-sm text-muted-foreground">Items:</span>
                            <div className="flex flex-wrap gap-2">
                              {review.itemRatings.map((ir, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
                                >
                                  <span>{ir.itemName}</span>
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-3 h-3 ${
                                          star <= ir.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-500'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Feedback */}
                        {review.feedback && (
                          <div className="mt-3 p-3 bg-secondary rounded-lg">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm">{review.feedback}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Receipt Designer Tab */}
          <TabsContent value="receipt">
            <div className="card-western p-6">
              <ReceiptDesigner />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
