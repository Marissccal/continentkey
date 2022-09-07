const CknftAttribute = ({ metadata1, traitNum }) => {
  return (
    <div className="custom-attribute">
      <span className="custom-attribute__trait">{metadata1.attributes[traitNum].trait_type}</span>
      <span className="custom-attribute__value">{metadata1.attributes[traitNum].value}</span>
    </div>
  );
};

export default CknftAttribute;
