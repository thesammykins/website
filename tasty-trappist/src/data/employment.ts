// Set availableForDeployment to true to restore the job-seeking state everywhere.
// When a role ends, add it to the experience history and update these two values.
export const employment = {
    availableForDeployment: false,
    availableSince: "Jun 2026",
    lastEmployer: "Ferocia",
    currentRole: {
        title: "IT SUPPORT ENGINEER",
        company: "Zapier",
        companyUrl: "https://zapier.com/",
        logo: "/logos/zapier.png",
        location: "Melbourne",
        period: "Aug 2026 – Present",
        description: "I joined Zapier as an IT Support Engineer in August 2026.",
        achievements: [],
        tags: ["IT SUPPORT"],
    },
};

// The availability card is retained here, but is not rendered while employed.
export const deployment = employment.availableForDeployment
    ? {
        title: "AVAILABLE FOR DEPLOYMENT",
        company: "Actively Seeking New Opportunities",
        companyUrl: null,
        logo: null,
        location: "Melbourne",
        period: `${employment.availableSince} – Present`,
        description: `After wrapping up at ${employment.lastEmployer}, I'm actively exploring my next move. If you know of a role — or someone who might — that you think would be a good fit, I'd love to hear about it.`,
        achievements: [
            "Open to Corporate Engineering Manager, Technical Support Lead, and IT Operations roles",
            "If something comes to mind, reach out via the contact page — I'd appreciate the lead",
        ],
        tags: ["OPEN TO WORK", "SEEKING", "LEADERSHIP", "OPERATIONS"],
    }
    : employment.currentRole;
