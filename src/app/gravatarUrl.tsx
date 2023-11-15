import md5 from "md5";
import DefaultProfileImageUrl from "./default_profile_image_url";

export default function gravatarUrl(
  profileImgUrl: string | null,
  id: string | null,
  name: string | null
) {
  if (profileImgUrl !== null && typeof profileImgUrl !== "undefined")
    return profileImgUrl;

  if (id === null && name === null) return DefaultProfileImageUrl();
  return `https://www.gravatar.com/avatar/${md5(id ?? name ?? "")}?d=identicon`;
}
