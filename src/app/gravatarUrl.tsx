import md5 from "md5";

export default function gravatarUrl(
  profileImgUrl: string | null,
  name: string | null,
  id: string | null
) {
  if (profileImgUrl !== null && typeof profileImgUrl !== "undefined")
    return profileImgUrl;
  return `https://www.gravatar.com/avatar/${md5(id ?? name ?? "")}?d=identicon`;
}
