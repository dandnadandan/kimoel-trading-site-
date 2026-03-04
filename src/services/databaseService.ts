// Database Service - Handles all data operations for invoices and admin

export interface Invoice {
  id: string;
  referenceNumber: string; // NEW: Auto-generated reference number
  customerName: string;
  phone: string;
  email: string;
  location: string;
  description: string;
  itemType: "product" | "service";
  itemTitle: string;
  itemDescription: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  image?: string; // Base64 encoded image
  adminNotes?: string;
  priority: "low" | "medium" | "high";
  totalAmount?: number; // NEW: For pricing
  dueDate?: string; // NEW: Payment due date
}

export interface AdminUser {
  id: string;
  username: string;
  role: "admin" | "manager";
  lastLogin?: string;
}

class DatabaseService {
  private readonly INVOICES_KEY = "kimoel_invoices";
  private readonly ADMIN_USERS_KEY = "kimoel_admin_users";
  private readonly SETTINGS_KEY = "kimoel_settings";

  // Generate unique reference number
  generateReferenceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get current sequence number
    const settings = this.getSettings();
    const sequence = (settings.lastSequence || 0) + 1;
    
    // Update settings
    this.updateSettings({ lastSequence: sequence });
    
    // Format: KIMO-YYYYMMDD-XXXX (e.g., KIMO-20260304-0001)
    return `KIMO-${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
  }

  // Settings management
  private getSettings() {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { lastSequence: 0 };
  }

  private updateSettings(updates: any) {
    const currentSettings = this.getSettings();
    const newSettings = { ...currentSettings, ...updates };
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
  }

  // Initialize database with empty state - no sample data
  initializeDatabase(): void {
    // Only initialize if completely empty - DON'T clear existing data
    if (!localStorage.getItem(this.INVOICES_KEY)) {
      localStorage.setItem(this.INVOICES_KEY, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.ADMIN_USERS_KEY)) {
      const adminUsers: AdminUser[] = [
        {
          id: "admin_001",
          username: "admin",
          role: "admin",
          lastLogin: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.ADMIN_USERS_KEY, JSON.stringify(adminUsers));
    }

    // Initialize settings if not exists
    if (!localStorage.getItem(this.SETTINGS_KEY)) {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify({ lastSequence: 0 }));
    }
  }

  // Invoice Operations
  async createInvoice(invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "referenceNumber">): Promise<Invoice> {
    console.log("🔧 DatabaseService.createInvoice called with:", invoiceData);
    
    const invoices = await this.getInvoices();
    console.log("📚 Current invoices before save:", invoices);
    
    const newInvoice: Invoice = {
      ...invoiceData,
      referenceNumber: this.generateReferenceNumber(), // NEW: Auto-generate reference number
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("🆕 New invoice created:", newInvoice);
    
    invoices.push(newInvoice);
    console.log("📝 Invoices array after push:", invoices);
    
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
    console.log("💾 Saved to localStorage with key:", this.INVOICES_KEY);
    
    // Verify it was saved
    const savedData = localStorage.getItem(this.INVOICES_KEY);
    console.log("✅ Verification - data in localStorage:", savedData ? "Present" : "Missing");
    
    return newInvoice;
  }

  async getInvoices(): Promise<Invoice[]> {
    const invoices = localStorage.getItem(this.INVOICES_KEY);
    console.log("📖 DatabaseService.getInvoices called");
    console.log("🔑 Looking for key:", this.INVOICES_KEY);
    console.log("📦 Raw data from localStorage:", invoices);
    
    const parsed = invoices ? JSON.parse(invoices) : [];
    console.log("📊 Parsed invoices:", parsed);
    console.log("📊 Total count:", parsed.length);
    
    return parsed;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const invoices = await this.getInvoices();
    return invoices.find(invoice => invoice.id === id) || null;
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    const invoices = await this.getInvoices();
    const index = invoices.findIndex(invoice => invoice.id === id);
    
    if (index === -1) return null;

    invoices[index] = {
      ...invoices[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(invoices));
    return invoices[index];
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const invoices = await this.getInvoices();
    const filteredInvoices = invoices.filter(invoice => invoice.id !== id);
    
    if (filteredInvoices.length === invoices.length) return false;

    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(filteredInvoices));
    return true;
  }

  // Filter and search operations
  async getInvoicesByStatus(status: Invoice["status"]): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.status === status);
  }

  async searchInvoices(query: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    const lowercaseQuery = query.toLowerCase();
    
    return invoices.filter(invoice => 
      invoice.customerName.toLowerCase().includes(lowercaseQuery) ||
      invoice.email.toLowerCase().includes(lowercaseQuery) ||
      invoice.phone.includes(query) ||
      invoice.itemTitle.toLowerCase().includes(lowercaseQuery) ||
      invoice.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Statistics
  async getInvoiceStats(): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const invoices = await this.getInvoices();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: invoices.length,
      pending: invoices.filter(i => i.status === "pending").length,
      inProgress: invoices.filter(i => i.status === "in-progress").length,
      completed: invoices.filter(i => i.status === "completed").length,
      cancelled: invoices.filter(i => i.status === "cancelled").length,
      today: invoices.filter(i => new Date(i.createdAt) >= today).length,
      thisWeek: invoices.filter(i => new Date(i.createdAt) >= thisWeek).length,
      thisMonth: invoices.filter(i => new Date(i.createdAt) >= thisMonth).length,
    };
  }

  // Admin User Operations
  async getAdminUsers(): Promise<AdminUser[]> {
    const users = localStorage.getItem(this.ADMIN_USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  async updateAdminLastLogin(username: string): Promise<void> {
    const users = await this.getAdminUsers();
    const userIndex = users.findIndex(user => user.username === username);
    
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString();
      localStorage.setItem(this.ADMIN_USERS_KEY, JSON.stringify(users));
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
