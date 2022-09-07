const CknftAttribute = ({ metadata, traitNum }) => {
  return (
    <div className="custom-attribute">
      <span className="custom-attribute__trait">{metadata.attributes[traitNum].trait_type}</span>
      <span className="custom-attribute__value">{metadata.attributes[traitNum].value}</span>
    </div>
  );
};

export default CknftAttribute;
