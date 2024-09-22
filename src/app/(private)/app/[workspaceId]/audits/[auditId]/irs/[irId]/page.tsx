import { Card } from "@/components/card";
import { TopBar } from "@/components/top-bar";
import { FileQuestion } from "lucide-react";
import React from "react";

const InformationRequestPage = () => {
  return (
    <div className="">
      <TopBar className="justify-between">
        <div className="flex items-center">
          <FileQuestion className="mr-2" size={16} />
          <span>Admin </span> / Users
        </div>
      </TopBar>
      <div className="p-8 w-full max-w-container mx-auto flex flex-col gap-8">
        <Card title="Header" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
        <Card title="Body" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
        <Card title="Action Requested" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
        <Card title="Amount" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
        <Card title="Responses" className="">
          <div className="italic mb-14">Comming Soon...</div>
        </Card>
      </div>
    </div>
  );
};

export default InformationRequestPage;
