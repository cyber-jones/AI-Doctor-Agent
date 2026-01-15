import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import moment from "moment";

type Props = {
  record: SessionDetail;
};

const ViewReportDialog = ({ record }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"}>
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Medical AI Voice Agent Report</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-10">
              <h2 className="font-bold text-lg text-blue-500 mb-4">Video Info</h2>
              <div className="grid grid-cols-2">
                <div className="">
                  <h2 className="font-bold">Doctor Specialization: {record.selectedDoctor?.specialist}</h2>
                  <h2>Consultation Date: {moment(new Date(record?.createdOn)).fromNow()}</h2>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
