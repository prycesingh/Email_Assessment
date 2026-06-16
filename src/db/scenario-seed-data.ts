import type { CategoryScores } from "@/db/schema";

export const defaultRubricWeights: CategoryScores = {
  professionalTone: 20,
  grammarLanguage: 20,
  clarityEmpathyRespect: 30,
  structure: 15,
  completeness: 15
};

export const scenarioSeedData = [
  {
    title: "Planned Vacation Leave Request",
    difficulty: "beginner",
    category: "Leave Request",
    prompt:
      "You are a Level 1 Help Desk Technician at IT By Design. You want to take 5 days of paid leave from December 23–27 for the holidays. Write an email to your direct manager, Sarah Thompson, requesting approval. You have no open P1 tickets and your backup coverage is your colleague James.",
    scoringNotes:
      "Look for a respectful PTO request, exact dates, current ticket status, coverage plan, and proactive handover details."
  },
  {
    title: "Follow-Up on Unresolved Ticket",
    difficulty: "beginner",
    category: "Follow-Up",
    prompt:
      "A client, Melissa Grant, Ops Manager at Greenfield Financial, opened a ticket 3 days ago about a printer not working. No technician has updated it. You are Level 1 and want to follow up with your team lead to get the ticket moving. Write an internal email.",
    scoringNotes:
      "Look for ticket context, client impact, SLA awareness, constructive tone, and a clear action request."
  },
  {
    title: "Ticket Resolved Client Notification",
    difficulty: "beginner",
    category: "Status Update",
    prompt:
      "You are a Level 1 technician. You've just resolved a ticket for David Chen at Lakeside Dental. His issue was a locked Active Directory account. Ticket #TKT-4456. Write an email to inform him the issue has been resolved.",
    scoringNotes:
      "Look for a clear resolution summary, ticket number, what was fixed, next-step guidance, and a warm closing."
  },
  {
    title: "New Client Onboarding Introduction",
    difficulty: "beginner",
    category: "Introduction",
    prompt:
      "IT By Design has just onboarded a new client, Horizon Realty Group. You are the assigned account coordinator. Write a welcome email to Rachel Simmons, the IT Manager at Horizon, introducing yourself and outlining next steps for onboarding.",
    scoringNotes:
      "Look for a warm welcome, role clarity, concrete onboarding milestones, timeline, contact path, and proactive support."
  },
  {
    title: "End-of-Day Shift Handover",
    difficulty: "beginner",
    category: "Internal Update",
    prompt:
      "You are finishing your 8-hour help desk shift. You need to send a handover email to the incoming night shift team lead, Brian, summarizing open tickets, priority items, and any client sensitivities. You have 3 open tickets: TKT-9901 (P2, client waiting), TKT-9845 (P3, parts on order), and TKT-9888 (P4, informational).",
    scoringNotes:
      "Look for prioritized ticket details, current status, next actions, client sensitivities, and a clear handover structure."
  },
  {
    title: "Partial Outage Client Notification",
    difficulty: "intermediate",
    category: "Incident Communication",
    prompt:
      "IT By Design manages the network for ClearPath Insurance. At 9:15 AM, their VPN service went down, impacting 40 remote users. Your team is investigating. Write an incident notification email to the client's IT Manager, Karen Reyes.",
    scoringNotes:
      "Look for incident scope, current status, impact, actions taken, next update time, empathy, and escalation path."
  },
  {
    title: "Ticket Escalation to Tier 2",
    difficulty: "intermediate",
    category: "Escalation",
    prompt:
      "You are a Level 1 technician at IT By Design. Ticket TKT-7723 for client Nexus Architecture has been open for 4 hours. The issue is that AutoCAD is crashing on a specific workstation. You've exhausted your Tier 1 troubleshooting checklist. Escalate this to Tier 2 via internal email to engineer Mike Patel.",
    scoringNotes:
      "Look for a complete troubleshooting handoff, ticket number, client urgency, known findings, suspected cause, and requested action."
  },
  {
    title: "Monthly IT Report to Client Stakeholder",
    difficulty: "intermediate",
    category: "Stakeholder Update",
    prompt:
      "Write a monthly IT summary email to the COO of Redwood Law Firm, Patricia Holloway, covering October. Key metrics: 98.2% uptime, 47 tickets resolved with average resolution of 3.2 hours, 2 SLA misses, both P3, and one security patch deployment completed successfully.",
    scoringNotes:
      "Look for executive-ready formatting, transparent metric context, accountability for SLA misses, security summary, and forward-looking next steps."
  },
  {
    title: "Scheduled Maintenance Notification",
    difficulty: "intermediate",
    category: "Change Request",
    prompt:
      "IT By Design will perform a firewall firmware upgrade for client Coastal Pediatrics on Saturday, November 9, from 12:00 AM to 3:00 AM. There will be a 30-minute complete network outage. Write a maintenance notification email to Office Manager Linda Torres.",
    scoringNotes:
      "Look for maintenance window, expected impact, business reason, preparation guidance, support contact, and clear timing."
  },
  {
    title: "Responding to a Client Complaint",
    difficulty: "intermediate",
    category: "Complaint Response",
    prompt:
      "A client, Robert Chen at Summit Accounting, sent an angry email: 'Our server has been down for 6 hours, your team has done nothing, and we're losing money. This is unacceptable.' Write a professional response email acknowledging the complaint and outlining your response plan.",
    scoringNotes:
      "Look for empathy without defensiveness, ownership, immediate action plan, escalation, next update timing, and calm professional tone."
  },
  {
    title: "RMA Request to Hardware Vendor",
    difficulty: "intermediate",
    category: "Vendor Communication",
    prompt:
      "A server delivered to IT By Design for client Elmwood Hospital is DOA, Dead on Arrival. Serial: SRV-X992. Purchased from TechVault Supplies. Write an email to the vendor's support team requesting an RMA.",
    scoringNotes:
      "Look for serial number, DOA description, purchase/vendor context, requested RMA action, urgency, and supporting documentation offer."
  },
  {
    title: "Phishing Awareness Alert to Client Users",
    difficulty: "intermediate",
    category: "User Training",
    prompt:
      "IT By Design's security team has identified a targeted phishing campaign against professional services firms. Write a security awareness email to send to all users of client Sterling Consulting, warning them and giving actionable guidance.",
    scoringNotes:
      "Look for plain-language risk explanation, concrete red flags, what users should do, what not to do, and escalation/reporting path."
  },
  {
    title: "QBR Summary Email to Client CEO",
    difficulty: "advanced",
    category: "Executive Communication",
    prompt:
      "You just completed a Quarterly Business Review with the CEO of a key client, Vertex Manufacturing, which has 500 users. Attendees included CEO Mark Alvarez, CFO Susan Park, IT Director Raj Mehta, and your Account Director. Write a follow-up summary email to Mark after the meeting.",
    scoringNotes:
      "Look for executive brevity, strategic outcomes, decisions, agreed next steps, owners, timelines, and relationship-building tone."
  },
  {
    title: "Project Delay Communication to Client",
    difficulty: "advanced",
    category: "Delay Notification",
    prompt:
      "IT By Design is deploying Microsoft 365 for Brightside Schools, which has 1,200 users. The go-live was scheduled for Monday, but a licensing provisioning issue with Microsoft has pushed it back by 5 business days. Write an email to the project sponsor, Superintendent Dr. Angela Foster.",
    scoringNotes:
      "Look for transparent delay communication, ownership, revised timeline, impact mitigation, vendor dependency context, and stakeholder reassurance."
  },
  {
    title: "P1 Critical Outage Executive Escalation",
    difficulty: "advanced",
    category: "Critical Outage",
    prompt:
      "At 2:30 AM, a ransomware attack is detected on the network of Clearwater Bank, an IT By Design client. Three file servers are encrypted. You are the on-call NOC manager. Write an immediate escalation email to both the client's CTO and IT By Design's VP of Operations.",
    scoringNotes:
      "Look for urgent escalation, concise known facts, containment steps, executive recipients, incident severity, next update cadence, and no speculation."
  },
  {
    title: "Contract Renewal Proposal Email",
    difficulty: "advanced",
    category: "Contract Renewal",
    prompt:
      "IT By Design's 3-year managed services contract with Pacific Northwest Logistics, which has 200 users, expires in 60 days. Write a renewal proposal email to their VP of Operations, Thomas Burke, highlighting value delivered and proposing an upgraded service tier.",
    scoringNotes:
      "Look for business value, relationship history, renewal timing, upgraded tier rationale, clear call to action, and professional commercial tone."
  },
  {
    title: "Business Impact Analysis to Client Board",
    difficulty: "advanced",
    category: "Executive Communication",
    prompt:
      "Following a major outage at Pinnacle Insurance that lasted 4 hours during business hours, the client's board has requested a formal Business Impact Analysis. Write an executive email to the board chair, Margaret Wren, summarizing findings.",
    scoringNotes:
      "Look for board-level clarity, factual impact, root-cause summary, remediation plan, risk reduction, and confident executive tone."
  },
  {
    title: "Employee Performance Feedback",
    difficulty: "intermediate",
    category: "Internal HR",
    prompt:
      "You are a Team Lead at IT By Design. One of your technicians, Alex, has been consistently missing ticket SLA targets for 3 weeks, with a 72% hit rate versus a 90% target. Write a private, constructive feedback email to Alex before scheduling a 1:1 meeting.",
    scoringNotes:
      "Look for privacy, specificity, constructive tone, measurable gap, support offer, 1:1 next step, and no shaming language."
  },
  {
    title: "Data Breach Notification to Client CISO",
    difficulty: "advanced",
    category: "Crisis Communication",
    prompt:
      "During a security audit, IT By Design discovered that a misconfigured cloud storage bucket exposed non-sensitive employee records, names and emails, for client Ridgeline Healthcare for approximately 72 hours. The data is now secured. Write a notification email to the CISO, Dr. Priya Nair.",
    scoringNotes:
      "Look for precise facts, contained impact, current remediation, next investigative steps, responsible tone, and no minimization."
  },
  {
    title: "Team Policy Change Communication",
    difficulty: "advanced",
    category: "Internal Leadership",
    prompt:
      "IT By Design is rolling out mandatory weekend on-call rotation for all senior engineers starting next month. You are the Director of Operations. Write an email to your senior engineering team of 8 people explaining the change, the rationale, and how the company will support them.",
    scoringNotes:
      "Look for leadership clarity, rationale, fairness, support/compensation details, rollout timeline, feedback channel, and empathy."
  }
] as const;
