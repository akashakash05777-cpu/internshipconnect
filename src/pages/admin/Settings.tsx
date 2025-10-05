

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  Key,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Activity,
  HardDrive,
  Cpu,
  Wifi,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { mockAdmin } from '@/lib/mock-data';

export default function SettingsPage() {
  const [currentUser] = useState(mockAdmin[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    platformName: 'InternConnect',
    platformDescription: 'A modern internship management platform',
    platformUrl: 'https://prashikshan.edu',
    adminEmail: 'admin@prashikshan.edu',
    supportEmail: 'support@prashikshan.edu',
    maxFileSize: '10',
    sessionTimeout: '30',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    analyticsEnabled: true,
    debugMode: false
  });

  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@prashikshan.edu',
    smtpPassword: '********',
    smtpEncryption: 'tls',
    fromName: 'InternConnect Platform',
    fromEmail: 'noreply@prashikshan.edu',
    replyToEmail: 'support@prashikshan.edu'
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: '8',
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    lockoutDuration: '15',
    twoFactorAuth: false,
    apiKeyExpiry: '90',
    ipWhitelist: '',
    allowedDomains: 'edu,com,org'
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    applicationAlerts: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    mouExpiryAlerts: true,
    applicationDeadlineAlerts: true,
    newUserAlerts: true,
    systemMaintenanceAlerts: true
  });

  // System information
  const systemInfo = {
    version: '1.0.0',
    lastUpdate: '2024-01-15',
    uptime: '15 days, 3 hours',
    databaseSize: '2.5 GB',
    totalUsers: '156',
    totalApplications: '342',
    serverLoad: '23%',
    memoryUsage: '1.2 GB / 4 GB',
    diskUsage: '45%'
  };

  const handleSaveSettings = async (category: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log(`Saving ${category} settings...`);
  };

  const handleResetSettings = (category: string) => {
    console.log(`Resetting ${category} settings...`);
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    // Simulate email test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log('Email test sent!');
  };

  const handleGenerateApiKey = () => {
    console.log('Generating new API key...');
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout
        userRole="admin"
        userName={currentUser.name}
        userEmail={currentUser.email}
        notificationCount={5}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-muted-foreground">
                Configure platform settings, security, and system preferences.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleResetSettings('all')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            </div>
          </div>

          {/* System Status */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemInfo.uptime}</div>
                <p className="text-xs text-muted-foreground">
                  System uptime
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Server Load</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemInfo.serverLoad}</div>
                <p className="text-xs text-muted-foreground">
                  Current load
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemInfo.memoryUsage}</div>
                <p className="text-xs text-muted-foreground">
                  RAM usage
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System Info</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Basic platform configuration and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="platformName">Platform Name</Label>
                      <Input
                        id="platformName"
                        value={systemSettings.platformName}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, platformName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="platformUrl">Platform URL</Label>
                      <Input
                        id="platformUrl"
                        value={systemSettings.platformUrl}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, platformUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="platformDescription">Platform Description</Label>
                    <Textarea
                      id="platformDescription"
                      value={systemSettings.platformDescription}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, platformDescription: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={systemSettings.adminEmail}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={systemSettings.supportEmail}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                      <Input
                        id="maxFileSize"
                        type="number"
                        value={systemSettings.maxFileSize}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={systemSettings.sessionTimeout}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Feature Toggles</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable maintenance mode to restrict access</p>
                        </div>
                        <Switch
                          id="maintenanceMode"
                          checked={systemSettings.maintenanceMode}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="registrationEnabled">User Registration</Label>
                          <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                        </div>
                        <Switch
                          id="registrationEnabled"
                          checked={systemSettings.registrationEnabled}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="analyticsEnabled">Analytics</Label>
                          <p className="text-sm text-muted-foreground">Enable usage analytics and tracking</p>
                        </div>
                        <Switch
                          id="analyticsEnabled"
                          checked={systemSettings.analyticsEnabled}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, analyticsEnabled: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="debugMode">Debug Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable debug logging and detailed error messages</p>
                        </div>
                        <Switch
                          id="debugMode"
                          checked={systemSettings.debugMode}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, debugMode: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleResetSettings('general')}>
                      Reset
                    </Button>
                    <Button onClick={() => handleSaveSettings('general')} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure SMTP settings for email notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <div className="relative">
                        <Input
                          id="smtpPassword"
                          type={showApiKey ? 'text' : 'password'}
                          value={emailSettings.smtpPassword}
                          onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpEncryption">Encryption</Label>
                      <Select value={emailSettings.smtpEncryption} onValueChange={(value) => setEmailSettings(prev => ({ ...prev, smtpEncryption: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        value={emailSettings.fromName}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="replyToEmail">Reply-To Email</Label>
                      <Input
                        id="replyToEmail"
                        type="email"
                        value={emailSettings.replyToEmail}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, replyToEmail: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleResetSettings('email')}>
                      Reset
                    </Button>
                    <Button variant="outline" onClick={handleTestEmail} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                      Test Email
                    </Button>
                    <Button onClick={() => handleSaveSettings('email')} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security policies and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Password Policy</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passwordMinLength">Minimum Length</Label>
                        <Input
                          id="passwordMinLength"
                          type="number"
                          value={securitySettings.passwordMinLength}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={securitySettings.maxLoginAttempts}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="passwordRequireUppercase">Require Uppercase</Label>
                          <p className="text-sm text-muted-foreground">Password must contain uppercase letters</p>
                        </div>
                        <Switch
                          id="passwordRequireUppercase"
                          checked={securitySettings.passwordRequireUppercase}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireUppercase: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="passwordRequireLowercase">Require Lowercase</Label>
                          <p className="text-sm text-muted-foreground">Password must contain lowercase letters</p>
                        </div>
                        <Switch
                          id="passwordRequireLowercase"
                          checked={securitySettings.passwordRequireLowercase}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireLowercase: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="passwordRequireNumbers">Require Numbers</Label>
                          <p className="text-sm text-muted-foreground">Password must contain numbers</p>
                        </div>
                        <Switch
                          id="passwordRequireNumbers"
                          checked={securitySettings.passwordRequireNumbers}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireNumbers: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="passwordRequireSymbols">Require Symbols</Label>
                          <p className="text-sm text-muted-foreground">Password must contain special characters</p>
                        </div>
                        <Switch
                          id="passwordRequireSymbols"
                          checked={securitySettings.passwordRequireSymbols}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, passwordRequireSymbols: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Session & Access</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                        <Input
                          id="lockoutDuration"
                          type="number"
                          value={securitySettings.lockoutDuration}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, lockoutDuration: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                        </div>
                        <Switch
                          id="twoFactorAuth"
                          checked={securitySettings.twoFactorAuth}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">API & Access Control</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="apiKeyExpiry">API Key Expiry (days)</Label>
                        <Input
                          id="apiKeyExpiry"
                          type="number"
                          value={securitySettings.apiKeyExpiry}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiKeyExpiry: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="allowedDomains">Allowed Domains</Label>
                        <Input
                          id="allowedDomains"
                          value={securitySettings.allowedDomains}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, allowedDomains: e.target.value }))}
                          placeholder="edu,com,org"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                      <Textarea
                        id="ipWhitelist"
                        value={securitySettings.ipWhitelist}
                        onChange={(e) => setSecuritySettings(prev => ({ ...prev, ipWhitelist: e.target.value }))}
                        placeholder="192.168.1.1&#10;10.0.0.0/8"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleResetSettings('security')}>
                      Reset
                    </Button>
                    <Button variant="outline" onClick={handleGenerateApiKey}>
                      <Key className="h-4 w-4 mr-2" />
                      Generate API Key
                    </Button>
                    <Button onClick={() => handleSaveSettings('security')} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure notification preferences and delivery methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailNotifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via email</p>
                        </div>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                        </div>
                        <Switch
                          id="smsNotifications"
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                        </div>
                        <Switch
                          id="pushNotifications"
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="applicationAlerts">Application Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify about new applications and status changes</p>
                        </div>
                        <Switch
                          id="applicationAlerts"
                          checked={notificationSettings.applicationAlerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, applicationAlerts: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="systemAlerts">System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify about system issues and maintenance</p>
                        </div>
                        <Switch
                          id="systemAlerts"
                          checked={notificationSettings.systemAlerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="mouExpiryAlerts">MoU Expiry Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify about expiring MoUs</p>
                        </div>
                        <Switch
                          id="mouExpiryAlerts"
                          checked={notificationSettings.mouExpiryAlerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, mouExpiryAlerts: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="newUserAlerts">New User Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify about new user registrations</p>
                        </div>
                        <Switch
                          id="newUserAlerts"
                          checked={notificationSettings.newUserAlerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newUserAlerts: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Reports</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weeklyReports">Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Send weekly summary reports</p>
                        </div>
                        <Switch
                          id="weeklyReports"
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="monthlyReports">Monthly Reports</Label>
                          <p className="text-sm text-muted-foreground">Send monthly summary reports</p>
                        </div>
                        <Switch
                          id="monthlyReports"
                          checked={notificationSettings.monthlyReports}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, monthlyReports: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleResetSettings('notifications')}>
                      Reset
                    </Button>
                    <Button onClick={() => handleSaveSettings('notifications')} disabled={isLoading}>
                      {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      System Information
                    </CardTitle>
                    <CardDescription>
                      Current system status and version information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Version</Label>
                        <p className="text-sm text-muted-foreground">{systemInfo.version}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Update</Label>
                        <p className="text-sm text-muted-foreground">{systemInfo.lastUpdate}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Uptime</Label>
                        <p className="text-sm text-muted-foreground">{systemInfo.uptime}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Database Size</Label>
                        <p className="text-sm text-muted-foreground">{systemInfo.databaseSize}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Resource Usage
                    </CardTitle>
                    <CardDescription>
                      Current system resource utilization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Server Load</span>
                        <span className="text-sm text-muted-foreground">{systemInfo.serverLoad}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Memory Usage</span>
                        <span className="text-sm text-muted-foreground">{systemInfo.memoryUsage}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Disk Usage</span>
                        <span className="text-sm text-muted-foreground">{systemInfo.diskUsage}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Platform Statistics
                  </CardTitle>
                  <CardDescription>
                    Current platform usage and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{systemInfo.totalUsers}</div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{systemInfo.totalApplications}</div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-sm text-muted-foreground">Active Internships</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-sm text-muted-foreground">Active MoUs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
