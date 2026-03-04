import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  LogOut,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download
} from "lucide-react";
import { databaseService, Invoice } from "@/services/databaseService";

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    // Refresh when window gains focus (when user switches back to admin tab)
    const handleFocus = () => {
      console.log("Window focused, refreshing data...");
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Loading admin dashboard data...");
      
      // Read directly from localStorage
      const directData = localStorage.getItem("kimoel_invoices");
      console.log("🔍 Direct localStorage check:", directData);
      
      const invoicesData = directData ? JSON.parse(directData) : [];
      console.log("📊 Parsed invoices:", invoicesData);
      
      // Calculate stats
      const statsData = {
        total: invoicesData.length,
        pending: invoicesData.filter(i => i.status === "pending").length,
        inProgress: invoicesData.filter(i => i.status === "in-progress").length,
        completed: invoicesData.filter(i => i.status === "completed").length,
        cancelled: invoicesData.filter(i => i.status === "cancelled").length,
        today: invoicesData.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length,
        thisWeek: invoicesData.length,
        thisMonth: invoicesData.length,
      };
      
      console.log("📊 Stats calculated:", statsData);
      
      setInvoices(invoicesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: Invoice["status"]) => {
    try {
      // Get current invoices
      const currentData = localStorage.getItem("kimoel_invoices");
      const invoices = currentData ? JSON.parse(currentData) : [];
      
      // Find and update the invoice
      const invoiceIndex = invoices.findIndex((inv: Invoice) => inv.id === invoiceId);
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex].status = newStatus;
        invoices[invoiceIndex].updatedAt = new Date().toISOString();
        
        // Save back to localStorage
        localStorage.setItem("kimoel_invoices", JSON.stringify(invoices));
        
        // Reload data
        await loadData();
        
        console.log(`✅ Updated invoice ${invoiceId} to status: ${newStatus}`);
      }
    } catch (error) {
      console.error("❌ Failed to update invoice status:", error);
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        // Get current invoices
        const currentData = localStorage.getItem("kimoel_invoices");
        const invoices = currentData ? JSON.parse(currentData) : [];
        
        // Remove the invoice
        const filteredInvoices = invoices.filter((inv: Invoice) => inv.id !== invoiceId);
        
        // Save back to localStorage
        localStorage.setItem("kimoel_invoices", JSON.stringify(filteredInvoices));
        
        // Reload data
        await loadData();
        setSelectedInvoice(null);
        
        console.log(`✅ Deleted invoice ${invoiceId}`);
      } catch (error) {
        console.error("Failed to delete invoice:", error);
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === "" || 
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.phone.includes(searchQuery) ||
      invoice.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "!bg-yellow-200 !text-yellow-900 !border-yellow-300";
      case "in-progress":
        return "!bg-blue-200 !text-blue-900 !border-blue-300";
      case "completed":
        return "!bg-green-200 !text-green-900 !border-green-300";
      case "cancelled":
        return "!bg-red-200 !text-red-900 !border-red-300";
      default:
        return "!bg-gray-200 !text-gray-900 !border-gray-300";
    }
  };

  const getStatusIcon = (status: Invoice["status"]) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "in-progress": return <AlertCircle className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Invoice["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Kimoel Trading Management</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={onLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.inProgress || 0}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Invoices</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No invoices found</p>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 cursor-pointer" onClick={() => setSelectedInvoice(invoice)}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {invoice.referenceNumber}
                              </span>
                              <h3 className="font-semibold text-gray-900">{invoice.customerName}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{invoice.itemTitle}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge 
                            className={`${getStatusColor(invoice.status)} border`}
                            style={{
                              backgroundColor: 
                                invoice.status === 'pending' ? '#fef3c7' :
                                invoice.status === 'in-progress' ? '#dbeafe' :
                                invoice.status === 'completed' ? '#d1fae5' :
                                invoice.status === 'cancelled' ? '#fee2e2' : '#f3f4f6',
                              color: 
                                invoice.status === 'pending' ? '#78350f' :
                                invoice.status === 'in-progress' ? '#1e3a8a' :
                                invoice.status === 'completed' ? '#14532d' :
                                invoice.status === 'cancelled' ? '#991b1b' : '#111827'
                            }}
                          >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(invoice.status)}
                                {invoice.status}
                              </div>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {invoice.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedInvoice ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {selectedInvoice.referenceNumber}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{selectedInvoice.customerName}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedInvoice.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{selectedInvoice.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{selectedInvoice.location}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Item Details</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{selectedInvoice.itemTitle}</p>
                        <p className="text-sm text-gray-600">{selectedInvoice.itemDescription}</p>
                        <Badge className="mt-2" variant="outline">
                          {selectedInvoice.itemType}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Customer Requirements</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedInvoice.description || "No additional requirements"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Status Management</h4>
                      <div className="flex gap-2">
                        {["pending", "in-progress", "completed"].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateInvoiceStatus(selectedInvoice.id, status as Invoice["status"])}
                            className={`px-4 py-2 text-sm font-medium rounded cursor-pointer transition-all border-2 ${
                              selectedInvoice.status === status
                                ? "scale-105 shadow-md"
                                : "hover:scale-105"
                            }`}
                            style={{
                              backgroundColor: 
                                selectedInvoice.status === status ?
                                (status === 'pending' ? '#fbbf24' :
                                 status === 'in-progress' ? '#60a5fa' :
                                 status === 'completed' ? '#34d399' : '#e5e7eb') :
                                '#ffffff',
                              color: 
                                selectedInvoice.status === status ?
                                '#ffffff' :
                                (status === 'pending' ? '#f59e0b' :
                                 status === 'in-progress' ? '#3b82f6' :
                                 status === 'completed' ? '#10b981' : '#6b7280'),
                              borderColor: 
                                selectedInvoice.status === status ?
                                (status === 'pending' ? '#f59e0b' :
                                 status === 'in-progress' ? '#3b82f6' :
                                 status === 'completed' ? '#10b981' : '#9ca3af') :
                                (status === 'pending' ? '#f59e0b' :
                                 status === 'in-progress' ? '#3b82f6' :
                                 status === 'completed' ? '#10b981' : '#d1d5db')
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteInvoice(selectedInvoice.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">Select an invoice to view details</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
