"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SuggestedDocterCard from "./SuggestedDocterCard";
import { useRouter } from "next/navigation";
import { AIDoctorAgents } from "@/lib/list";

const AddNewSessionDialog = () => {
  const [note, setNote] = useState<string>("I have an headache");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<
    AIDoctorAgent | undefined
  >(undefined);
  const [suggestedDoctors, setSuggestedDoctors] = useState<
    AIDoctorAgent[] | undefined
  >(AIDoctorAgents.slice(0, 3));
  const router = useRouter();

  const OnClickNext = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", { notes: note });
      console.log(result);
      if (result.data?.status == 429)
        toast.error(
          "You have reached the limit. Please try again later." +
            result.data?.error?.message
        );
        
        setSuggestedDoctors(result.data);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.log("Error creating session:", error);
    } finally {
      setLoading(false);
    }
  };

  const OnStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });
      console.log(result);
      router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="mt-3">Start a Consultation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add Basic Details</DialogTitle>
            <DialogDescription>
              {!suggestedDoctors
                ? "Add Symptons or Any other Details"
                : "Select doctor"}
            </DialogDescription>
          </DialogHeader>
          {!suggestedDoctors ? (
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="username-1">Details</Label>
                <Textarea
                  id="username-1"
                  name="username"
                  placeholder="Add Detail here..."
                  className="h-37 mt-1"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {suggestedDoctors &&
                suggestedDoctors.map((doctor, index) => (
                  <SuggestedDocterCard
                    key={index}
                    doctorAgent={doctor}
                    setSelectedDoctor={setSelectedDoctor}
                    selectedDoctor={selectedDoctor}
                  />
                ))}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {selectedDoctor ? (
              <Button className="cursor-pointer" onClick={OnStartConsultation}>
                Start Consultation{" "}
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
              </Button>
            ) : (
              <Button
                disabled={!note || loading}
                type="submit"
                onClick={OnClickNext}
              >
                Next{" "}
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddNewSessionDialog;
