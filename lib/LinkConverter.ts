export const avatarEncoder = (avatar: string) => {
  if (!avatar) return "./default.png";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("blob")) return avatar;
  return process.env.NEXT_PUBLIC_API_URL + "/storage/api/v1/files/" + avatar;
};
