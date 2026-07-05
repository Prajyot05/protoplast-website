"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Script from "next/script";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/pages/footer";
import { getBatchById } from "@/actions/courses";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CourseRegistrationPage() {
  const router = useRouter();
  const params = useParams();
  const batchId = params?.batchId as string;

  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    fullAddress: "",
    mobile: "",
    email: "",
    emergencyName: "",
    emergencyNumber: "",
    emergencyRelation: "",
    college: "",
    degree: "",
    branch: "",
    currentYear: "",
    cgpa: "",
    graduationYear: "",
    priorExperience: "",
    relevantSkills: "",
    ownLaptop: "",
    referralSource: "",
    motivation: "",
    questions: "",
    consent: false,
  });

  useEffect(() => {
    async function loadBatch() {
      if (!batchId) return;
      try {
        const b = await getBatchById(batchId);
        if (!b || b.status !== "active") {
          toast.error("This batch is no longer available.");
          router.push("/courses");
          return;
        }
        if (b.currentRegistrations >= b.maxSeats) {
          toast.error("This batch is full.");
          router.push("/courses");
          return;
        }
        setBatch(b);
      } catch {
        toast.error("Failed to load batch info");
      } finally {
        setLoading(false);
      }
    }
    loadBatch();
  }, [batchId, router]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Basic validation before advancing
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.dob ||
        !formData.gender ||
        !formData.fullAddress ||
        !formData.mobile ||
        !formData.email ||
        !formData.emergencyName ||
        !formData.emergencyNumber ||
        !formData.emergencyRelation
      ) {
        toast.error("Please fill all required fields.");
        return;
      }
    }
    if (step === 2) {
      if (
        !formData.college ||
        !formData.degree ||
        !formData.branch ||
        !formData.currentYear ||
        !formData.graduationYear
      ) {
        toast.error("Please fill all required academic fields.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderRes = await fetch("/api/courses/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, batchId }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || "Failed to create order");
      }

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Protoplast Studio",
        description: `${batch.courseType.toUpperCase()} Training Registration`,
        order_id: orderData.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#16a34a", // Green to match site
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/courses/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              toast.success("Registration Successful!");
              setIsSuccess(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Verify Error", err);
            toast.error("An error occurred during verification.");
          }
        },
      };

      // @ts-expect-error Razorpay is added via script tag
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              step >= i ? "bg-black text-white" : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
          </div>
          {i < 4 && (
            <div
              className={`w-12 md:w-24 h-1 mx-2 transition-colors ${
                step > i ? "bg-black" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" async />
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />

        <main className="flex-grow pt-24 pb-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Card */}
            <div className="bg-black rounded-t-3xl overflow-hidden p-8 md:p-12 relative shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">
                  {batch.courseType.toUpperCase()} TRACK
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-medium text-white mb-2 tracking-tight">
                {isSuccess ? "Registration Complete" : "Student Registration"}
              </h1>
              <p className="text-gray-400 text-sm md:text-base font-medium">
                {batch.timing} |{" "}
                {new Date(batch.startDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white border-x border-b border-gray-200 p-8 md:p-12 rounded-b-3xl shadow-2xl">
              {isSuccess ? (
                <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-black mb-4">
                    You&apos;re all set!
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Your registration for the{" "}
                    <strong className="text-black">
                      {batch.courseType.toUpperCase()}
                    </strong>{" "}
                    track is confirmed. We&apos;ve sent a receipt to your email.
                  </p>
                  <Button
                    onClick={() => router.push("/courses")}
                    className="h-14 px-8 rounded-xl bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-widest"
                  >
                    Return to Courses
                  </Button>
                </div>
              ) : (
                <>
                  <StepIndicator />
                  <form
                    onSubmit={
                      step === 4 ? handleSubmit : (e) => e.preventDefault()
                    }
                    className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    {/* Step 1: Personal & Contact */}
                    {step === 1 && (
                      <div className="space-y-8">
                        <div>
                          <h2 className="text-2xl font-medium tracking-tight mb-6">
                            Personal & Contact Info
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <Label>
                                First Name{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                required
                                placeholder="e.g. Rahul"
                                value={formData.firstName}
                                onChange={(e) =>
                                  handleChange("firstName", e.target.value)
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                Last Name{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                required
                                placeholder="e.g. Sharma"
                                value={formData.lastName}
                                onChange={(e) =>
                                  handleChange("lastName", e.target.value)
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <Label>
                                Date of Birth{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="date"
                                required
                                value={formData.dob}
                                onChange={(e) =>
                                  handleChange("dob", e.target.value)
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                Gender <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                onValueChange={(v) => handleChange("gender", v)}
                                value={formData.gender}
                                required
                              >
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer_not">
                                    Prefer not to say
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2 mb-6">
                            <Label>
                              Full Address{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              required
                              placeholder="House No., Street, Colony, City, PIN Code"
                              rows={2}
                              value={formData.fullAddress}
                              onChange={(e) =>
                                handleChange("fullAddress", e.target.value)
                              }
                              className="rounded-xl resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <Label>
                                Mobile Number{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="tel"
                                required
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.mobile}
                                onChange={(e) =>
                                  handleChange("mobile", e.target.value)
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                Email Address{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                  handleChange("email", e.target.value)
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                          <h3 className="text-lg font-medium mb-4">
                            Emergency Contact
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                              <Label>
                                Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                required
                                placeholder="Parent / Guardian name"
                                value={formData.emergencyName}
                                onChange={(e) =>
                                  handleChange("emergencyName", e.target.value)
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                Number <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                type="tel"
                                required
                                placeholder="+91 XXXXX XXXXX"
                                value={formData.emergencyNumber}
                                onChange={(e) =>
                                  handleChange(
                                    "emergencyNumber",
                                    e.target.value,
                                  )
                                }
                                className="h-12 rounded-xl"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>
                                Relationship{" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                onValueChange={(v) =>
                                  handleChange("emergencyRelation", v)
                                }
                                value={formData.emergencyRelation}
                                required
                              >
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  <SelectItem value="Parent">Parent</SelectItem>
                                  <SelectItem value="Guardian">
                                    Guardian
                                  </SelectItem>
                                  <SelectItem value="Sibling">
                                    Sibling
                                  </SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Academic Background */}
                    {step === 2 && (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-medium tracking-tight mb-6">
                          Academic Background
                        </h2>

                        <div className="space-y-2 mb-6">
                          <Label>
                            College / University Name{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            required
                            placeholder="e.g. Government College of Engineering"
                            value={formData.college}
                            onChange={(e) =>
                              handleChange("college", e.target.value)
                            }
                            className="h-12 rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="space-y-2">
                            <Label>
                              Degree / Course{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(v) => handleChange("degree", v)}
                              value={formData.degree}
                              required
                            >
                              <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="B.E. / B.Tech">
                                  B.E. / B.Tech
                                </SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem>
                                <SelectItem value="B.Sc">B.Sc</SelectItem>
                                <SelectItem value="BCA">BCA</SelectItem>
                                <SelectItem value="MCA">MCA</SelectItem>
                                <SelectItem value="M.Tech">M.Tech</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>
                              Branch / Stream{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(v) => handleChange("branch", v)}
                              value={formData.branch}
                              required
                            >
                              <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Computer Science">
                                  Computer Science
                                </SelectItem>
                                <SelectItem value="Information Technology">
                                  Information Technology
                                </SelectItem>
                                <SelectItem value="Electronics & TC">
                                  Electronics & TC
                                </SelectItem>
                                <SelectItem value="Electrical Engineering">
                                  Electrical Engineering
                                </SelectItem>
                                <SelectItem value="Mechanical Engineering">
                                  Mechanical Engineering
                                </SelectItem>
                                <SelectItem value="Civil Engineering">
                                  Civil Engineering
                                </SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>
                              Current Year{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              onValueChange={(v) =>
                                handleChange("currentYear", v)
                              }
                              value={formData.currentYear}
                              required
                            >
                              <SelectTrigger className="h-12 rounded-xl">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="1st Year">
                                  1st Year
                                </SelectItem>
                                <SelectItem value="2nd Year">
                                  2nd Year
                                </SelectItem>
                                <SelectItem value="3rd Year">
                                  3rd Year
                                </SelectItem>
                                <SelectItem value="4th Year">
                                  4th Year
                                </SelectItem>
                                <SelectItem value="Passed Out">
                                  Passed Out
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label>Current CGPA / Percentage</Label>
                            <Input
                              placeholder="e.g. 8.2 CGPA or 75%"
                              value={formData.cgpa}
                              onChange={(e) =>
                                handleChange("cgpa", e.target.value)
                              }
                              className="h-12 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>
                              Graduation Year{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="number"
                              min="2024"
                              max="2030"
                              required
                              placeholder="e.g. 2027"
                              value={formData.graduationYear}
                              onChange={(e) =>
                                handleChange("graduationYear", e.target.value)
                              }
                              className="h-12 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Experience & Motivation */}
                    {step === 3 && (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-medium tracking-tight mb-6">
                          Experience & Motivation
                        </h2>

                        <div className="space-y-4 mb-8">
                          <Label>
                            Prior technical experience{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              {
                                val: "none",
                                label: "None",
                                sub: "Complete beginner",
                              },
                              {
                                val: "basic",
                                label: "Basic",
                                sub: "Some self-learning",
                              },
                              {
                                val: "intermediate",
                                label: "Intermediate",
                                sub: "Projects done",
                              },
                            ].map((opt) => (
                              <div
                                key={opt.val}
                                onClick={() =>
                                  handleChange("priorExperience", opt.val)
                                }
                                className={`p-4 border rounded-xl cursor-pointer transition-colors ${formData.priorExperience === opt.val ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}
                              >
                                <div className="text-sm font-bold text-black">
                                  {opt.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {opt.sub}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 mb-8">
                          <Label>Relevant skills or tools</Label>
                          <Textarea
                            placeholder="e.g. Python, React, etc."
                            rows={2}
                            value={formData.relevantSkills}
                            onChange={(e) =>
                              handleChange("relevantSkills", e.target.value)
                            }
                            className="rounded-xl resize-none"
                          />
                        </div>

                        <div className="space-y-4 mb-8">
                          <Label>
                            Do you own a laptop?{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { val: "yes", label: "Yes, I will bring it" },
                              { val: "no", label: "No, I will need one" },
                            ].map((opt) => (
                              <div
                                key={opt.val}
                                onClick={() =>
                                  handleChange("ownLaptop", opt.val)
                                }
                                className={`p-4 border rounded-xl cursor-pointer transition-colors ${formData.ownLaptop === opt.val ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}
                              >
                                <div className="text-sm font-bold text-black">
                                  {opt.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 mb-6">
                          <Label>
                            How did you hear about this program?{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              handleChange("referralSource", v)
                            }
                            value={formData.referralSource}
                            required
                          >
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="Instagram / Facebook">
                                Instagram / Facebook
                              </SelectItem>
                              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                              <SelectItem value="Friend / Classmate">
                                Friend / Classmate
                              </SelectItem>
                              <SelectItem value="College Notice Board">
                                College Notice Board
                              </SelectItem>
                              <SelectItem value="Professor / Teacher">
                                Professor / Teacher
                              </SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 mb-6">
                          <Label>
                            Why do you want to join?{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            required
                            placeholder="Tell us your motivation..."
                            rows={2}
                            value={formData.motivation}
                            onChange={(e) =>
                              handleChange("motivation", e.target.value)
                            }
                            className="rounded-xl resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Any questions or special requirements?</Label>
                          <Textarea
                            placeholder="Anything you'd like us to know..."
                            rows={2}
                            value={formData.questions}
                            onChange={(e) =>
                              handleChange("questions", e.target.value)
                            }
                            className="rounded-xl resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 4: Review & Payment */}
                    {step === 4 && (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-medium tracking-tight mb-6">
                          Review & Payment
                        </h2>

                        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 mb-8">
                          <h3 className="font-bold text-black mb-2">
                            Program Fee: ₹{batch.price || 4999}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Payment will be processed securely via Razorpay upon
                            form submission to confirm your seat immediately in
                            the{" "}
                            <strong>{batch.courseType.toUpperCase()}</strong>{" "}
                            batch.
                          </p>
                        </div>

                        <label className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 rounded text-green-600 focus:ring-green-600 accent-green-600"
                            checked={formData.consent}
                            onChange={(e) =>
                              handleChange("consent", e.target.checked)
                            }
                          />
                          <span className="text-sm text-gray-600 leading-relaxed">
                            I confirm that all the information provided above is
                            accurate. I understand that{" "}
                            <strong className="text-black">
                              seats are strictly limited
                            </strong>{" "}
                            and my registration is subject to successful payment
                            of{" "}
                            <strong className="text-black">
                              ₹{batch.price || 4999}
                            </strong>
                            .
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                      {step > 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="h-12 px-6 rounded-xl"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                      ) : (
                        <div></div> // Empty div for flex spacing
                      )}

                      {step < 4 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="h-12 px-8 rounded-xl bg-black text-white hover:bg-gray-800"
                        >
                          Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.consent}
                          className="h-14 px-8 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-green-600/20"
                        >
                          {isSubmitting ? "Processing..." : "Pay & Register →"}
                        </Button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
