import { X } from "lucide-react";
import { serviceDetails, pricingDetails } from "@/lib/service-data";
import { ServiceKey } from "@/types/service";
import { DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

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

  return (
    <div className="relative bg-white w-full flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Close Button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-none flex items-center justify-center text-gray-600 hover:text-white hover:bg-black transition-all duration-300"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain">
        {/* Content */}
        <div className="p-6 sm:p-8">
          <DialogTitle className="text-2xl font-medium text-black mb-6 border-b border-gray-200 pb-4">
            {data.title}
          </DialogTitle>

          <div className="max-w-none">
            <p className="text-gray-600 leading-relaxed mb-8">
              {data.description}
            </p>

            {data.sections?.map((section, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-medium text-black mb-4 border-l-2 border-green-500 pl-4">
                  {section.title}
                </h3>
                {section.content && (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {section.content}
                  </p>
                )}
                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start text-gray-600"
                      >
                        <span className="text-green-600 mr-3 mt-0.5">✓</span>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                )}
                {section.table && (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          {section.table.headers.map((header, headerIndex) => (
                            <th
                              key={headerIndex}
                              className="border border-gray-200 px-4 py-3 text-left text-black font-medium text-sm"
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
                            className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className="border border-gray-200 px-4 py-3 text-gray-600 text-sm"
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
      </div>
    </div>
  );
}
