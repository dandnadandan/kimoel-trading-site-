import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User, FileText, MessageCircle, MapPin, Image } from "lucide-react";
import { databaseService } from "@/services/databaseService";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
  productDescription: string;
  itemType?: "product" | "service";
}

interface InvoiceData {
  name: string;
  phone: string;
  email: string;
  location: string;
  image?: File;
  description: string;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  open,
  onOpenChange,
  productTitle,
  productDescription,
  itemType = "product",
}) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    name: "",
    phone: "",
    email: "",
    location: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemTypeLabel = itemType === "service" ? "Service" : "Product";
  const itemDescriptionText = itemType === "service" ? "service" : "product";

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("🚀 Starting invoice submission...");
      
      // Create invoice data object
      const invoiceDataToSave = {
        customerName: invoiceData.name,
        phone: invoiceData.phone,
        email: invoiceData.email,
        location: invoiceData.location,
        description: invoiceData.description,
        itemType: itemType,
        itemTitle: productTitle,
        itemDescription: productDescription,
        status: "pending" as const,
        priority: "medium" as const,
      };

      console.log("💾 Invoice data to save:", invoiceDataToSave);

      // Get existing invoices
      let existingInvoices = [];
      const storedData = localStorage.getItem("kimoel_invoices");
      
      if (storedData) {
        try {
          existingInvoices = JSON.parse(storedData);
          console.log("📚 Found existing invoices:", existingInvoices.length);
        } catch (e) {
          console.log("📚 No valid existing data, starting fresh");
          existingInvoices = [];
        }
      }
      
      const newInvoice = {
        ...invoiceDataToSave,
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        referenceNumber: `KIMO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(existingInvoices.length + 1).padStart(4, '0')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      existingInvoices.push(newInvoice);
      
      // Save to localStorage
      localStorage.setItem("kimoel_invoices", JSON.stringify(existingInvoices));
      
      // Verify it was saved
      const verifyData = localStorage.getItem("kimoel_invoices");
      const verifyParsed = JSON.parse(verifyData || "[]");
      
      console.log("✅ Invoice saved:", newInvoice);
      console.log("📊 Total invoices in localStorage:", verifyParsed.length);
      console.log("🔍 Verification - last invoice:", verifyParsed[verifyParsed.length - 1]);

      alert(`Invoice submitted!\n\nReference: ${newInvoice.referenceNumber}\n\nCustomer: ${newInvoice.customerName}\n\nSaved! Total invoices: ${verifyParsed.length}\n\nCheck admin panel now!`);
      
      // Reset form and close dialog
      setInvoiceData({ name: "", phone: "", email: "", location: "", description: "" });
      setIsSubmitting(false);
      onOpenChange(false);
    } catch (error) {
      console.error("❌ Failed to submit invoice:", error);
      alert("Failed to submit invoice. Error: " + error);
      setIsSubmitting(false);
    }
  };

  const isFormValid = invoiceData.name && invoiceData.phone && invoiceData.email && invoiceData.location;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Invoice Request
          </DialogTitle>
          <DialogDescription>
            Fill in your details to request an invoice for this {itemDescriptionText}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Product Info */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <Badge variant="secondary" className="mb-2">
              {itemTypeLabel}
            </Badge>
            <h3 className="font-semibold text-lg">{productTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {productDescription}
            </p>
          </div>

          {/* Direct Contact Option */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Prefer Direct Contact?
              </Badge>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              Call or email us directly:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">+63 912 345 6789</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-7 text-xs"
                  onClick={() => navigator.clipboard.writeText('+63 912 345 6789')}
                >
                  Copy
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">kimoel_leotagle@yahoo.com</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-7 text-xs"
                  onClick={() => navigator.clipboard.writeText('kimoel_leotagle@yahoo.com')}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Invoice Form */}
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              Formal Invoice Request
            </Badge>
            <p className="text-sm text-muted-foreground">
              Fill out the form below to receive a formal invoice via email:
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={invoiceData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={invoiceData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={invoiceData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location / Address *
              </Label>
              <Input
                id="location"
                value={invoiceData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter your location or address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Attachment Image (Optional)
              </Label>
              <div className="flex items-center gap-3">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setInvoiceData((prev) => ({ ...prev, image: file }));
                    }
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {invoiceData.image ? invoiceData.image.name : "No file chosen"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Additional Requirements / Description
              </Label>
              <Textarea
                id="description"
                value={invoiceData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Any specific requirements, quantities, or additional information..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Submitting..." : "Submit Invoice Request"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
