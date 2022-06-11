export const Block = ({ block }) => {
  const { timestamp, hash, data} = block; 
  return(
    <>
    <h4>Date: {new Date(timestamp).toDateString()}</h4>
    <h5>Hash: {hash}</h5>
    <h6>{JSON.stringify(data)}</h6>
    </>
  )
}