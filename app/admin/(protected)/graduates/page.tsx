"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Upload,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Pencil,
  Save,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";

type EventItem = {
  id: number;
  name: string;
};

type Graduate = {
  id: number;
  event_id: number;
  nim: string;
  graduation_number: string;
  name: string;
  faculty: string;
  study_program: string;
};

type ImportFailed = {
  row?: {
    nim?: string;
    graduation_number?: string;
    name?: string;
    faculty?: string;
    study_program?: string;
  };
  reason?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL;

type GraduateForm = Omit<Graduate, "id" | "event_id">;

const PER_PAGE = 25;

export default function GraduatesPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [graduates, setGraduates] = useState<Graduate[]>([]);

  const [eventId, setEventId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const [loading, setLoading] = useState(false);
  const [loadingGraduates, setLoadingGraduates] = useState(false);

  const [importSuccess, setImportSuccess] = useState<number | null>(null);
  const [importFailed, setImportFailed] = useState<ImportFailed[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<GraduateForm | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ==============================
  // LOAD INITIAL DATA
  // ==============================

  useEffect(() => {
    loadEvents();
  }, []);

  // ==============================
  // EVENT CHANGED
  // ==============================

  useEffect(() => {
    setFile(null);
    setMessage("");
    setMessageType("");

    setImportSuccess(null);
    setImportFailed([]);

    setPage(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (eventId) {
      loadGraduates(eventId, 1);
    } else {
      setGraduates([]);
    }
  }, [eventId]);

  // ==============================
  // TOKEN
  // ==============================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==============================
  // LOAD EVENTS
  // ==============================

  const loadEvents = async () => {
    try {
      const token = getToken();

      const res = await fetch(`${API}/api/admin/events/options`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to load events");
        setMessageType("error");
        return;
      }

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server");
      setMessageType("error");
    }
  };

  // ==============================
  // LOAD GRADUATES
  // ==============================

  const loadGraduates = async (selectedEventId?: string, targetPage?: number) => {
    const id = selectedEventId || eventId;

    if (!id) {
      return;
    }

    const currentPage = targetPage ?? page;

    try {
      setLoadingGraduates(true);

      const token = getToken();

      const params = new URLSearchParams({
        eventId: String(id),
        page: String(currentPage),
        limit: String(PER_PAGE),
      });

      if (query) {
        params.set("search", query);
      }

      const res = await fetch(
        `${API}/api/admin/graduates?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setGraduates([]);
        setTotal(0);
        setMessage(data.message || "Failed to load graduates");
        setMessageType("error");
        return;
      }

      setGraduates(Array.isArray(data.graduates) ? data.graduates : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (error) {
      console.error(error);
      setGraduates([]);
      setMessage("Cannot load graduate data");
      setMessageType("error");
    } finally {
      setLoadingGraduates(false);
    }
  };

  // ==============================
  // DOWNLOAD EXCEL TEMPLATE
  // ==============================

  const downloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      setMessage("");
      setMessageType("");

      const res = await fetch(`${API}/api/admin/graduates/template`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        setMessage("Failed to download template");
        setMessageType("error");
        return;
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "template-graduates.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server");
      setMessageType("error");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  // ==============================
  // CHOOSE FILE
  // ==============================

  const chooseFile = () => {
    if (!eventId) {
      setMessage("Select event first");
      setMessageType("error");
      return;
    }

    fileInputRef.current?.click();
  };

  // ==============================
  // FILE CHANGED
  // ==============================

  const handleFileChange = (files: FileList) => {
    const selectedFile = files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (extension !== "xlsx" && extension !== "xls") {
      setFile(null);
      setMessage("File must be .xlsx or .xls");
      setMessageType("error");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
    setMessage("");
    setMessageType("");

    setImportSuccess(null);
    setImportFailed([]);
  };

  // ==============================
  // REMOVE FILE
  // ==============================

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==============================
  // IMPORT EXCEL
  // ==============================

  const importExcel = async () => {
    setMessage("");
    setMessageType("");

    setImportSuccess(null);
    setImportFailed([]);

    if (!eventId) {
      setMessage("Select event first");
      setMessageType("error");
      return;
    }

    if (!file) {
      setMessage("Choose Excel file first");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();

      form.append("event_id", eventId);
      form.append("file", file);

      const token = getToken();

      const res = await fetch(`${API}/api/admin/graduates/import`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Import failed");
        setMessageType("error");
        return;
      }

      const successCount = typeof data.success === "number" ? data.success : 0;

      const failedRows = Array.isArray(data.failed) ? data.failed : [];

      setImportSuccess(successCount);
      setImportFailed(failedRows);

      setMessage(
        `Import completed: ${successCount} success, ${failedRows.length} failed`
      );

      setMessageType(failedRows.length > 0 ? "error" : "success");

      removeFile();

      await loadGraduates(eventId);
    } catch (error) {
      console.error(error);
      setMessage("Cannot connect to server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (graduate: Graduate) => {
    setEditingId(graduate.id);
    setEditForm({
      nim: graduate.nim || "",
      graduation_number: graduate.graduation_number || "",
      name: graduate.name || "",
      faculty: graduate.faculty || "",
      study_program: graduate.study_program || "",
    });
  };

  const updateEditField = (field: keyof GraduateForm, value: string) => {
    setEditForm((current) => current ? { ...current, [field]: value } : current);
  };

  const saveGraduate = async () => {
    if (editingId === null || !editForm) return;

    const res = await fetch(`${API}/api/admin/graduates/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(editForm),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Update failed");
      setMessageType("error");
      return;
    }

    setEditingId(null);
    setEditForm(null);
    setMessage("Graduate updated");
    setMessageType("success");
    loadGraduates(eventId);
  };

  const deleteGraduate = async (id: number) => {
    if (!confirm("Delete this graduate and all associated photos?")) return;

    const res = await fetch(`${API}/api/admin/graduates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "Delete failed");
      setMessageType("error");
      return;
    }

    setMessage("Graduate deleted");
    setMessageType("success");
    loadGraduates(eventId);
  };

  const runSearch = () => {
    if (!eventId) return;
    setPage(1);
    loadGraduates(eventId, 1);
  };

  const gotoPage = (next: number) => {
    setPage(next);
    loadGraduates(eventId, next);
  };

  // ==============================
  // SELECTED EVENT
  // ==============================

  const selectedEvent = events.find(
    (item) => String(item.id) === String(eventId)
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Graduates Management"
        subtitle="Import and manage graduate data for each event."
      />

      {/* IMPORT PANEL */}
      <Card className="space-y-6 p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label>Event</Label>

            <Select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
            >
              <option value="">Select Event</option>

              {events.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>

          {/* TEMPLATE DOWNLOAD */}
          <div className="flex flex-col rounded-[18px] border border-line-soft bg-card-2 p-5">
            <p className="flex items-center gap-2 font-semibold">
              <FileSpreadsheet size={16} className="text-success" />
              Excel Template
            </p>

            <p className="mt-2 text-sm text-low">
              Download the template, fill in the graduate data, then upload it
              below.
            </p>

            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadTemplate}
                disabled={downloadingTemplate}
              >
                <Download size={14} />
                {downloadingTemplate ? "DOWNLOADING..." : "DOWNLOAD TEMPLATE"}
              </Button>
            </div>

            <p className="mt-3 text-xs text-low">
              Kolom: nim, graduation_number, name, faculty, study_program.
              event_id tidak perlu diisi — event mengikuti pilihan di atas.
            </p>
          </div>
        </div>

        {/* FILE UPLOAD */}
        <div>
          <Label>Excel File</Label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              if (e.target.files) handleFileChange(e.target.files);
            }}
            className="hidden"
          />

          <div
            className="
              flex flex-col gap-4 rounded-[18px] border border-dashed border-line
              bg-card-2 p-6 sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div className="min-w-0">
              {file ? (
                <>
                  <p className="truncate font-semibold text-hi">{file.name}</p>
                  <p className="mt-1 text-sm text-low">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-hi">
                    No Excel file selected
                  </p>
                  <p className="mt-1 text-sm text-low">.xlsx or .xls</p>
                </>
              )}
            </div>

            <div className="flex shrink-0 gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={chooseFile}
                disabled={!eventId || loading}
              >
                {file ? "CHANGE FILE" : "CHOOSE FILE"}
              </Button>

              {file && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={removeFile}
                  disabled={loading}
                >
                  <Trash2 size={14} />
                  REMOVE
                </Button>
              )}
            </div>
          </div>

          {!eventId && (
            <p className="mt-3 text-sm text-accent">
              Select event first to choose Excel file.
            </p>
          )}
        </div>

        <Button
          onClick={importExcel}
          disabled={loading || !eventId || !file}
        >
          <Upload size={16} />
          {loading ? "IMPORTING..." : "IMPORT EXCEL"}
        </Button>

        {message && (
          <Alert
            tone={
              messageType === "success"
                ? "success"
                : messageType === "error"
                ? "error"
                : "info"
            }
          >
            {message}
          </Alert>
        )}

        {/* RESULT */}
        {importSuccess !== null && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[18px] border border-success/25 bg-success/10 p-5">
              <p className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 size={15} />
                Success
              </p>

              <p className="mt-1 text-3xl font-extrabold text-success">
                {importSuccess}
              </p>
            </div>

            <div className="rounded-[18px] border border-danger/25 bg-danger/10 p-5">
              <p className="flex items-center gap-2 text-sm text-danger">
                <XCircle size={15} />
                Failed
              </p>

              <p className="mt-1 text-3xl font-extrabold text-danger">
                {importFailed.length}
              </p>
            </div>
          </div>
        )}

        {/* FAILED ROWS */}
        {importFailed.length > 0 && (
          <div className="rounded-[18px] border border-danger/25 bg-danger/5 p-5">
            <h3 className="font-semibold text-danger">Failed Rows</h3>

            <div className="mt-4 max-h-60 space-y-2 overflow-y-auto pr-1">
              {importFailed.map((item, index) => (
                <div
                  key={index}
                  className="rounded-[13px] bg-field px-4 py-3 text-sm"
                >
                  <span className="text-mid">
                    {item.row?.nim || "-"}
                    {item.row?.name ? ` - ${item.row.name}` : ""}
                  </span>

                  <span className="ml-2 text-danger">
                    ({item.reason || "Import failed"})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* GRADUATE LIST */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Graduate List</h2>

            {selectedEvent && (
              <p className="mt-1 text-sm text-low">
                Event: {selectedEvent.name}
              </p>
            )}
          </div>

          {eventId && (
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="neutral">
                <Users size={13} />
                {total} Graduates
              </Badge>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search name / NIM / no."
                  value={search}
                  className="w-56"
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setQuery(search);
                      runSearch();
                    }
                  }}
                />

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setQuery(search);
                    runSearch();
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          )}
        </div>

        {!eventId ? (
          <EmptyState
            icon={<GraduationCap size={22} />}
            title="Select an event"
            description="Select an event to view graduate data."
          />
        ) : loadingGraduates ? (
          <EmptyState title="Loading graduates..." />
        ) : graduates.length === 0 ? (
          <EmptyState
            icon={<GraduationCap size={22} />}
            title="No graduate data"
            description="No graduate data for this event."
          />
        ) : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-line-soft text-left text-[13px] text-low">
                    <th className="p-4 font-semibold">No</th>
                    <th className="p-4 font-semibold">NIM</th>
                    <th className="p-4 font-semibold">Graduation Number</th>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Faculty</th>
                    <th className="p-4 font-semibold">Study Program</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {graduates.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-line-soft text-sm transition last:border-0 hover:bg-white/5"
                    >
                      <td className="p-4 text-low">{index + 1}</td>
                      {editingId === item.id && editForm ? (
                        <>
                          {(["nim", "graduation_number", "name", "faculty", "study_program"] as const).map((field) => (
                            <td className="p-2" key={field}>
                              <Input
                                value={editForm[field]}
                                onChange={(e) => updateEditField(field, e.target.value)}
                              />
                            </td>
                          ))}
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Button size="sm" variant="success" onClick={saveGraduate}>
                                <Save size={14} />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                <X size={14} />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 font-semibold">{item.nim}</td>
                          <td className="p-4 text-mid">{item.graduation_number}</td>
                          <td className="p-4">{item.name}</td>
                          <td className="p-4 text-mid">{item.faculty}</td>
                          <td className="p-4 text-mid">{item.study_program}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary" onClick={() => startEdit(item)}>
                                <Pencil size={14} />
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => deleteGraduate(item.id)}>
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

            {total > PER_PAGE && (
              <div className="flex items-center justify-between gap-4 border-t border-line-soft p-4">
                <span className="text-sm text-low">
                  Page {page} of {Math.max(Math.ceil(total / PER_PAGE), 1)}
                </span>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page <= 1 || loadingGraduates}
                    onClick={() => gotoPage(page - 1)}
                  >
                    Previous
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      page >= Math.ceil(total / PER_PAGE) || loadingGraduates
                    }
                    onClick={() => gotoPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
