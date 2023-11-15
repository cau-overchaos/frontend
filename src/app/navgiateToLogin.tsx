export default function navigateToLogin() {
  location.assign("/login?redirect=" + encodeURIComponent(location.href));
}
