import { useContext, useState } from "react";
import ComponentContainer from "./ComponentContainer";
import {
  CanvasContext,
  IContextProps,
  TContentContainer,
} from "../context/CanvasContextProvider";

const ImageInput = ({ item }: { item: TContentContainer }) => {
  const { id, content } = item;
  const [imagePath, setImagePath] = useState<any>(content);

  const { sendJsonMessage } = useContext(CanvasContext) as IContextProps;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = Array.from(e.target.files ?? [])[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        setImagePath(reader.result);
        sendJsonMessage({
          topic: "valueChange",
          inputId: e.target.id,
          value: reader.result,
        });
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <ComponentContainer componentId={id}>
      {imagePath ? (
        <img src={imagePath} />
      ) : (
        <input type="file" id={id} onChange={(e) => handleUpload(e)} />
      )}
    </ComponentContainer>
  );
};

export default ImageInput;
