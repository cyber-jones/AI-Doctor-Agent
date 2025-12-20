declare global {
  type UserDetail = {
    name: string;
    email: string;
    credits: number;
  };

  type MenuOption = {
    id: number;
    name: string;
    path: string;
  };

  type AIDoctorAgent = {
    id: number;
    specialist: string;
    description: string;
    image: string;
    agentPrompt: string;
    voiceId?: string;
    subscriptionRequired: boolean;
  };

  type SessionDetail = {
    id: number;
    notes: string;
    sessionId: string;
    report: JSON;
    selectedDoctor: AIDoctorAgent;
    createdOn: string;
  };

  type message = {
    role: "user" | "assistant";
    text: string;
  };
}

export {};
