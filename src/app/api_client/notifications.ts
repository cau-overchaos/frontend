import { ApiFetcher } from "./api_client";

export type Notifcation = {
  id: number;
  content: string;
  isNew: boolean;
  createdAt: Date;
};

export default function createNotificationClient(fetch: ApiFetcher) {
  return {
    async getNofications(): Promise<Notifcation[]> {
      const response = await fetch("/notifications");

      return response.data.notificationDtoList.map((i: any) => {
        const { id, content, isNew, createdAt } = i;
        return {
          id: parseInt(id),
          content,
          isNew,
          createdAt: new Date(createdAt)
        } as Notifcation;
      });
    },
    async markReadAll(): Promise<void> {
      await fetch("/notifications/read", {
        method: "POST"
      });
    },
    async hasNewNotifciation(): Promise<boolean> {
      return (await fetch("/notifications/exist-new")).data;
    }
  };
}
