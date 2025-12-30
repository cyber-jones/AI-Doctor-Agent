"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | undefined>(
    undefined
  );
  const [callStarted, setCallStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<Object[]>([]);

  useEffect(() => {
    sessionId && GetSessionId();
  }, [sessionId]);

  const GetSessionId = async () => {
    try {
      const result = await axios.get(
        "/api/session-chat?sessionId=" + sessionId
      );
      setSessionDetail(result.data);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  const startCall = () => {
    setLoading(true);

    // const VapiConfig = {
    //   id: "8f8b2797-6816-40dd-85bd-a2ee8d24c69c",
    //   orgId: "0e39e041-7d7d-4fb4-812a-e9e75ba858c8",
    //   name: "General Physician",
    //   voice: {
    //     voiceId: "Elliot",
    //     provider: "vapi",
    //   },
    //   createdAt: "2025-12-18T00: 28: 37.571Z",
    //   updatedAt: "2025-12-18T00: 36: 31.370Z",
    //   model: {
    //     model: "gemini-2.5-flash",
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "You are a friendly General Physician AI. Greet the user and quickly ask what symptoms they’re experiencing. Keep responses short and helpful",
    //       },
    //     ],
    //     provider: "google",
    //   },
    //   firstMessage:
    //     "Hello! Thank you for connecting. Can you please tell me your full name and age",
    //   voicemailMessage: "Please call back when you're available.",
    //   endCallMessage: "Goodbye.",
    //   transcriber: {
    //     language: "multi",
    //     provider: "assembly-ai",
    //     formatTurns: true,
    //     speechModel: "universal-streaming-multilingual",
    //     languageDetection: true,
    //     confidenceThreshold: 0.4,
    //     disablePartialTranscripts: false,
    //   },
    //   analysisPlan: {
    //     summaryPlan: {
    //       enabled: false,
    //     },
    //     successEvaluationPlan: {
    //       enabled: false,
    //     },
    //   },
    //   isServerUrlSecretSet: false,
    // };

    const VapiAgentConfig = {
      name: "General Physician",
      firstMessage:
        "Hi there! I'm your AI medical assistant. How can I help you today?",
      transcriber: {
        provider: "assembly-ai",
        language: "multi",
      },
      voice: {
        provider: "vapi",
        voiceId: sessionDetail?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    // @ts-ignore
    // vapi.start(process.env.NEXT_PUBLIC_VAPI_AI_ASSISTANT_ID);
    vapi.start(VapiAgentConfig);

    vapi.on("call-start", () => {
      setLoading(false);
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setLoading(true);
      setCallStarted(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${role}: ${transcript}`);
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Final message
          setMessages((prev) => [...prev, { role: role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole("");
        }
      }
    });
    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
    vapi.on("error", (err) => {
      console.error("VAPI ERROR:", err);
      toast.error("Failed to start call: " + err?.error?.error?.message[0]);
    });
  };

  const endCall = async () => {
    if (!vapiInstance) return;

    vapiInstance.stop();

    vapiInstance.off("call-start", () => console.log("Call start off"));
    vapiInstance.off("call-end", () => console.log("Call end off"));
    vapiInstance.off("message", () => console.log("Call message off"));
    vapiInstance.off("speech-start", () => console.log("Call speech-start off"));
    vapiInstance.off("speech-end", () => console.log("Call speech-end off"));
    vapiInstance.off("error", () => console.log("Call error off"));

    await GenerateReport();
    setCallStarted(false);
    setLoading(false);
    setVapiInstance(null);
  };

  const GenerateReport = async () => {
    try {
      const res = await axios.post("/api/medical-report", {
        messages: messages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });

      console.log(res.data);
      return res.data;
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="p-5 border rouded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`w-4 h-4 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />{" "}
          {callStarted ? "On Call" : "Offline"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetail && (
        <div className="flex items-center flex-col mt-5">
          <Image
            src={sessionDetail?.selectedDoctor?.image}
            alt={sessionDetail?.selectedDoctor?.specialist}
            width={120}
            height={120}
            className="h-25 w-25 object-cover rounded-full"
          />
          <h2 className="mt-2 text=lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">AI Medical Voice</p>

          <div className="mt-12 w-full overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72">
            {messages.length > 0 &&
              messages.slice(-4).map((msg: any, index: number) => (
                <h2 key={index} className="text-gray-400">
                  {msg.role}: {msg.text}
                </h2>
              ))}

            {liveTranscript.length > 0 && (
              <h2 className="text-lg">
                {currentRole}: {liveTranscript}
              </h2>
            )}
          </div>
          {callStarted ? (
            <Button disabled={loading} variant={"destructive"} onClick={endCall} className="mt-20">
              <PhoneOff /> {loading ? "Disconnecting" : "Disconnect"} Disconnect
            </Button>
          ) : (
            <Button
              disabled={loading}
              onClick={startCall}
              className="mt-20 cursor-pointer"
            >
              <PhoneCall /> {loading ? "Starting Call" : "Start Call"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalVoiceAgent;
