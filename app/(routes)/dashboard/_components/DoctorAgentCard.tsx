import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

type props = {
  doctorAgent: AIDoctorAgent;
};

const DoctorAgentCard = ({ doctorAgent }: props) => {
  return (
    <div>
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
      <Button className="w-full mt-2">
        Start Consultion <IconArrowRight />
      </Button>
    </div>
  );
};

export default DoctorAgentCard;
