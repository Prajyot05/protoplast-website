export const serviceDetails = {
  "3d-printing": {
    title: "3D Printing",
    description:
      "At Protoplast.3D, we specialize in high-precision 3D printing services, offering FDM and SLA printing technologies to cater to a wide range of industries. Whether you need functional prototypes, custom components, architectural models, or production-grade parts, our advanced printing techniques ensure exceptional quality and accuracy.",
    sections: [
      {
        title: "Materials Available:",
        items: [
          "<b>PLA, ABS, PETG</b> – Ideal for strong, lightweight, and functional parts.",
          "<b>Resin Printing (SLA/DLP)</b> – Perfect for highly detailed, smooth-finish components.",
        ],
      },
      {
        title: "Applications:",
        items: [
          "Product Prototyping – Validate designs before mass production.",
          "Automotive & Aerospace – Lightweight and strong components for specialized applications.",
          "Medical & Healthcare – Custom prosthetics, surgical guides, and medical models.",
          "Consumer Goods – Customized accessories, tools, and home decor.",
        ],
      },
    ],
  },
  "cnc-cutting": {
    title: "CNC Cutting & Machining",
    description:
      "Our CNC cutting and machining services provide high-precision fabrication for various materials, including metals, plastics, acrylics, and wood. Using advanced CNC machines, we guarantee clean cuts, fine detailing, and excellent repeatability, making it ideal for custom components, signage, and industrial applications.",
    sections: [
      {
        title: "Capabilities:",
        items: [
          "<b>2D & 3D CNC Machining</b> – For custom industrial and mechanical parts.",
          "<b>Laser Cutting & Engraving</b> – For detailed markings and precision cutting.",
          "<b>Milling & Routing</b> – High-accuracy shaping for metal, wood, and acrylic components.",
        ],
      },
      {
        title: "Applications:",
        items: [
          "Industrial & Mechanical Parts – Customized and batch-manufactured machine parts.",
          "Architectural & Interior Designs – CNC-cut panels, engravings, and decorative elements.",
          "Signage & Branding – Custom-designed acrylic and metal signboards.",
        ],
      },
    ],
  },
  "cad-modeling": {
    title: "CAD Modeling",
    description:
      "At Protoplast.3D, we provide professional 3D CAD modeling services that help businesses visualize, refine, and optimize their designs before manufacturing. Our expert designers create highly detailed and production-ready 3D models for engineering, product design, and architectural projects.",
    sections: [
      {
        title: "Services We Offer:",
        items: [
          "<b>3D Product Design & Prototyping</b> – Converting concepts into manufacturable designs.",
          "<b>Mechanical CAD Modeling</b> – Precision-driven designs for industrial applications.",
          "<b>Architectural CAD Services</b> – 3D modeling for buildings, interiors, and landscapes.",
        ],
      },
      {
        title: "Industries Served:",
        items: [
          "Manufacturing & Engineering – Custom-designed components and machinery parts.",
          "Consumer Electronics & Appliances – 3D models optimized for production.",
          "Architecture & Construction – Visualization and rendering for real estate projects.",
        ],
      },
    ],
  },
  "pcb-design": {
    title: "PCB Designing & Manufacturing",
    description:
      "We provide custom PCB design and manufacturing services, ensuring high-quality and optimized circuit board solutions for industries such as electronics, robotics, IoT, and automation. Our team specializes in designing single-layer, multi-layer, and flexible PCBs for various applications.",
    sections: [
      {
        title: "Services Offered:",
        items: [
          "<b>Schematic Design & Circuit Layout</b> – Optimized PCB designs for performance and manufacturability.",
          "<b>Prototype & Batch Production</b> – Small-run and large-scale PCB manufacturing.",
          "<b>Component Sourcing & Assembly</b> – High-quality components for durable and reliable circuits.",
        ],
      },
      {
        title: "Industries Served:",
        items: [
          "Embedded Systems & IoT Devices – Custom PCB designs for smart electronics.",
          "Industrial Automation – High-performance circuit boards for automation systems.",
          "Medical & Automotive Electronics – Precision-engineered PCBs for specialized applications.",
        ],
      },
    ],
  },
  "rapid-prototyping": {
    title: "Rapid Prototyping",
    description:
      "Innovation requires fast iteration and testing, and our rapid prototyping services enable businesses to bring their ideas to life quickly and efficiently. Using a combination of 3D printing, CNC machining, and PCB fabrication, we provide prototypes that allow for real-world testing before mass production.",
    sections: [
      {
        title: "Why Choose Our Rapid Prototyping Services?",
        items: [
          "✔ Accelerate Product Development – Reduce time-to-market with quick iterations.",
          "✔ Cost-Effective – Test and refine designs without high production costs.",
          "✔ Multiple Manufacturing Methods – Choose from 3D printing, CNC, or PCB prototyping.",
        ],
      },
    ],
  },
}

export const pricingDetails = {
  "3d-printing": {
    title: "FDM 3D Printing Pricing",
    description:
      "Our FDM 3D printing services offer high-quality, cost-effective solutions for a wide range of applications.",
    sections: [
      {
        title: "Material Pricing (Per Gram)",
        table: {
          headers: ["Material", "Price Range", "Best For"],
          rows: [
            ["PLA", "₹3 - ₹5", "Prototypes, decorative items, educational models"],
            ["ABS", "₹4 - ₹6", "Functional parts, automotive components, durable goods"],
            ["PETG", "₹4 - ₹7", "Food-safe applications, mechanical parts, clear components"],
            ["TPU (Flexible)", "₹5 - ₹8", "Flexible parts, phone cases, seals, grips"],
          ],
        },
      },
      {
        title: "Additional Factors Affecting Price:",
        items: [
          "<b>Infill Density:</b> Higher infill increases material usage and strength.",
          "<b>Print Quality:</b> Higher resolution requires more time and precision.",
          "<b>Support Material:</b> Complex geometries requiring supports add to material cost.",
          "<b>Quantity:</b> Bulk orders receive discounted rates.",
        ],
      },
    ],
  },
  "cnc-cutting": {
    title: "CNC Cutting Pricing",
    description:
      "Our precision CNC cutting services deliver high-quality results for various materials and applications.",
    sections: [
      {
        title: "Material Pricing (Per cm³)",
        table: {
          headers: ["Material", "Price Range", "Thickness Range"],
          rows: [
            ["Acrylic", "₹15 - ₹25", "1mm - 20mm"],
            ["Wood", "₹12 - ₹20", "3mm - 25mm"],
            ["Aluminum", "₹30 - ₹50", "0.5mm - 12mm"],
            ["Steel", "₹40 - ₹70", "0.5mm - 10mm"],
          ],
        },
      },
      {
        title: "Additional Services:",
        items: [
          "<b>Custom Engraving:</b> ₹8 - ₹15 per cm²",
          "<b>Design Assistance:</b> ₹500 - ₹2,000 based on complexity",
          "<b>Edge Finishing:</b> ₹5 - ₹10 per linear cm",
          "<b>Rush Orders:</b> +30% for 24-hour turnaround",
        ],
      },
    ],
  },
  "cad-modeling": {
    title: "CAD Modeling Pricing",
    description:
      "Our professional CAD modeling services transform your concepts into precise, production-ready 3D models.",
    sections: [
      {
        title: "Service Tiers",
        table: {
          headers: ["Service Level", "Price Range", "Description"],
          rows: [
            ["Basic Design", "₹500 - ₹1,500", "Simple objects, basic modifications, single-part designs"],
            ["Standard Design", "₹1,500 - ₹3,000", "Multi-part assemblies, moderate complexity, engineering drawings"],
            ["Complex Design", "₹3,000 - ₹5,000", "Advanced assemblies, complex surfaces, full documentation"],
            [
              "Expert Design",
              "₹5,000+",
              "Highly specialized designs, simulation-ready models, production specifications",
            ],
          ],
        },
      },
      {
        title: "Additional Services:",
        items: [
          "<b>2D Drawings:</b> ₹300 - ₹800 per drawing",
          "<b>Photo-realistic Rendering:</b> ₹800 - ₹2,000 per view",
          "<b>Design Revisions:</b> First two revisions free, then ₹300 per revision",
          "<b>Design Consultation:</b> ₹500 per hour",
        ],
      },
    ],
  },
  "pcb-design": {
    title: "PCB Design & Manufacturing Pricing",
    description:
      "Our PCB design and manufacturing services provide professional circuit layouts optimized for manufacturability and performance.",
    sections: [
      {
        title: "Design Services",
        table: {
          headers: ["Service", "Price Range", "Description"],
          rows: [
            ["Schematic Design", "₹500 - ₹2,000", "Circuit design, component selection, documentation"],
            ["PCB Layout", "₹1,000 - ₹5,000", "Based on board size, layer count, and component density"],
            ["Full Design Package", "₹1,500 - ₹7,000", "Schematic + Layout + Production files + BOM"],
          ],
        },
      },
      {
        title: "Manufacturing Services (Per PCB)",
        table: {
          headers: ["Type", "Price Range", "Minimum Order"],
          rows: [
            ["Prototype (Single/Double Layer)", "₹500 - ₹1,500", "3 pieces"],
            ["Small Batch (Single/Double Layer)", "₹300 - ₹800", "10 pieces"],
            ["Medium Batch (Single/Double Layer)", "₹200 - ₹500", "50 pieces"],
            ["Multilayer (4+ layers)", "₹800 - ₹3,000", "5 pieces"],
          ],
        },
      },
      {
        title: "Additional Services:",
        items: [
          "<b>Component Sourcing:</b> Cost + 15% handling fee",
          "<b>SMT Assembly:</b> ₹5 - ₹15 per component placement",
          "<b>Through-Hole Assembly:</b> ₹8 - ₹20 per component",
          "<b>Testing & Validation:</b> ₹300 - ₹1,000 per board type",
        ],
      },
    ],
  },
}
