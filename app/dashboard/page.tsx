import {
  deleteProjectById,
  duplicateProjectById,
  editProjectById,
  getAllPlaygroundForUser,
} from "@/modules/dashboard/actions";
import AddNewButton from "@/modules/dashboard/components/add-new";
import AddRepo from "@/modules/dashboard/components/add-repo";
import EmptyState from "@/modules/dashboard/components/empty-state";
import ProjectTable from "@/modules/dashboard/components/project-table";
import React from "react";

const Page = async () => {
  return (
    <div className="flex flex-col justify-start items-center min-h-screen mx-auto max-w-7xl px-4 py-10 gap-6">
      <AddNewButton />
      <AddRepo />
    </div>
  );
};

export default Page;