import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("api")
  const [settings, setSettings] = useState({
    apiKey: "",
    theme: "light",
    primaryColor: "#5B47E0",
    secondaryColor: "#8B7FE8",
    fontFamily: "Inter",
    fontSize: "14",
    autoProcess: true,
    qualityLevel: "high",
    speakerDetection: "auto",
    exportFormat: "txt"
  })
  const [saving, setSaving] = useState(false)
  const [testingApi, setTestingApi] = useState(false)

  const tabs = [
    { id: "api", name: "API Configuration", icon: "Zap" },
    { id: "appearance", name: "Appearance", icon: "Palette" },
    { id: "processing", name: "Processing", icon: "Settings" },
    { id: "account", name: "Account", icon: "User" }
  ]

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("transcriptHubSettings")
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }, [])

  const saveSettings = async () => {
    try {
      setSaving(true)
      
      // Save to localStorage (in real app, would save to backend)
      localStorage.setItem("transcriptHubSettings", JSON.stringify(settings))
      
      // Apply theme changes
      document.documentElement.style.setProperty("--primary-color", settings.primaryColor)
      document.documentElement.style.setProperty("--secondary-color", settings.secondaryColor)
      
      toast.success("Settings saved successfully")
    } catch (err) {
      toast.error("Failed to save settings")
      console.error("Save settings error:", err)
    } finally {
      setSaving(false)
    }
  }

  const testApiConnection = async () => {
    if (!settings.apiKey.trim()) {
      toast.error("Please enter an API key first")
      return
    }

    try {
      setTestingApi(true)
      
      // Simulate API test (in real app, would test actual ElevenLabs API)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("API connection successful!")
    } catch (err) {
      toast.error("API connection failed. Please check your key.")
      console.error("API test error:", err)
    } finally {
      setTestingApi(false)
    }
  }

  const resetSettings = () => {
    const defaultSettings = {
      apiKey: "",
      theme: "light",
      primaryColor: "#5B47E0",
      secondaryColor: "#8B7FE8",
      fontFamily: "Inter",
      fontSize: "14",
      autoProcess: true,
      qualityLevel: "high",
      speakerDetection: "auto",
      exportFormat: "txt"
    }
    setSettings(defaultSettings)
    toast.info("Settings reset to defaults")
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Customize your TranscriptHub experience and configure integrations
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="p-6">
            {activeTab === "api" && (
              <ApiConfigurationTab
                settings={settings}
                updateSetting={updateSetting}
                testApiConnection={testApiConnection}
                testingApi={testingApi}
              />
            )}

            {activeTab === "appearance" && (
              <AppearanceTab
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeTab === "processing" && (
              <ProcessingTab
                settings={settings}
                updateSetting={updateSetting}
              />
            )}

            {activeTab === "account" && (
              <AccountTab />
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <Button
                onClick={resetSettings}
                variant="ghost"
              >
                Reset to Defaults
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={saveSettings}
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const ApiConfigurationTab = ({ settings, updateSetting, testApiConnection, testingApi }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">API Configuration</h2>
      <p className="text-gray-600 mb-6">
        Configure your ElevenLabs API integration for speech-to-text processing
      </p>
    </div>

    <div className="space-y-4">
      <div>
        <Input
          label="ElevenLabs API Key"
          type="password"
          value={settings.apiKey}
          onChange={(e) => updateSetting("apiKey", e.target.value)}
          placeholder="Enter your ElevenLabs API key"
          helperText="Your API key is stored securely and never shared"
        />
        <div className="mt-3">
          <Button
            onClick={testApiConnection}
            variant="outline"
            size="sm"
            disabled={testingApi || !settings.apiKey.trim()}
          >
            {testingApi ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <ApperIcon name="Zap" className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              Getting Your API Key
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Visit the ElevenLabs website and create an account</p>
              <p>2. Navigate to your API settings</p>
              <p>3. Generate a new API key</p>
              <p>4. Copy and paste it into the field above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const AppearanceTab = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
      <p className="text-gray-600 mb-6">
        Customize the look and feel of your TranscriptHub interface
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting("theme", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (System)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => updateSetting("fontFamily", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size
        </label>
        <select
          value={settings.fontSize}
          onChange={(e) => updateSetting("fontSize", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="12">Small (12px)</option>
          <option value="14">Medium (14px)</option>
          <option value="16">Large (16px)</option>
          <option value="18">Extra Large (18px)</option>
        </select>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Color Scheme</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => updateSetting("primaryColor", e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <Input
              value={settings.primaryColor}
              onChange={(e) => updateSetting("primaryColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => updateSetting("secondaryColor", e.target.value)}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <Input
              value={settings.secondaryColor}
              onChange={(e) => updateSetting("secondaryColor", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: settings.primaryColor }}
          />
          <div
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: settings.secondaryColor }}
          />
          <span className="text-sm text-gray-600">Your custom colors</span>
        </div>
      </div>
    </div>
  </div>
)

const ProcessingTab = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Processing Preferences</h2>
      <p className="text-gray-600 mb-6">
        Configure how your audio files are processed and transcribed
      </p>
    </div>

    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">Auto-process uploads</label>
          <p className="text-sm text-gray-600">Automatically start transcription when files are uploaded</p>
        </div>
        <button
          onClick={() => updateSetting("autoProcess", !settings.autoProcess)}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            settings.autoProcess ? "bg-primary" : "bg-gray-200"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
              settings.autoProcess ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audio Quality Level
        </label>
        <select
          value={settings.qualityLevel}
          onChange={(e) => updateSetting("qualityLevel", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="low">Low (Faster, less accurate)</option>
          <option value="medium">Medium (Balanced)</option>
          <option value="high">High (Slower, more accurate)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speaker Detection
        </label>
        <select
          value={settings.speakerDetection}
          onChange={(e) => updateSetting("speakerDetection", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="auto">Automatic</option>
          <option value="manual">Manual</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Export Format
        </label>
        <select
          value={settings.exportFormat}
          onChange={(e) => updateSetting("exportFormat", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="txt">Text (.txt)</option>
          <option value="pdf">PDF (.pdf)</option>
          <option value="docx">Word Document (.docx)</option>
        </select>
      </div>
    </div>
  </div>
)

const AccountTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
      <p className="text-gray-600 mb-6">
        Manage your account settings and data
      </p>
    </div>

    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Demo User</h3>
            <p className="opacity-90">demo@transcripthub.com</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="FileAudio" className="w-6 h-6 text-success" />
          </div>
          <p className="text-2xl font-bold text-gray-900">24</p>
          <p className="text-sm text-gray-600">Files Processed</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Clock" className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">48h</p>
          <p className="text-sm text-gray-600">Audio Transcribed</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Zap" className="w-6 h-6 text-warning" />
          </div>
          <p className="text-2xl font-bold text-gray-900">156</p>
          <p className="text-sm text-gray-600">API Calls</p>
        </Card>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Clear Cache
          </Button>
          <Button variant="error" className="w-full justify-start">
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  </div>
)

export default SettingsPage