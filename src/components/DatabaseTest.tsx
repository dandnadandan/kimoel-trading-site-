import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { databaseService } from "@/services/databaseService";

const DatabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    clearSampleData();
  }, []);

  const clearSampleData = () => {
    // Force clear all invoice-related data
    localStorage.removeItem("kimoel_invoices");
    localStorage.removeItem("kimoel_admin_users");
    
    // Also try to clear any other potential keys
    Object.keys(localStorage).forEach(key => {
      if (key.includes('invoice') || key.includes('kimoel')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reinitialize with clean data
    databaseService.initializeDatabase();
    addTestResult("🗑️ Cleared all sample invoices - starting fresh");
    addTestResult("🔍 LocalStorage keys after clear: " + Object.keys(localStorage).filter(k => k.includes('kimoel')).join(", "));
  };

  const runDatabaseTest = async () => {
    try {
      addTestResult("Starting database test...");
      
      // Test 1: Initialize database
      databaseService.initializeDatabase();
      addTestResult("✓ Database initialized");
      
      // Test 2: Get existing invoices
      const existingInvoices = await databaseService.getInvoices();
      addTestResult(`✓ Found ${existingInvoices.length} existing invoices`);
      
      // Test 3: Create a test invoice
      const testInvoice = await databaseService.createInvoice({
        customerName: "Test User",
        phone: "+63 912 345 6789",
        email: "test@example.com",
        location: "Test Location",
        description: "This is a test invoice",
        itemType: "product",
        itemTitle: "Test Product",
        itemDescription: "Test product description",
        status: "pending",
        priority: "medium"
      });
      addTestResult(`✓ Created test invoice with ID: ${testInvoice.id}`);
      
      // Test 4: Retrieve all invoices
      const allInvoices = await databaseService.getInvoices();
      addTestResult(`✓ Retrieved ${allInvoices.length} total invoices`);
      
      // Test 5: Get statistics
      const stats = await databaseService.getInvoiceStats();
      addTestResult(`✓ Stats - Total: ${stats.total}, Pending: ${stats.pending}`);
      
      // Test 6: Update invoice status
      const updatedInvoice = await databaseService.updateInvoice(testInvoice.id, { status: "completed" });
      addTestResult(`✓ Updated invoice status to: ${updatedInvoice?.status}`);
      
      // Test 7: Clean up - delete test invoice
      const deleted = await databaseService.deleteInvoice(testInvoice.id);
      addTestResult(`✓ Deleted test invoice: ${deleted ? "Success" : "Failed"}`);
      
      addTestResult("🎉 All database tests completed successfully!");
      
    } catch (error) {
      addTestResult(`❌ Test failed: ${error}`);
    }
  };

  const forceClearAndRefresh = () => {
    // Clear everything
    clearSampleData();
    // Force page refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    addTestResult("🔄 Clearing data and refreshing page...");
  };

  const checkLocalStorage = () => {
    const invoices = localStorage.getItem("kimoel_invoices");
    if (invoices) {
      try {
        const parsed = JSON.parse(invoices);
        addTestResult(`📊 Local Storage contains ${parsed.length} invoices`);
        parsed.forEach((inv: any, index: number) => {
          addTestResult(`   ${index + 1}. ${inv.customerName} - ${inv.itemTitle} (${inv.status})`);
        });
      } catch (e) {
        addTestResult(`❌ Failed to parse localStorage data: ${e}`);
      }
    } else {
      addTestResult("❌ No invoices found in localStorage");
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Database Test & Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={forceClearAndRefresh} variant="destructive">🔄 Force Clear & Refresh</Button>
          <Button onClick={clearSampleData} variant="outline">Clear Sample Data</Button>
          <Button onClick={runDatabaseTest}>Run Database Test</Button>
          <Button onClick={checkLocalStorage} variant="outline">Check Local Storage</Button>
          <Button onClick={clearResults} variant="outline">Clear Results</Button>
        </div>
        
        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;
