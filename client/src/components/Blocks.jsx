import { useEffect, useState } from "react";
import { Block } from "./Block";

export const Blocks = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    return async () => {
      const response = await fetch("/api/v1/blocks");
      const json = await response.json();
      setBlocks(json.blocks);
    };
  }, []);

  const renderBlocks = () =>  blocks.map(block => <Block key={block.hash} block={block}/>);
  
  return (
    <div className="grid gap-3 grid-cols-[500px]">
      <h2 className="font-bold text-2xl text-center p-6">Blocks</h2>
      {renderBlocks()}
    </div>
  );
};

;
