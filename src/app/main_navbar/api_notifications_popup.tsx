import { useEffect, useState } from "react";
import NotificationPopup from "./nofitications_popup.module";
import { Notifcation } from "../api_client/notifications";
import apiClient from "../api_client/api_client";

export default function ApiNotificationsPopup() {
  const [loading, setLoading] = useState<boolean>(true);
  const [notifcations, setNotifications] = useState<Notifcation[]>([]);

  useEffect(() => {
    if (loading) {
      apiClient
        .notifications()
        .getNofications()
        .then(setNotifications)
        .then(() => {
          setLoading(false);
        });
    }
  }, [loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      apiClient.notifications().getNofications().then(setNotifications);
    }, 500);

    return () => clearInterval(interval);
  });

  return (
    <NotificationPopup
      notifications={notifcations
        .filter((i) => i.isNew)
        .map((i) => ({
          href: "#",
          id: i.id,
          text: i.content
        }))}
      onMarkReadAllCLick={() => {
        apiClient
          .notifications()
          .markReadAll()
          .then(() => setLoading(true));
      }}
    ></NotificationPopup>
  );
}
