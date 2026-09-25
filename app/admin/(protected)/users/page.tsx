"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Users,
  Pencil,
  Trash2,
  Save,
  X,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";

type AdminUser = {
  id: number;
  username: string;
  created_at: string;
  is_self: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL;

const PASSWORD_MIN_LENGTH = 8;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  const [form, setForm] = useState({ username: "", password: "" });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ username: "", password: "" });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    loadUsers();
  }, []);

  const showMessage = (text: string, type: "success" | "error" | "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const res = await fetch(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setUsers([]);
        showMessage(data.message || "Failed to load users", "error");
        return;
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
      showMessage("Cannot load admin users", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const createUser = async () => {
    setMessage("");

    if (!form.username.trim()) {
      showMessage("Username is required", "error");
      return;
    }

    if (form.password.length < PASSWORD_MIN_LENGTH) {
      showMessage(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Create failed", "error");
        return;
      }

      showMessage(`Admin "${data.user.username}" created`, "success");
      setForm({ username: "", password: "" });
      loadUsers();
    } catch (error) {
      console.error(error);
      showMessage("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setEditForm({ username: user.username, password: "" });
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ username: "", password: "" });
  };

  const saveUser = async () => {
    if (editingId === null) return;

    setMessage("");

    const payload: { username?: string; password?: string } = {};

    if (editForm.username.trim()) {
      payload.username = editForm.username.trim();
    }

    // Password hanya dikirim kalau diisi — kalau dikosongkan,
    // password lama dipertahankan.
    if (editForm.password) {
      if (editForm.password.length < PASSWORD_MIN_LENGTH) {
        showMessage(
          `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
          "error"
        );
        return;
      }

      payload.password = editForm.password;
    }

    if (Object.keys(payload).length === 0) {
      showMessage("Nothing to update", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/admin/users/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Update failed", "error");
        return;
      }

      showMessage(`Admin "${data.user.username}" updated`, "success");
      cancelEdit();
      loadUsers();
    } catch (error) {
      console.error(error);
      showMessage("Cannot connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`Delete admin "${user.username}"? This cannot be undone.`)) {
      return;
    }

    setMessage("");

    try {
      const res = await fetch(`${API}/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Delete failed", "error");
        return;
      }

      showMessage(`Admin "${user.username}" deleted`, "success");
      loadUsers();
    } catch (error) {
      console.error(error);
      showMessage("Cannot connect to server", "error");
    }
  };

  const selfCount = users.filter((user) => user.is_self).length;

  return (
    <div className="space-y-7">
      <PageHeader
        title="User Management"
        subtitle="Add or manage administrator accounts."
      />

      {/* CREATE PANEL */}
      <Card className="space-y-5 p-6 md:p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-soft text-brand">
            <UserPlus size={18} />
          </span>
          <h2 className="text-lg font-bold">Add New Admin</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>Username</Label>
            <Input
              placeholder="e.g. operator_wisuda"
              value={form.username}
              autoComplete="off"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder={`Min. ${PASSWORD_MIN_LENGTH} chars, letters + numbers`}
              value={form.password}
              autoComplete="new-password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <p className="text-xs text-low">
          Username hanya boleh huruf, angka, titik, underscore, dan dash.
          Password minimal {PASSWORD_MIN_LENGTH} karakter serta mengandung huruf
          dan angka.
        </p>

        <Button onClick={createUser} disabled={loading}>
          <UserPlus size={16} />
          {loading ? "ADDING..." : "ADD ADMIN"}
        </Button>

        {message && <Alert tone={messageType}>{message}</Alert>}
      </Card>

      {/* USER LIST */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Admin Accounts</h2>

          <Badge tone="neutral">
            <Users size={13} />
            {users.length} Admins
          </Badge>
        </div>

        {loadingUsers ? (
          <EmptyState title="Loading admin users..." />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users size={22} />}
            title="No admin accounts"
            description="Add your first admin using the form above."
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-line-soft text-left text-[13px] text-low">
                    <th className="p-4 font-semibold">No</th>
                    <th className="p-4 font-semibold">Username</th>
                    <th className="p-4 font-semibold">Created</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b border-line-soft text-sm transition last:border-0 hover:bg-white/5"
                    >
                      <td className="p-4 text-low">{index + 1}</td>

                      {editingId === user.id ? (
                        <>
                          <td className="p-2">
                            <Input
                              value={editForm.username}
                              autoComplete="off"
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  username: e.target.value,
                                })
                              }
                            />
                          </td>

                          <td className="p-2">
                            <Input
                              type="password"
                              placeholder="New password (optional)"
                              value={editForm.password}
                              autoComplete="new-password"
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  password: e.target.value,
                                })
                              }
                            />
                          </td>

                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="success"
                                onClick={saveUser}
                                disabled={loading}
                              >
                                <Save size={14} />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold">
                                {user.username}
                              </span>

                              {user.is_self && (
                                <Badge tone="brand">
                                  <ShieldCheck size={12} />
                                  You
                                </Badge>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-mid">
                            {formatDate(user.created_at)}
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => startEdit(user)}
                              >
                                <Pencil size={14} />
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                disabled={user.is_self}
                                title={
                                  user.is_self
                                    ? "You cannot delete your own account"
                                    : undefined
                                }
                                onClick={() => deleteUser(user)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <p className="mt-4 flex items-center gap-2 text-xs text-low">
          <KeyRound size={13} />
          Kosongkan password saat mengedit jika tidak ingin mengubahnya.
          {selfCount > 0 &&
            " Akun Anda sendiri tidak bisa dihapus, dan admin terakhir selalu dilindungi."}
        </p>
      </div>
    </div>
  );
}
