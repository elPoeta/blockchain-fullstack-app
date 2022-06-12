export const Block = ({ block }) => {
  const { timestamp, hash, data} = block; 
  const shortenHash = `${hash.substring(0,15)}...`;
  const dataString = JSON.stringify(data);
  const shortenData = dataString.length > 50 ? `${dataString.substring(0,50)}...` : dataString;
  return(
    <div className="border-2 border-blue-400 break-words p-4 text-xl flex flex-col gap-3">
      <h4 className="text-pink-500">Date: {new Date(timestamp).toLocaleString()}</h4>
      <h5 className="text-orange-400" data-hash={hash}>Hash: {shortenHash}</h5>
      <h6 data-fulldata={data}>{shortenData}</h6>
    </div>
  )
}