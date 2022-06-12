export const Transaction = ({ tx }) => {
  const {input, outputMap} = tx;
  const recipients = Object.keys(outputMap);
  return (
    <div>
      <hr className="p-5"/>
      { input &&
       <div>
        <h6>From: {`${input.address.substring(0,20)}...`}</h6>
        <h6>Balance: {input.amount}</h6>
      </div> }
      <div>
      { recipients.map(recipient => (
        <div key={recipient}>
          <h6>To: {`${recipient.substring(0,20)}...`}</h6>
          <h6>Sent: {outputMap[recipient]}</h6>
        </div>
      ))}
      </div>
    </div>
  )
}