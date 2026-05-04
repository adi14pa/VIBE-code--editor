"use server";

import { prisma } from "@/lib/db";
import { TemplateFolder } from "../lib/path-to-json";
import { currentUser } from "@/modules/auth/actions";
import prismaConfig from "@/prisma.config";

export const getPlaygroundById = async (id: string) => {
  try {
    const playground = await prisma.playground.findUnique({
      where: { id },
      select: {
        title: true,
        templateFiles: {
          select: {
            content: true,
          },
        },
      },
    });
    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const SaveUpdatedCode = async (
  playgroundId: string,
  data: TemplateFolder,
) => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const updatedPlayground = await prisma.templateFile.upsert({
      where: {
        playgroundId,
      },
      update: {
        content: JSON.stringify(data),
      },
      create: {
        playgroundId,
        content: JSON.stringify(data),
      },
    });

    return updatedPlayground;
  } catch (error) {
    console.log("SaveUpdatedCode error:", error);
    return null;
  }
};
