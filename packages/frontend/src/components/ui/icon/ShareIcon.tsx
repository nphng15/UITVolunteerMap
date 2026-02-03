import React from "react";

const ShareIcon = ({
  size = 24,
  color = "#000000",
  strokeWidth = 2,
  background = "transparent",
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0,
}) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push("scaleX(-1)");
  if (flipVertical) transforms.push("scaleY(-1)");

  const viewBoxSize = 24 + padding * 2;
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(" ") || undefined,
        filter:
          shadow > 0
            ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))`
            : undefined,
        backgroundColor:
          background !== "transparent" ? background : undefined,
      }}
    >
      <path
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186
           m0-2.186c.18.324.283.696.283 1.093
           s-.103.77-.283 1.093
           m0-2.186l9.566-5.314
           m-9.566 7.5l9.566 5.314
           m0 0a2.25 2.25 0 1 0 3.935 2.186
           a2.25 2.25 0 0 0-3.935-2.186
           m0-12.814a2.25 2.25 0 1 0 3.933-2.185
           a2.25 2.25 0 0 0-3.933 2.185"
      />
    </svg>
  );
};

export default ShareIcon;
