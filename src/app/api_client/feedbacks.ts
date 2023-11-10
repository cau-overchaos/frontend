import { ApiFetcher } from "./api_client";

export type LineFeedback = {
  id: number;
  comment: string;
  deleted: boolean;
  writer: {
    nickname: string;
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
export type LineFeedbackWithChildren = LineFeedback & {
  children: LineFeedback[];
};
export type LineFeedbackCreationForm = {
  lineNumber: number;
  comment: string;
  replyToId?: number;
};

export type FeedbackClient = {
  getFeedbacksByLineNumber: (
    lineNumber: number
  ) => Promise<LineFeedbackWithChildren[]>;
  postFeedback: (form: LineFeedbackCreationForm) => Promise<LineFeedback>;
  updateFeedback: (
    feedbackId: number,
    comment: string
  ) => Promise<LineFeedback>;
  deleteFeedback: (feedbackId: number) => Promise<void>;
};

export default function createFeedbackClient(
  fetchApi: ApiFetcher,
  roomId: number,
  sharedSourceCodeId: number
): FeedbackClient {
  const transformResponseObj = (obj: any): LineFeedback => ({
    id: obj.feedbackId,
    comment: obj.comment,
    deleted: obj.isDeleted,
    writer: {
      nickname: obj.writerName,
      id: obj.writerUserId
    },
    createdAt: new Date(obj.createdAt),
    updatedAt: new Date(obj.updatedAt)
  });

  return {
    async getFeedbacksByLineNumber(
      lineNumber: number
    ): Promise<LineFeedbackWithChildren[]> {
      const response = await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes/${sharedSourceCodeId}/feedbacks?lineNumber=${lineNumber}`,
        {
          method: "GET"
        }
      );

      return response.data.feedbackGroupByParentResponseDtoList.map(
        (i: any) =>
          ({
            ...transformResponseObj(i.parentFeedbackResponseDto),
            children:
              i.childrenFeedbackResponseDtoList.map(transformResponseObj)
          } as LineFeedbackWithChildren)
      );
    },
    async postFeedback(form: LineFeedbackCreationForm): Promise<LineFeedback> {
      const response = await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes/${sharedSourceCodeId}/feedbacks`,
        {
          method: "POST",
          body: JSON.stringify({
            comment: form.comment,
            lineNumber: form.lineNumber,
            replyParentFeedbackId: form.replyToId
          })
        }
      );

      return transformResponseObj(response.data);
    },
    async updateFeedback(
      feedbackId: number,
      comment: string
    ): Promise<LineFeedback> {
      const response = await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes/${sharedSourceCodeId}/feedbacks/${feedbackId}`,
        {
          method: "POST",
          body: JSON.stringify({
            comment
          })
        }
      );

      return transformResponseObj(response.data);
    },
    async deleteFeedback(feedbackId: number): Promise<void> {
      await fetchApi(
        `/studyrooms/${roomId}/shared-sourcecodes/${sharedSourceCodeId}/feedbacks/${feedbackId}`,
        {
          method: "DELETE"
        }
      );
    }
  };
}
