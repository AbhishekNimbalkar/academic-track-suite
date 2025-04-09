
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Bell,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  MailCheck,
  AlertCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Notification } from "@/types/models";

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    recipientType: "all",
    class: "",
    section: "",
    title: "",
    message: "",
    type: "general" as "fee_reminder" | "attendance" | "academic" | "general",
    sendVia: ["app", "email"],
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "NOT001",
      recipient: {
        id: "ALL",
        type: "parent"
      },
      title: "Fee Payment Reminder",
      message: "This is a reminder that the second installment of fees is due on November 15th.",
      type: "fee_reminder",
      sentVia: ["email", "sms", "app"],
      dateSent: "2023-11-01",
      status: "sent"
    },
    {
      id: "NOT002",
      recipient: {
        id: "CLASS10A",
        type: "student"
      },
      title: "Upcoming Science Exam",
      message: "The science exam for Class 10A will be held on November 20th. Please prepare accordingly.",
      type: "academic",
      sentVia: ["app"],
      dateSent: "2023-11-05",
      status: "delivered"
    },
    {
      id: "NOT003",
      recipient: {
        id: "STU003",
        type: "parent"
      },
      title: "Attendance Alert",
      message: "Your child has been absent for 3 consecutive days. Please provide a reason or medical certificate.",
      type: "attendance",
      sentVia: ["sms", "email"],
      dateSent: "2023-11-07",
      status: "read"
    }
  ]);

  // Filter notifications based on search query and selected tab
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && notification.type === selectedTab;
  });

  const handleSendNotification = () => {
    // In a real app, this would call an API to send the notification
    const newNotificationData: Notification = {
      id: `NOT${notifications.length + 1}`.padStart(6, '0'),
      recipient: {
        id: newNotification.recipientType === "all" ? "ALL" : 
             newNotification.recipientType === "class" ? `CLASS${newNotification.class}${newNotification.section}` : "CUSTOM",
        type: "parent"
      },
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      sentVia: newNotification.sendVia as ("email" | "sms" | "app")[],
      dateSent: new Date().toISOString().split('T')[0],
      status: "sent"
    };
    
    setNotifications([...notifications, newNotificationData]);
    setIsCreateDialogOpen(false);
    
    // Reset form
    setNewNotification({
      recipientType: "all",
      class: "",
      section: "",
      title: "",
      message: "",
      type: "general",
      sendVia: ["app", "email"],
    });
    
    toast({
      title: "Notification Sent",
      description: `The notification has been sent successfully.`,
    });
  };

  const getRecipientDisplay = (notification: Notification) => {
    if (notification.recipient.id === "ALL") {
      return "All Parents";
    } else if (notification.recipient.id.startsWith("CLASS")) {
      return `Class ${notification.recipient.id.slice(5)}`;
    } else {
      return `Individual ${notification.recipient.type}`;
    }
  };

  const getNotificationTypeDisplay = (type: string) => {
    switch(type) {
      case "fee_reminder": return "Fee Reminder";
      case "attendance": return "Attendance";
      case "academic": return "Academic";
      case "general": return "General";
      default: return type;
    }
  };

  const renderSentVia = (sentVia: string[]) => {
    return (
      <div className="flex space-x-1">
        {sentVia.includes("email") && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Mail className="h-3 w-3 mr-1" />
            Email
          </span>
        )}
        {sentVia.includes("sms") && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <MessageSquare className="h-3 w-3 mr-1" />
            SMS
          </span>
        )}
        {sentVia.includes("app") && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Bell className="h-3 w-3 mr-1" />
            App
          </span>
        )}
      </div>
    );
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "sent": return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "delivered": return <MailCheck className="h-4 w-4 text-green-500" />;
      case "read": return <MailCheck className="h-4 w-4 text-green-500" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          {isAdmin && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Notification</DialogTitle>
                  <DialogDescription>
                    Create and send a new notification to students or parents.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientType">Send To</Label>
                    <Select 
                      value={newNotification.recipientType} 
                      onValueChange={(value) => setNewNotification({...newNotification, recipientType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Parents</SelectItem>
                        <SelectItem value="class">Specific Class</SelectItem>
                        <SelectItem value="individual">Individual Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newNotification.recipientType === "class" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select 
                          value={newNotification.class} 
                          onValueChange={(value) => setNewNotification({...newNotification, class: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="11">Class 11</SelectItem>
                            <SelectItem value="12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Select 
                          value={newNotification.section} 
                          onValueChange={(value) => setNewNotification({...newNotification, section: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {newNotification.recipientType === "individual" && (
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        placeholder="Enter student ID"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="notificationType">Notification Type</Label>
                    <Select 
                      value={newNotification.type} 
                      onValueChange={(value) => setNewNotification({...newNotification, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fee_reminder">Fee Reminder</SelectItem>
                        <SelectItem value="attendance">Attendance</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      placeholder="Enter notification title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                      placeholder="Enter notification message"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Send Via</Label>
                    <div className="flex space-x-4 mt-1">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newNotification.sendVia.includes("app")}
                          onChange={(e) => {
                            let newSendVia = [...newNotification.sendVia];
                            if (e.target.checked) {
                              newSendVia.push("app");
                            } else {
                              newSendVia = newSendVia.filter(item => item !== "app");
                            }
                            setNewNotification({...newNotification, sendVia: newSendVia});
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>App</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newNotification.sendVia.includes("email")}
                          onChange={(e) => {
                            let newSendVia = [...newNotification.sendVia];
                            if (e.target.checked) {
                              newSendVia.push("email");
                            } else {
                              newSendVia = newSendVia.filter(item => item !== "email");
                            }
                            setNewNotification({...newNotification, sendVia: newSendVia});
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>Email</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newNotification.sendVia.includes("sms")}
                          onChange={(e) => {
                            let newSendVia = [...newNotification.sendVia];
                            if (e.target.checked) {
                              newSendVia.push("sms");
                            } else {
                              newSendVia = newSendVia.filter(item => item !== "sms");
                            }
                            setNewNotification({...newNotification, sendVia: newSendVia});
                          }}
                          className="rounded border-gray-300"
                        />
                        <span>SMS</span>
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendNotification}>Send Notification</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>
              View and manage all notifications sent to students and parents
            </CardDescription>
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Tabs
              defaultValue="all"
              className="mt-4"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="fee_reminder">Fee Reminders</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Sent Via</TableHead>
                    <TableHead>Date Sent</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>
                          <div className="max-w-md">
                            <p className="font-medium truncate">{notification.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            notification.type === "fee_reminder" ? "bg-yellow-100 text-yellow-800" :
                            notification.type === "attendance" ? "bg-red-100 text-red-800" :
                            notification.type === "academic" ? "bg-blue-100 text-blue-800" : 
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {getNotificationTypeDisplay(notification.type)}
                          </span>
                        </TableCell>
                        <TableCell>{getRecipientDisplay(notification)}</TableCell>
                        <TableCell>{renderSentVia(notification.sentVia)}</TableCell>
                        <TableCell>{new Date(notification.dateSent).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(notification.status)}
                            <span className="capitalize">{notification.status}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No notifications found. Try adjusting your search or create a new notification.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Notifications;
