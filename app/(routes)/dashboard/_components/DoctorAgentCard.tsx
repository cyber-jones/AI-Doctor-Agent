"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type props = {
  doctorAgent: AIDoctorAgent;
};

const DoctorAgentCard = ({ doctorAgent }: props) => {
  const { has } = useAuth();
  const router = useRouter();
  //@ts-ignore
  const hasPremuimAccess = has && has({ plan: "pro" });
  const [loading, setLoading] = useState<boolean>(false);
  
  const OnStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctorAgent,
      });

      router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute m-1 right-0">Premium</Badge>
      )}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={300}
        className="w-full h-57 object-cover rounded-xl"
      />
      <h2 className="font-bold mt-1">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">
        {doctorAgent.description}
      </p>
      <Button
        disabled={!hasPremuimAccess && doctorAgent.subscriptionRequired}
        className="w-full mt-2"
        onClick={OnStartConsultation}
      >
        Start Consultion {loading ? <Loader2Icon className="animate-spin"/> : <IconArrowRight />}
      </Button>
    </div>
  );
};

export default DoctorAgentCard;
