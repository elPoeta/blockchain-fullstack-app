import { useEffect, useState } from "react";
import { Block } from "./Block";
import { Nav } from "./Nav";

export const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [paginationId, setPaginationId] = useState(1);
  const [blocksLen, setBlocksLen] = useState(0);

  useEffect(() => {
    return async () => {
      const response = await fetch(`/api/v1/blocks-length`);
      const json = await response.json();
      setBlocksLen(json.length);
    };
  }, []);

  useEffect(() => {
    const fetchBlocks = async () => {
      const getUrl = () => `/api/v1/blocks/${paginationId}`;
      const response = await fetch(getUrl());
      const json = await response.json();
      setBlocks(json.blocks);
    };
    fetchBlocks(); 
  }, [paginationId]);

  const renderBlocks = () =>  blocks.map(block => <Block key={block.hash} block={block}/>);
   const paginationNumbers = () => [...Array(Math.ceil(blocksLen / 5)).keys()].map(key => {
    const pagination = key + 1;
    return( 
    <span key={pagination} 
    className="text-2xl p-3 cursor-pointer" 
    style={{color: paginationId === pagination ? '#db2777' : '#ffffff'}}
    onClick={() => setPaginationId( pagination) }
    >{pagination}</span>)
  });
  return (
    <div>
    <div className="grid gap-3 grid-cols-[500px] justify-center">
      <h2 className="font-bold text-2xl text-center p-6">Blocks</h2>
      <Nav to="/" title="Home"/>
      {renderBlocks()}
    </div>
    <div className="flex justify-center align-middle">
    {paginationNumbers()}
      </div>
    </div>
  );
};

;
