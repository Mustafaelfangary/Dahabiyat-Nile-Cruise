import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  cruiseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      
      if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
 
      return { userId: session.user.id };
    })    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
  contentImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      
      if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
 
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
  cruiseVideo: f({ video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      
      if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }
 
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
