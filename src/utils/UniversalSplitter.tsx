import React from "react";
import { Splitter } from "antd";



// Splitter komponenti uchun interfeys
interface SplitterProps {
  leftText?: string | number; // Chap paneldagi matn
  rightText?: string | number; // O‘ng paneldagi matn
  leftContent?: React.ReactNode | string; // Chap panel tarkibi
  rightContent?: React.ReactNode | string; // O‘ng panel tarkibi
  leftSize?: string | number; // Chap panel o‘lchami
  minSize?: string | number; // Minimal o‘lcham
  maxSize?: string | number; // Maksimal o‘lcham
  splitterStyle?: React.CSSProperties; // Splitterning umumiy stili
}

// Universal Splitter komponenti
const UniversalSplitter: React.FC<SplitterProps> = ({
  // leftText,
  // rightText,
  leftContent,
  rightContent,
  leftSize = "40%",
  minSize = "20%",
  maxSize = "80%",

}) => (
  <Splitter className="splitter" >
    <Splitter.Panel defaultSize={leftSize} min={minSize} max={maxSize}>
      <div style={{ padding: 10 }}>
        {leftContent}
      </div>

    </Splitter.Panel>
    <Splitter.Panel>
      <div style={{ padding: 10 }}>
        {rightContent}
      </div>
    </Splitter.Panel>

  </Splitter>
);

export default UniversalSplitter;