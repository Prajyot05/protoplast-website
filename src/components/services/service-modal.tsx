import { X } from "lucide-react";
import { serviceDetails, pricingDetails } from "@/lib/service-data";
import { ServiceKey } from "@/types/service";
import { DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface Section {
  title: string;
  content?: string;
  items?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

interface ServiceData {
  title: string;
  description: string;
  sections?: Section[];
}

interface ServiceModalProps {
  serviceId: ServiceKey;
  isPricing: boolean;
  onClose: () => void;
}

export default function ServiceModal({
  serviceId,
  isPricing,
  onClose,
}: ServiceModalProps) {
  const data: ServiceData | undefined = isPricing
    ? pricingDetails[serviceId]
    : serviceDetails[serviceId];

  if (!data) return null;
  console.log("service modal");

  return (
    <motion.div
      key="modal"
      className="relative bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-green-400/20"
    >
      {/* Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-green-400 transition-all duration-300"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Content */}
      <div className="p-8">
        <DialogTitle className="text-3xl font-bold text-green-400 mb-6 border-b border-green-400/30 pb-4">
          {data.title}
        </DialogTitle>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {data.description}
          </p>

          {data.sections?.map((section, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                {section.title}
              </h3>
              {section.content && (
                <p className="text-gray-300 leading-relaxed mb-4">
                  {section.content}
                </p>
              )}
              {section.items && (
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start text-gray-300"
                    >
                      <span className="text-green-400 mr-3 mt-1">✓</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full border-collapse border border-green-400/30 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-green-400/10">
                        {section.table.headers.map((header, headerIndex) => (
                          <th
                            key={headerIndex}
                            className="border border-green-400/30 px-4 py-3 text-left text-green-300 font-semibold"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={
                            rowIndex % 2 === 0
                              ? "bg-gray-800/30"
                              : "bg-gray-800/50"
                          }
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="border border-green-400/30 px-4 py-3 text-gray-300"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
