"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Users,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBatches,
  createBatch,
  updateBatchStatus,
  updateBatch,
  getRegistrationsForBatch,
  deleteBatch,
} from "@/actions/courses";

export default function AdminCoursesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseType: "hardware",
    startDate: "",
    endDate: "",
    timing: "12:00 PM – 4:00 PM",
    maxSeats: "4",
    price: "4999",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const [isStudentsOpen, setIsStudentsOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch {
      toast.error("Failed to fetch batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createBatch({
        courseType: formData.courseType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timing: formData.timing,
        maxSeats: Number(formData.maxSeats),
        price: Number(formData.price),
      });

      if (res.success) {
        toast.success("Batch created successfully");
        setIsCreateOpen(false);
        fetchBatches();
      } else {
        toast.error(res.error || "Failed to create batch");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const openEditModal = (batch: any) => {
    setFormData({
      courseType: batch.courseType,
      startDate: new Date(batch.startDate).toISOString().split("T")[0],
      endDate: new Date(batch.endDate).toISOString().split("T")[0],
      timing: batch.timing,
      maxSeats: batch.maxSeats.toString(),
      price: (batch.price || 4999).toString(),
    });
    setEditingBatchId(batch._id);
    setIsEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatchId) return;
    try {
      const res = await updateBatch(editingBatchId, {
        courseType: formData.courseType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        timing: formData.timing,
        maxSeats: Number(formData.maxSeats),
        price: Number(formData.price),
      });

      if (res.success) {
        toast.success("Batch updated successfully");
        setIsEditOpen(false);
        fetchBatches();
      } else {
        toast.error(res.error || "Failed to update batch");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleStatusChange = async (batchId: string, status: string) => {
    try {
      const res = await updateBatchStatus(batchId, status);
      if (res.success) {
        toast.success(`Batch status updated to ${status}`);
        fetchBatches();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this batch? This action cannot be undone.",
      )
    )
      return;
    try {
      const res = await deleteBatch(batchId);
      if (res.success) {
        toast.success("Batch deleted successfully");
        fetchBatches();
      } else {
        toast.error(res.error || "Failed to delete batch");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData({
      ...formData,
      courseType: type,
      timing: type === "hardware" ? "12:00 PM – 4:00 PM" : "4:00 PM – 8:00 PM",
    });
  };

  const viewStudents = async (batchId: string) => {
    setIsStudentsOpen(true);
    setStudentsLoading(true);
    try {
      const data = await getRegistrationsForBatch(batchId);
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    } finally {
      setStudentsLoading(false);
    }
  };

  const renderFormFields = () => (
    <div className="space-y-5 text-black">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">
          Course Type
        </Label>
        <Select value={formData.courseType} onValueChange={handleTypeChange}>
          <SelectTrigger className="rounded-xl h-12 border border-gray-300 bg-white text-gray-950 font-medium px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all">
            <SelectValue placeholder="Select Course Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white border border-gray-200 shadow-lg text-gray-900">
            <SelectItem
              value="hardware"
              className="focus:bg-green-50 focus:text-green-900 py-3 rounded-lg cursor-pointer"
            >
              Hardware Track
            </SelectItem>
            <SelectItem
              value="software"
              className="focus:bg-green-50 focus:text-green-900 py-3 rounded-lg cursor-pointer"
            >
              Software Track
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Start Date
          </Label>
          <Input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="rounded-xl h-12 border border-gray-300 bg-white text-gray-950 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            End Date
          </Label>
          <Input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="rounded-xl h-12 border border-gray-300 bg-white text-gray-950 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Timing</Label>
        <Input
          required
          value={formData.timing}
          onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
          className="rounded-xl h-12 border border-gray-300 bg-white text-gray-950 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
          placeholder="e.g. 12:00 PM – 4:00 PM"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Maximum Seats
          </Label>
          <Input
            type="number"
            min="1"
            required
            value={formData.maxSeats}
            onChange={(e) =>
              setFormData({ ...formData, maxSeats: e.target.value })
            }
            className="rounded-xl h-12 border border-gray-300 bg-white text-gray-950 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700">
            Price (₹)
          </Label>
          <Input
            type="number"
            min="0"
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="rounded-xl h-12 border border-gray-300 bg-white text-gray-950 px-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Batches</h1>
          <p className="text-gray-500 mt-1">
            Manage training program batches and enrollment limits.
          </p>
        </div>
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (open) {
              setFormData({
                courseType: "hardware",
                startDate: "",
                endDate: "",
                timing: "12:00 PM – 4:00 PM",
                maxSeats: "4",
                price: "4999",
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 px-6 transition-all shadow-md hover:shadow-lg font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col gap-0 text-black">
            <DialogHeader className="pb-4 border-b border-gray-150 mb-5 shrink-0">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Create New Batch
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Set up a new training session with limits and pricing.
              </p>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5">
              {renderFormFields()}
              <div className="flex gap-3 mt-8">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl h-12 px-6 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-all"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-black text-white hover:bg-gray-800 font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Create Batch
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col gap-0 text-black">
          <DialogHeader className="pb-4 border-b border-gray-150 mb-5 shrink-0">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Edit Batch
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Modify batch schedule, pricing, or seating capacity.
            </p>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-5">
            {renderFormFields()}
            <div className="flex gap-3 mt-8">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl h-12 px-6 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black font-semibold transition-all"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="flex-1 h-12 rounded-xl bg-black text-white hover:bg-gray-800 font-bold transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Students Dialog */}
      <Dialog open={isStudentsOpen} onOpenChange={setIsStudentsOpen}>
        <DialogContent className="sm:max-w-4xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col gap-0 text-black overflow-hidden">
          <DialogHeader className="pb-4 border-b border-gray-150 shrink-0 mb-6">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Registered Students
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              View details of all student enrollments for this session.
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-2">
            {studentsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">
                  No students registered for this batch yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3 min-w-[700px]">
                <div className="grid grid-cols-5 gap-4 font-bold text-gray-600 border-b border-gray-150 pb-3 text-xs uppercase tracking-wider">
                  <div className="col-span-2">Name & Email</div>
                  <div>Phone</div>
                  <div>College</div>
                  <div>Payment ID</div>
                </div>
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="grid grid-cols-5 gap-4 items-center py-3.5 border-b border-gray-100 last:border-0 text-sm hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-all"
                  >
                    <div className="col-span-2">
                      <div className="font-bold text-gray-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {student.email}
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {student.mobile}
                    </div>
                    <div
                      className="truncate text-gray-700 font-medium"
                      title={student.college}
                    >
                      {student.college}
                    </div>
                    <div>
                      <span
                        className="font-mono text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 rounded truncate block max-w-[130px] text-center font-medium cursor-help"
                        title={student.paymentIntentId}
                      >
                        {student.paymentIntentId
                          ? student.paymentIntentId.slice(-8)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end pt-5 border-t border-gray-150 mt-6 shrink-0">
            <DialogClose asChild>
              <Button
                type="button"
                className="rounded-xl h-12 px-8 bg-black text-white hover:bg-gray-800 font-bold transition-all shadow-md hover:shadow-lg"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">
            No batches found. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div
              key={batch._id}
              className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 left-0 w-full h-2 ${batch.courseType === "hardware" ? "bg-orange-500" : "bg-cyan-500"}`}
              ></div>

              <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                  <Badge
                    variant="outline"
                    className={`mb-2 font-bold ${batch.courseType === "hardware" ? "text-orange-600 border-orange-200 bg-orange-50" : "text-cyan-600 border-cyan-200 bg-cyan-50"}`}
                  >
                    {batch.courseType.toUpperCase()}
                  </Badge>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">
                    {batch.timing}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      batch.status === "active"
                        ? "default"
                        : batch.status === "full"
                          ? "destructive"
                          : "secondary"
                    }
                    className={
                      batch.status === "active"
                        ? "bg-green-500 text-white border-transparent"
                        : ""
                    }
                  >
                    {batch.status.toUpperCase()}
                  </Badge>
                  <button
                    onClick={() => openEditModal(batch)}
                    className="p-1.5 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit Batch"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBatch(batch._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 flex-grow mb-6">
                <p>
                  <strong>Starts:</strong>{" "}
                  {new Date(batch.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Ends:</strong>{" "}
                  {new Date(batch.endDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Price:</strong> ₹{batch.price || 4999}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">Enrollment</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-black">
                    {batch.currentRegistrations}
                  </span>
                  <span className="text-gray-400 font-semibold">
                    {" "}
                    / {batch.maxSeats}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {batch.status === "upcoming" && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50 font-semibold"
                    onClick={() => handleStatusChange(batch._id, "active")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Activate
                  </Button>
                )}
                {batch.status === "active" && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 font-semibold"
                    onClick={() => handleStatusChange(batch._id, "completed")}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> End Batch
                  </Button>
                )}
                {batch.status === "completed" && (
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50 font-semibold"
                    onClick={() => handleStatusChange(batch._id, "active")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Reactivate
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-900 font-semibold"
                  onClick={() => viewStudents(batch._id)}
                >
                  <Eye className="w-4 h-4 mr-2" /> Students
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
