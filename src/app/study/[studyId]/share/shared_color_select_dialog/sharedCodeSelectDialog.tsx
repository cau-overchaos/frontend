"use client";

import apiClient from "@/app/api_client/api_client";
import { SharedSourceCode } from "@/app/api_client/studyroom";
import { Button } from "@/app/common/inputs";
import Popup from "@/app/popup/popup";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";

type Props = {
  onCloseClick: () => void;
  onSelect: (selected: SharedSourceCode) => void;
  studyRoomId: number;
  buttonLabel?: string;
};

export default function SharedCodeSelectPopup(props: Props) {
  const [sharedCodes, setSharedCodes] = useState<SharedSourceCode[] | null>(
    null
  );
  const [selectedSharedCode, setSelectedSharedCode] =
    useState<SharedSourceCode | null>(null);
  const mapSharedCode = (i: SharedSourceCode) => ({
    label: `${i.title} (${i.problem.title} by ${i.writer.nickname}, ${i.language.name})`,
    value: i.id,
    data: i
  });

  useEffect(() => {
    if (sharedCodes === null)
      apiClient
        .studyroom(props.studyRoomId)
        .sharedSourceCodes()
        .then(setSharedCodes);
  }, [sharedCodes]);

  return (
    <Popup
      onCloseClick={props.onCloseClick}
      popupStyles={{ height: "500px", width: "500px" }}
    >
      {sharedCodes === null ? (
        "로딩중입니다...."
      ) : (
        <>
          <h1>선택</h1>
          <ReactSelect
            options={sharedCodes.map(mapSharedCode)}
            value={selectedSharedCode && mapSharedCode(selectedSharedCode)}
            styles={{
              menu: (baseStyles, _state) => ({
                ...baseStyles,
                zIndex: 100
              })
            }}
            onChange={(value) => {
              if (value === null) setSelectedSharedCode(null);
              else
                setSelectedSharedCode(
                  sharedCodes.filter((i) => i.id === value.value)[0]
                );
            }}
          ></ReactSelect>
          <br></br>
          <Button
            onClick={() => {
              if (selectedSharedCode === null)
                return alert("코드를 선택해주세요!");
              props.onSelect(selectedSharedCode);
            }}
          >
            {props.buttonLabel ?? "선택"}
          </Button>
        </>
      )}
    </Popup>
  );
}
