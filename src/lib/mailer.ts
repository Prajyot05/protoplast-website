import nodemailer from "nodemailer";

export async function sendRegistrationEmail(registration: any, batch: any) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("EMAIL_USER or EMAIL_PASS is not defined in environment variables.");
    return { success: false, error: "Missing email credentials" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail", // Assuming Gmail for protoplaststudio@gmail.com
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `"Protoplast Studio" <${user}>`,
    to: "protoplaststudio@gmail.com", // Send to admin
    subject: `New Course Registration: ${registration.firstName} ${registration.lastName}`,
    html: `
      <h2>New Course Registration Alert!</h2>
      <p>A new student has successfully registered and paid for a course.</p>
      
      <h3>Batch Details</h3>
      <ul>
        <li><strong>Course Type:</strong> ${batch.courseType.toUpperCase()}</li>
        <li><strong>Timing:</strong> ${batch.timing}</li>
        <li><strong>Start Date:</strong> ${new Date(batch.startDate).toLocaleDateString()}</li>
      </ul>

      <h3>Student Details</h3>
      <ul>
        <li><strong>Name:</strong> ${registration.firstName} ${registration.lastName}</li>
        <li><strong>Email:</strong> ${registration.email}</li>
        <li><strong>Mobile:</strong> ${registration.mobile}</li>
        <li><strong>DOB:</strong> ${registration.dob}</li>
        <li><strong>Gender:</strong> ${registration.gender}</li>
        <li><strong>Address:</strong> ${registration.fullAddress}</li>
      </ul>

      <h3>Academic Details</h3>
      <ul>
        <li><strong>College:</strong> ${registration.college}</li>
        <li><strong>Degree:</strong> ${registration.degree} (${registration.branch})</li>
        <li><strong>Current Year:</strong> ${registration.currentYear}</li>
        <li><strong>CGPA/Percentage:</strong> ${registration.cgpa || "N/A"}</li>
        <li><strong>Graduation Year:</strong> ${registration.graduationYear}</li>
      </ul>

      <h3>Emergency Contact</h3>
      <ul>
        <li><strong>Name:</strong> ${registration.emergencyName} (${registration.emergencyRelation})</li>
        <li><strong>Number:</strong> ${registration.emergencyNumber}</li>
      </ul>

      <h3>Experience & Motivation</h3>
      <ul>
        <li><strong>Prior Experience:</strong> ${registration.priorExperience}</li>
        <li><strong>Relevant Skills:</strong> ${registration.relevantSkills || "None"}</li>
        <li><strong>Own Laptop:</strong> ${registration.ownLaptop}</li>
        <li><strong>Referral Source:</strong> ${registration.referralSource}</li>
        <li><strong>Motivation:</strong> ${registration.motivation}</li>
        <li><strong>Questions:</strong> ${registration.questions || "None"}</li>
      </ul>

      <h3>Payment Info</h3>
      <ul>
        <li><strong>Amount Paid:</strong> ₹${registration.amount}</li>
        <li><strong>Razorpay Order ID:</strong> ${registration.paymentIntentId}</li>
      </ul>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
