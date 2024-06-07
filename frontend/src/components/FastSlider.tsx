import { Slider } from "@mui/material";
import { useState } from "react";

interface FastSliderProps {
  setValue: (value: number[]) => void;
  startValue: number;
  endValue: number;
}

const FastSlider: React.FC<FastSliderProps> = ({
  setValue,
  startValue,
  endValue,
}) => {
  const [previewValue, setPreviewValue] = useState<number[]>([
    startValue,
    endValue,
  ]);
  return (
    <Slider
      defaultValue={[startValue, endValue]}
      value={previewValue}
      onChange={(event, newValue) => {
        setPreviewValue(newValue as number[]);
      }}
      onChangeCommitted={(event, newValue) => {
        setValue(newValue as number[]);
      }}
      valueLabelDisplay="auto"
      min={startValue}
      max={endValue}
      sx={{ width: 300 }} // Adjust the width to fit within the layout
    ></Slider>
  );
};

export default FastSlider;
