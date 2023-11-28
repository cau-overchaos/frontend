import { useEffect, useRef, useState } from "react";
import CanvasController, { CanvasControllerProp } from "./canvasController";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Point, draw } from "./canvas";

type WSMessage = {
  messageType: "ENTER" | "DRAW" | "QUIT";
  sharedSourceCodeId: number;
  messageText: string | null;
  pointRequestDto: null | {
    delete: boolean;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string | null;
  };
};

function drawWithImageData(
  data: ImageData | null,
  a: Point,
  b: Point,
  erase?: boolean,
  color?: string
) {
  const width = Math.max(data?.width ?? 0, Math.max(a.x, b.x) + 10);
  const height = Math.max(data?.height ?? 0, Math.max(a.y, b.y) + 10);

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d");

  if (context === null) return data;

  if (data !== null) context.putImageData(data, 0, 0);
  console.log(width + " " + height + " draw from imgdata");
  return draw(
    {
      context,
      width,
      height
    },
    a,
    b,
    erase,
    color
  );
}

export default function SocketCanvas(
  props: Omit<
    CanvasControllerProp,
    "onErase" | "onDraw" | "imageData" | "onNewImageData"
  > & {
    sharedSourceCodeId: number;
  }
) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [lastSentMessageTime, setLastSentMessageTime] = useState<number>(
    Date.now()
  );
  const [receivedMessages, setReceivedMessages] = useState<WSMessage[]>([]);
  const [lastReceivedMessageTime, setLastReceivedMessageTime] =
    useState<number>(Date.now());
  const { sendMessage, readyState } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_ENDPOINT + "/ws/draw",
    {
      shouldReconnect: (_) => true,
      onMessage: (evt) => {
        setReceivedMessages((prev) =>
          prev.concat([JSON.parse(evt.data) as WSMessage])
        );
        setLastReceivedMessageTime(Date.now());
      }
    }
  );
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const [entered, setEntered] = useState<boolean>(false);

  const sendWs = (msg: Omit<WSMessage, "sharedSourceCodeId">) => {
    setMessages((prev) =>
      prev.concat([
        {
          ...msg,

          sharedSourceCodeId: props.sharedSourceCodeId
        }
      ])
    );
    setLastSentMessageTime(Date.now());
  };

  useEffect(() => {
    let idx = setInterval(() => {
      if (
        (Date.now() - lastSentMessageTime > 300 && messages.length > 0) ||
        messages.length > 30
      )
        while (true) {
          const msg = messages.pop();
          console.log("popping");
          if (typeof msg === "undefined") break;
          sendMessage(JSON.stringify(msg));
        }
    }, 100);

    return () => {
      if (idx !== null) {
        clearInterval(idx);
      }
    };
  });

  const applyMessageToData = (imgData: ImageData | null, data: WSMessage) => {
    console.log(data);
    if (data.messageType === "DRAW") {
      const start = {
        x: data.pointRequestDto!.startX,
        y: data.pointRequestDto!.startY
      };
      const end = {
        x: data.pointRequestDto!.endX,
        y: data.pointRequestDto!.endY
      };

      console.log(
        "Drawing from... " +
          JSON.stringify(start) +
          " to " +
          JSON.stringify(end) +
          " delete: " +
          data.pointRequestDto!.delete +
          " color: " +
          data.pointRequestDto?.color
      );

      return drawWithImageData(
        imgData,
        start,
        end,
        data.pointRequestDto!.delete ?? false,
        data.pointRequestDto?.color ?? "black"
      );
    } else {
      return imgData;
    }
  };

  useEffect(() => {
    let idx = setInterval(() => {
      if (
        (Date.now() - lastReceivedMessageTime > 300 &&
          receivedMessages.length > 0) ||
        receivedMessages.length > 50
      ) {
        let newImageData = imageData;
        while (true) {
          const msg = receivedMessages.pop();
          if (typeof msg === "undefined") break;
          newImageData = applyMessageToData(newImageData, msg);
        }
        setImageData(newImageData);
      }
    }, 100);

    return () => {
      if (idx !== null) {
        clearInterval(idx);
      }
    };
  });

  useEffect(() => {
    if (!entered && readyState === ReadyState.OPEN) {
      sendWs({
        messageType: "ENTER",
        messageText: null,
        pointRequestDto: null
      });
      setEntered(true);
    }
  }, [readyState, entered]);

  return (
    <CanvasController
      {...props}
      onDraw={(a, b, color, _) => {
        sendWs({
          messageType: "DRAW",
          messageText: "",
          pointRequestDto: {
            color,
            startX: a.x,
            startY: a.y,
            endX: b.x,
            endY: b.y,
            delete: false
          }
        });
      }}
      onErase={(a, b, _) => {
        sendWs({
          messageType: "DRAW",
          messageText: "",
          pointRequestDto: {
            color: "",
            startX: a.x,
            startY: a.y,
            endX: b.x,
            endY: b.y,
            delete: true
          }
        });
      }}
      imageData={imageData}
      onNewImageData={setImageData}
    ></CanvasController>
  );
}
