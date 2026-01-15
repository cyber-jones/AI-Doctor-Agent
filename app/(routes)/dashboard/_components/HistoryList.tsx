"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import { toast } from "sonner";
import { HistoryTable } from "./HistoryTable";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);

  useEffect(() => {
    GetHostoryList();
  }, []);

  const GetHostoryList = async (): Promise<void> => {
    try {
      const res = await axios.get("/api/session-chat?sessionId=all");
      console.log(res);
      setHistoryList(res.data);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };
  
  return (
    <div className="mt-10">
      {historyList.length == 0 ? (
        <div className="flex items-center flex-col justify-center p-7 border-2 border-dashed rounded-2xl">
          <Image
            src={"/medical-assistance.png"}
            alt="empty"
            width={150}
            height={150}
          />
          <h2 className="font-bold text-xl mt-2">No Recent Consultations</h2>
          <p>It looks like you haven't consulted with any doctor</p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>
          { historyList.length > 0 && <HistoryTable historyList={historyList} />}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
