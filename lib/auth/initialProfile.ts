import { SignIn, currentUser, redirectToSignIn, useUser } from "@clerk/nextjs";
import db from "@/lib/db/index";
import { redirect } from "next/navigation";
const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in")
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user?.id,
    },
  });

  if (profile) {
    return profile;
  }

  const username = `${user.firstName}${Math.floor(
    1000 + Math.random() * 9000
  )}`.toLocaleLowerCase();
  const newProfile = await db.profile.create({
    data: {
      userId: user?.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      username,
    },
  });

  return newProfile;
};

export default initialProfile;
