import { useState } from "react";
import ComponentContainer from "./ComponentContainer";
import { TContentContainer } from "../context/CanvasContextProvider";

const ImageInput = ({ item }: { item: TContentContainer }) => {
  const { id, content } = item;
  const [imagePath, setImagePath] = useState<any>(content);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = Array.from(e.target.files ?? [])[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        setImagePath(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <ComponentContainer componentId={id}>
      <input type="file" onChange={(e) => handleUpload(e)} />
      <img src={imagePath} />
    </ComponentContainer>
  );
};

export default ImageInput;
