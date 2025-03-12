const displayPrice = ({ price, gst }: { price: number; gst?: number }) => {
  return (
    <>
      ₹{price.toFixed(2)}{' '}
      {gst ? (
        <>
          +<span className='text-xs'> {gst}% GST</span>
        </>
      ) : null}
    </>
  );
};

export default displayPrice;
