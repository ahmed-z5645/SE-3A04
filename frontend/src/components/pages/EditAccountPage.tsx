"use client";

import { useState, type FormEvent } from "react";
import { Button, Card, Input, Label, Select } from "@/components/ui";
import { useAuth } from "@/lib/auth/AuthContext";

export function EditAccountPage() {
  const { session, role } = useAuth();
  const email = session?.email ?? "";
  const displayRole = role === "admin" ? "Administrator" : "Operator";

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);

  const [language, setLanguage] = useState("English");
  const [units, setUnits] = useState("Metric (°C, km)");
  const [notifications, setNotifications] = useState("Enabled");
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) {
      setPwMessage("All password fields are required.");
      return;
    }
    if (newPw.length < 8) {
      setPwMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwMessage("New passwords do not match.");
      return;
    }
    // No real backend yet — authApi.changePassword will land in M8+/real API.
    setPwMessage("Password updated.");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  }

  function handlePrefsSubmit(e: FormEvent) {
    e.preventDefault();
    setPrefsMessage("Preferences saved.");
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">
          Account Settings
        </h1>
      </header>

      <div className="max-w-[600px] pb-12">
        <Card>
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            Profile
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <Label>Email</Label>
              <Input value={email} readOnly />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={displayRole} readOnly />
            </div>
          </div>
        </Card>

        <form onSubmit={handlePasswordSubmit}>
          <Card className="mt-4">
            <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
              Change Password
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                />
              </div>
            </div>
            {pwMessage && (
              <div className="mt-3 text-xs text-text-secondary">
                {pwMessage}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </div>
          </Card>
        </form>

        <form onSubmit={handlePrefsSubmit}>
          <Card className="mt-4">
            <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
              Preferences
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <Label>Language</Label>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Français</option>
                </Select>
              </div>
              <div>
                <Label>Units</Label>
                <Select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                >
                  <option>Metric (°C, km)</option>
                  <option>Imperial (°F, mi)</option>
                </Select>
              </div>
              <div>
                <Label>Alert Notifications</Label>
                <Select
                  value={notifications}
                  onChange={(e) => setNotifications(e.target.value)}
                >
                  <option>Enabled</option>
                  <option>Disabled</option>
                </Select>
              </div>
            </div>
            {prefsMessage && (
              <div className="mt-3 text-xs text-text-secondary">
                {prefsMessage}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="primary" type="submit">
                Save Preferences
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
