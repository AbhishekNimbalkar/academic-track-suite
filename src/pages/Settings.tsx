import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { AcademicFeeStructureSettings } from "@/components/settings/AcademicFeeStructureSettings";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Mail,
  MessageSquare,
  DollarSign
} from "lucide-react";

const Settings: React.FC = () => {
  const { user, userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const { toast } = useToast();
  
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.school.com",
    port: "587",
    username: "notifications@school.com",
    password: "************",
    fromEmail: "notifications@school.com",
    fromName: "School Management System",
  });
  
  const [smsSettings, setSmsSettings] = useState({
    provider: "Twilio",
    apiKey: "********************",
    senderId: "SchoolSMS",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enableAppNotifications: true,
    feeReminderDays: 7,
    sendAbsenceAlerts: true,
    sendExamScheduleReminders: true,
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    passwordExpiryDays: 90,
    enforceStrongPassword: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
  });

  const handleSaveEmailSettings = () => {
    // In a real app, this would call an API to save settings
    toast({
      title: "Email Settings Saved",
      description: "Your email notification settings have been updated.",
    });
  };

  const handleSaveSmsSettings = () => {
    // In a real app, this would call an API to save settings
    toast({
      title: "SMS Settings Saved",
      description: "Your SMS notification settings have been updated.",
    });
  };

  const handleSaveNotificationSettings = () => {
    // In a real app, this would call an API to save settings
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleSaveSecuritySettings = () => {
    // In a real app, this would call an API to save settings
    toast({
      title: "Security Settings Saved",
      description: "Your security settings have been updated.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue="account">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
            <div className="flex-shrink-0 lg:w-1/4">
              <TabsList className="w-full flex flex-col h-auto space-y-1">
                <TabsTrigger value="account" className="justify-start text-left px-3 py-2">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                {isAdmin && (
                  <>
                    <TabsTrigger value="email" className="justify-start text-left px-3 py-2">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Settings
                    </TabsTrigger>
                    <TabsTrigger value="sms" className="justify-start text-left px-3 py-2">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      SMS Settings
                    </TabsTrigger>
                    <TabsTrigger value="fee-structure" className="justify-start text-left px-3 py-2">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Fee Structure
                    </TabsTrigger>
                  </>
                )}
                <TabsTrigger value="notifications" className="justify-start text-left px-3 py-2">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger value="security" className="justify-start text-left px-3 py-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <div className="flex-1 lg:max-w-3xl">
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" defaultValue={user?.email?.split('@')[0]} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={user?.email} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Current Password</Label>
                        <Input id="password" type="password" placeholder="Enter your current password" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" placeholder="Enter new password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isAdmin && (
                <>
                  <TabsContent value="email" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Email Settings</CardTitle>
                        <CardDescription>
                          Configure email server settings for sending notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">SMTP Configuration</h3>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="smtpServer">SMTP Server</Label>
                              <Input 
                                id="smtpServer" 
                                value={emailSettings.smtpServer}
                                onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="port">Port</Label>
                              <Input 
                                id="port" 
                                value={emailSettings.port}
                                onChange={(e) => setEmailSettings({...emailSettings, port: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input 
                                id="username" 
                                value={emailSettings.username}
                                onChange={(e) => setEmailSettings({...emailSettings, username: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input 
                                id="password" 
                                type="password" 
                                value={emailSettings.password}
                                onChange={(e) => setEmailSettings({...emailSettings, password: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-medium mt-6">Sender Information</h3>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="fromEmail">From Email</Label>
                              <Input 
                                id="fromEmail" 
                                value={emailSettings.fromEmail}
                                onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fromName">From Name</Label>
                              <Input 
                                id="fromName" 
                                value={emailSettings.fromName}
                                onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <Button onClick={handleSaveEmailSettings}>Save Email Settings</Button>
                            <Button variant="outline" className="ml-2">Test Connection</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="sms" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>SMS Settings</CardTitle>
                        <CardDescription>
                          Configure SMS gateway settings for sending text notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">SMS Gateway Configuration</h3>
                          <Separator />
                          <div className="space-y-2">
                            <Label htmlFor="smsProvider">SMS Provider</Label>
                            <Input 
                              id="smsProvider" 
                              value={smsSettings.provider}
                              onChange={(e) => setSmsSettings({...smsSettings, provider: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apiKey">API Key</Label>
                            <Input 
                              id="apiKey" 
                              type="password" 
                              value={smsSettings.apiKey}
                              onChange={(e) => setSmsSettings({...smsSettings, apiKey: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="senderId">Sender ID</Label>
                            <Input 
                              id="senderId" 
                              value={smsSettings.senderId}
                              onChange={(e) => setSmsSettings({...smsSettings, senderId: e.target.value})}
                            />
                          </div>
                          
                          <div className="mt-2">
                            <Button onClick={handleSaveSmsSettings}>Save SMS Settings</Button>
                            <Button variant="outline" className="ml-2">Test SMS</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="fee-structure" className="space-y-6">
                    <AcademicFeeStructureSettings />
                  </TabsContent>
                </>
              )}
              
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Customize how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Channels</h3>
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via email
                          </p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.enableEmailNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, enableEmailNotifications: checked})
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications via SMS
                          </p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={notificationSettings.enableSmsNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, enableSmsNotifications: checked})
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="appNotifications">In-App Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications within the application
                          </p>
                        </div>
                        <Switch
                          id="appNotifications"
                          checked={notificationSettings.enableAppNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, enableAppNotifications: checked})
                          }
                        />
                      </div>
                      
                      <h3 className="text-lg font-medium mt-6">Notification Types</h3>
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label htmlFor="feeReminderDays">Fee Reminder Days Before Due Date</Label>
                        <Input 
                          id="feeReminderDays" 
                          type="number" 
                          min="1" 
                          max="30"
                          value={notificationSettings.feeReminderDays}
                          onChange={(e) => 
                            setNotificationSettings({...notificationSettings, feeReminderDays: parseInt(e.target.value)})
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="absenceAlerts">Absence Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Send alerts when a student is marked absent
                          </p>
                        </div>
                        <Switch
                          id="absenceAlerts"
                          checked={notificationSettings.sendAbsenceAlerts}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, sendAbsenceAlerts: checked})
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="examScheduleReminders">Exam Schedule Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Send reminders about upcoming exams
                          </p>
                        </div>
                        <Switch
                          id="examScheduleReminders"
                          checked={notificationSettings.sendExamScheduleReminders}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, sendExamScheduleReminders: checked})
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Configure security and access control settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Authentication & Access</h3>
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                              Require a verification code in addition to password
                            </p>
                          </div>
                          <Switch
                            id="twoFactor"
                            checked={securitySettings.enableTwoFactor}
                            onCheckedChange={(checked) => 
                              setSecuritySettings({...securitySettings, enableTwoFactor: checked})
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                          <Input 
                            id="passwordExpiry" 
                            type="number"
                            value={securitySettings.passwordExpiryDays}
                            onChange={(e) => 
                              setSecuritySettings({...securitySettings, passwordExpiryDays: parseInt(e.target.value)})
                            }
                          />
                          <p className="text-sm text-muted-foreground">
                            Set to 0 for passwords that never expire
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="strongPassword">Enforce Strong Passwords</Label>
                            <p className="text-sm text-muted-foreground">
                              Require complex passwords with mixed case, numbers, and symbols
                            </p>
                          </div>
                          <Switch
                            id="strongPassword"
                            checked={securitySettings.enforceStrongPassword}
                            onCheckedChange={(checked) => 
                              setSecuritySettings({...securitySettings, enforceStrongPassword: checked})
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="loginAttempts">Failed Login Attempts Before Lockout</Label>
                          <Input 
                            id="loginAttempts" 
                            type="number"
                            value={securitySettings.maxLoginAttempts}
                            onChange={(e) => 
                              setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})
                            }
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Input 
                            id="sessionTimeout" 
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => 
                              setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSecuritySettings}>Save Security Settings</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
