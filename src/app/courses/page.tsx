"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Clock, Calendar } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/pages/footer";
import { getActiveBatch } from "@/actions/courses";

export default function CoursesLandingPage() {
  const router = useRouter();
  const [hardwareBatch, setHardwareBatch] = useState<any>(null);
  const [softwareBatch, setSoftwareBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBatches() {
      try {
        const hw = await getActiveBatch("hardware");
        const sw = await getActiveBatch("software");
        setHardwareBatch(hw);
        setSoftwareBatch(sw);
      } catch (error) {
        console.error("Failed to fetch batches", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBatches();
  }, []);

  const renderCourseCard = (
    title: string,
    type: "hardware" | "software",
    batch: any,
    features: string[],
    image: string
  ) => {
    const isFull = batch ? batch.currentRegistrations >= batch.maxSeats : false;
    const isAvailable = !!batch && !isFull && batch.status === "active";

    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-black/5 flex flex-col transition-all hover:shadow-2xl hover:shadow-black/10">
        <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center">
           {/* Placeholder for Course Illustration */}
           <div className="text-gray-300 font-bold uppercase tracking-widest">{type} Track</div>
        </div>
        
        <div className="flex justify-between items-start mb-4">
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-full px-4 py-1">
            {type.toUpperCase()}
          </Badge>
          {isFull && <Badge variant="destructive" className="rounded-full">BATCH FULL</Badge>}
        </div>

        <h3 className="text-3xl font-bold text-black tracking-tight mb-2">{title}</h3>
        
        <div className="space-y-3 mb-8 flex-grow mt-4">
          {batch ? (
            <>
              <div className="flex items-center text-gray-600 gap-3 text-sm">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium">{batch.timing}</span>
              </div>
              <div className="flex items-center text-gray-600 gap-3 text-sm">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="font-medium">
                  {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600 gap-3 text-sm">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium">
                  {batch.maxSeats - batch.currentRegistrations} seats remaining
                </span>
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic text-sm py-4">No active batches available currently.</div>
          )}
        </div>

        <ul className="space-y-2 mb-8">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              {f}
            </li>
          ))}
        </ul>

        <Button
          disabled={!isAvailable}
          onClick={() => router.push(`/courses/${batch._id}/register`)}
          className="w-full h-14 rounded-2xl bg-black text-white hover:bg-green-600 transition-all group font-bold tracking-widest uppercase"
        >
          {isAvailable ? (
            <>
              Register Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          ) : isFull ? (
            "Registration Closed"
          ) : (
            "Currently Unavailable"
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-medium text-black tracking-tight mb-4">
              Industrial <span className="text-green-600">Training</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
              Join our 30-Day Hands-On Industrial Training Programs and master the skills needed to build production-ready systems.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {renderCourseCard(
                "Hardware Engineering",
                "hardware",
                hardwareBatch,
                [
                  "3D Printing & Physical Prototyping",
                  "PCB Design & Manufacturing",
                  "2-Year Fusion 360 License",
                  "Verified Training Certificate",
                ],
                "/hw-course.jpg"
              )}
              {renderCourseCard(
                "Software Architecture",
                "software",
                softwareBatch,
                [
                  "Full-Stack System Architecture",
                  "Live Backend & Database Deployment",
                  "Production-Ready GitHub Portfolio",
                  "Verified Training Certificate",
                ],
                "/sw-course.jpg"
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
