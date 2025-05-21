function InfoBox({ label, value }) {
  return (
    <>
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <p className="text-xs md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
}

export default InfoBox;
