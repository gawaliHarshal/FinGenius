import { auth } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("No authenticated user found");

    // Try to find existing user in DB
    let loggedInUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    // If user doesn't exist, create it
    if (!loggedInUser) {
      loggedInUser = await db.user.create({
        data: {
          clerkUserId: userId,
          name: "New User",
          imageUrl: "",
          email: "",
        },
      });
    }

    console.log("🧠 Clerk userId:", userId);
    console.log("🗃️ Prisma user:", loggedInUser);

    return loggedInUser;
  } catch (error) {
    console.error("❌ checkUser error:", error.message);
    throw new Error("Failed to verify or create user");
  }
};
