import Image from "next/image";

type props = {
  doctorAgent: AIDoctorAgent;
  setSelectedDoctor: any;
  selectedDoctor: AIDoctorAgent | undefined;
};

const SuggestedDocterCard = ({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: props) => {
  return (
    <div
      className={`flex flex-col items-center border rounded-2xl p-5 hover:border-blue-500 cursor-pointer ${
        selectedDoctor?.id == doctorAgent?.id && "border-blue-500"
      }`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent?.image}
        alt={doctorAgent?.specialist}
        width={70}
        height={70}
        className="w-12.5 h-12.5 rounded-4xl object-cover"
      />
      <h2 className="font-bold text-sm text-center">
        {doctorAgent?.specialist}
      </h2>
      <p className="text-xs text-gray-500 line-clamp-2">
        {doctorAgent?.description}
      </p>
    </div>
  );
};

export default SuggestedDocterCard;
