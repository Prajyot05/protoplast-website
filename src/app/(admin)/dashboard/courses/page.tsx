"use client";

import { useEffect, useState } from "react";
import { Plus, CheckCircle2, XCircle, Users } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBatches, createBatch, updateBatchStatus } from "@/actions/courses";

export default function AdminCoursesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseType: "hardware",
    startDate: "",
    endDate: "",
    timing: "12:00 PM – 4:00 PM",
    maxSeats: "4",
  });

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
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
      });

      if (res.success) {
        toast.success("Batch created successfully");
        setIsDialogOpen(false);
        fetchBatches();
      } else {
        toast.error(res.error || "Failed to create batch");
      }
    } catch (error) {
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
    } catch (error) {
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Batches</h1>
          <p className="text-gray-500 mt-1">Manage training program batches and enrollment limits.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Course Type</Label>
                <Select value={formData.courseType} onValueChange={handleTypeChange}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="hardware">Hardware Track</SelectItem>
                    <SelectItem value="software">Software Track</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="rounded-xl h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timing</Label>
                <Input required value={formData.timing} onChange={(e) => setFormData({ ...formData, timing: e.target.value })} className="rounded-xl h-12" />
              </div>

              <div className="space-y-2">
                <Label>Maximum Seats</Label>
                <Input type="number" min="1" required value={formData.maxSeats} onChange={(e) => setFormData({ ...formData, maxSeats: e.target.value })} className="rounded-xl h-12" />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl bg-black text-white hover:bg-gray-800">
                Create Batch
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : batches.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">No batches found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <div key={batch._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 ${batch.courseType === 'hardware' ? 'bg-orange-500' : 'bg-cyan-500'}`}></div>
              
              <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                  <Badge variant="outline" className={`mb-2 ${batch.courseType === 'hardware' ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-cyan-600 border-cyan-200 bg-cyan-50'}`}>
                    {batch.courseType.toUpperCase()}
                  </Badge>
                  <h3 className="text-xl font-bold tracking-tight">{batch.timing}</h3>
                </div>
                <Badge variant={batch.status === 'active' ? 'default' : batch.status === 'full' ? 'destructive' : 'secondary'} className={batch.status === 'active' ? 'bg-green-500' : ''}>
                  {batch.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600 flex-grow mb-6">
                <p><strong>Starts:</strong> {new Date(batch.startDate).toLocaleDateString()}</p>
                <p><strong>Ends:</strong> {new Date(batch.endDate).toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Enrollment</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-black">{batch.currentRegistrations}</span>
                  <span className="text-gray-400 font-medium"> / {batch.maxSeats}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {batch.status === 'upcoming' && (
                  <Button variant="outline" className="flex-1 rounded-xl text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange(batch._id, 'active')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Activate
                  </Button>
                )}
                {batch.status === 'active' && (
                  <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(batch._id, 'completed')}>
                    <XCircle className="w-4 h-4 mr-2" /> End Batch
                  </Button>
                )}
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => toast.info("Viewing students feature coming soon!")}>
                  View Students
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
