
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Update your company details used in invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Enter your company name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Enter your address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID / Registration Number</Label>
              <Input id="taxId" placeholder="Enter your tax ID" />
            </div>
            <Button className="w-full">Save Company Information</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
            <CardDescription>
              Customize your invoice preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
              <Input id="invoicePrefix" placeholder="INV-" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultDueDays">Default Payment Terms (Days)</Label>
              <Input id="defaultDueDays" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input id="taxRate" type="number" placeholder="10" />
            </div>
            <Button className="w-full">Save Invoice Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
