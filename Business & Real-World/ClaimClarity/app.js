const claimSteps = [
  "Submitted",
  "Under Review",
  "Estimate Prepared",
  "Approved",
  "Payment Sent",
];

const statusCopy = {
  Submitted: {
    description:
      "We received your claim details and created your file. We're getting everything lined up for review.",
    nextTitle: "Under Review",
    nextDescription:
      "A claims specialist will double-check your information and documents to make sure we have what we need.",
  },
  "Under Review": {
    description:
      "Our team is reviewing your claim details and documents. This usually takes 1–3 business days.",
    nextTitle: "Estimate Prepared",
    nextDescription:
      "We’ll prepare an estimate of the damage and check your coverage so you know what to expect.",
  },
  "Estimate Prepared": {
    description:
      "We’ve prepared an estimate of the damage and are finalizing coverage details.",
    nextTitle: "Approval decision",
    nextDescription:
      "We’ll confirm whether the claim is approved. If so, we’ll move straight to payment.",
  },
  Approved: {
    description:
      "Great news! Your claim is approved. We’re issuing payment and wrapping up the final paperwork.",
    nextTitle: "Payment Sent",
    nextDescription:
      "We’ll send payment using your preferred method. You’ll receive a confirmation once it’s on the way.",
  },
  Denied: {
    description:
      "We reviewed the claim and weren’t able to approve it based on the policy details. We’ll share the reasons clearly.",
    nextTitle: "Talk with us",
    nextDescription:
      "If anything seems off, reply with your questions and we’ll review together.",
  },
  "Payment Sent": {
    description:
      "Payment has been sent. You should see it in your account within 1–3 business days.",
    nextTitle: "You’re all set",
    nextDescription:
      "If you have questions about the amount or timing, let us know and we’ll help.",
  },
};

const sampleClaims = [
  {
    claimNumber: "CL-1024",
    customerLastName: "Johnson",
    claimType: "Auto",
    incidentDate: "2024-03-22",
    currentStatus: "Under Review",
    statusHistory: ["Submitted", "Under Review"],
    requiredDocuments: [
      { documentName: "Accident photos", status: "received" },
      { documentName: "Police report", status: "missing" },
      { documentName: "Repair shop contact", status: "received" },
    ],
    questions: [
      "Will a rental car be covered while I wait?",
    ],
  },
  {
    claimNumber: "CL-2033",
    customerLastName: "Patel",
    claimType: "Home",
    incidentDate: "2024-04-08",
    currentStatus: "Estimate Prepared",
    statusHistory: ["Submitted", "Under Review", "Estimate Prepared"],
    requiredDocuments: [
      { documentName: "Photos of damage", status: "received" },
      { documentName: "Contractor estimate", status: "missing" },
    ],
    questions: [],
  },
  {
    claimNumber: "CL-3177",
    customerLastName: "Garcia",
    claimType: "Auto",
    incidentDate: "2024-02-10",
    currentStatus: "Payment Sent",
    statusHistory: ["Submitted", "Under Review", "Estimate Prepared", "Approved", "Payment Sent"],
    requiredDocuments: [
      { documentName: "Accident photos", status: "received" },
      { documentName: "Repair invoice", status: "received" },
    ],
    questions: [
      "Can I change the payment method to direct deposit?",
      "When should I expect the deposit to clear?",
    ],
  },
];

const lookupForm = document.getElementById("lookup-form");
const messageEl = document.getElementById("lookup-message");
const claimArea = document.getElementById("claim-area");
let activeClaim = null;

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const claimNumber = event.target.claimNumber.value.trim();
  const lastName = event.target.lastName.value.trim();

  const claim = findClaim(claimNumber, lastName);

  if (!claim) {
    messageEl.textContent = "We couldn’t find that claim. Double-check the number and last name.";
    claimArea.classList.add("hidden");
    return;
  }

  messageEl.textContent = "";
  activeClaim = claim;
  renderClaim(claim);
  claimArea.classList.remove("hidden");
});

function findClaim(claimNumber, lastName) {
  return sampleClaims.find(
    (claim) =>
      claim.claimNumber.toLowerCase() === claimNumber.toLowerCase() &&
      claim.customerLastName.toLowerCase() === lastName.toLowerCase()
  );
}

function renderClaim(claim) {
  document.getElementById("claim-type").textContent = `${claim.claimType} claim`;
  document.getElementById("claim-number").textContent = `Claim #${claim.claimNumber}`;
  document.getElementById("incident-date").textContent = `Incident date: ${formatDate(claim.incidentDate)}`;
  document.getElementById("status-explainer").textContent =
    "We keep you posted in plain language, with next steps prepped.";
  document.getElementById("current-status").textContent = claim.currentStatus;

  renderTimeline(claim);
  renderCurrentStep(claim);
  renderDocuments(claim);
  renderQuestions(claim);
  renderProgress(claim);
}

function renderTimeline(claim) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  const steps = claim.currentStatus === "Denied" ? [...claimSteps.slice(0, 3), "Denied"] : claimSteps;

  steps.forEach((step, index) => {
    const li = document.createElement("li");
    const completed = claim.statusHistory.includes(step);
    const isActive = claim.currentStatus === step;

    if (completed && !isActive) li.classList.add("completed");
    if (isActive) li.classList.add("active");
    if (!completed && !isActive) li.classList.add("upcoming");

    const statusClass = completed ? "done" : isActive ? "focus" : "waiting";
    li.innerHTML = `
      <div class="step-top">
        <span class="step-title">${index + 1}. ${step}</span>
        <span class="step-status ${statusClass}">${
          completed ? "Completed" : isActive ? "In progress" : "Queued"
        }</span>
      </div>
      <p class="muted">${statusCopy[step]?.description || "Step waiting to start."}</p>
    `;

    timeline.appendChild(li);
  });
}

function renderCurrentStep(claim) {
  const copy = statusCopy[claim.currentStatus] || statusCopy.Submitted;

  document.getElementById("current-step-title").textContent = claim.currentStatus;
  document.getElementById("current-step-description").textContent = copy.description;
  document.getElementById("next-step-title").textContent = copy.nextTitle;
  document.getElementById("next-step-description").textContent = copy.nextDescription;
}

function renderDocuments(claim) {
  const list = document.getElementById("documents-list");
  list.innerHTML = "";

  const missing = claim.requiredDocuments.filter((doc) => doc.status === "missing");
  const heading = document.getElementById("documents-heading");
  const subtext = document.getElementById("documents-subtext");
  const glance = document.getElementById("required-documents");

  if (missing.length === 0) {
    heading.textContent = "You’re all set";
    subtext.textContent = "You’ve provided everything we need right now. Thank you!";
    glance.innerHTML = `<strong>Documents</strong><p class="muted">Everything received.</p>`;
  } else {
    heading.textContent = "We’re waiting on a few items";
    subtext.textContent = "Add these to keep things moving quickly.";
    glance.innerHTML = `<strong>Documents</strong><p class="muted">${missing.length} item${
      missing.length > 1 ? "s" : ""
    } still needed.</p>`;
  }

  claim.requiredDocuments.forEach((doc) => {
    const item = document.createElement("li");
    item.classList.add("document-item");
    item.innerHTML = `
      <span class="status ${doc.status}">${doc.status === "received" ? "Received" : "Missing"}</span>
      <div>
        <strong>${doc.documentName}</strong>
        <p class="muted">${doc.status === "received" ? "Thanks for sending this." : "Upload or email this when you can."}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function renderProgress(claim) {
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const progressCount = document.getElementById("progress-count");

  const totalSteps = claim.currentStatus === "Denied" ? 4 : claimSteps.length;
  const completedSteps = Math.min(claim.statusHistory.length, totalSteps);
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${percentage}% complete`;
  progressCount.textContent = `${completedSteps} / ${totalSteps} steps`;
}

function renderQuestions(claim) {
  const area = document.getElementById("questions-area");
  area.innerHTML = "";

  if (!claim.questions || claim.questions.length === 0) {
    area.innerHTML = '<p class="muted">You haven’t asked any questions yet.</p>';
    return;
  }

  claim.questions.forEach((question, index) => {
    const item = document.createElement("div");
    item.classList.add("question-item");
    item.innerHTML = `<strong>Question ${index + 1}</strong><p>${question}</p>`;
    area.appendChild(item);
  });
}

const questionForm = document.getElementById("question-form");
questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!activeClaim) return;

  const questionInput = event.target.question;
  const text = questionInput.value.trim();
  if (!text) return;

  activeClaim.questions.push(text);
  questionInput.value = "";
  renderQuestions(activeClaim);
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
